import os, logging, json
from django.utils import timezone

from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.conf import settings

import apps.src.models as model
from apps.site.models import Tizorbank
from apps.src.functions import updateTransaction, updateJson, sendEmail

logger = logging.getLogger(__name__)

@receiver(post_save, sender=model.Account)
def updateAccount(sender, instance, created, **kwargs):
    if created:
        instance.interest = Tizorbank.objects.get(default="Tizorbank").min_interest
        instance.save()
        
    file_path = os.path.join(settings.BASE_DIR, 'data', f'{instance.username}.json')
    user_data = {
        "id": str(instance.uuid),
        "email": instance.email,
        "data": []
    }

    if not os.path.exists(file_path):
        try:
            with open(file_path, 'w') as file:
                json.dump(user_data, file, indent=4)
        except Exception as e:
            logger.error(f"Error creating JSON for user {instance.username}: {e}")

@receiver(pre_save, sender=model.Invoice)
def updateInvoice(sender, instance, **kwargs):
    obj = model.Invoice.objects.filter(pk=instance.pk).first()
    if obj and not kwargs.get('created', False):
        if obj.state != "done" and instance.state == "done":
            try:
                user = instance.account
                amount = instance.amount
                updateTransaction(user, 'done', instance.voucher)
                user.balance += amount
                user.save()
                
                updateJson(user, user.balance)
                
                try:
                    tz = Tizorbank.objects.get(default="Tizorbank")
                    template_url = tz.template_invoice_status if tz.template_invoice_status else "mail/demo/template_invoice_status.html"
                    email_list=[user.email]
                    context_data = {'voucher': obj.voucher, 'amount': amount}
                    sendEmail(f'Tizorbank - Payment Successful-{context_data["voucher"]}', template_url, email_list, context_data)
                except Exception as e:
                    logger.error("sendEmail Error --> updateInvoice %s: %s", user.email, e, exc_info=True)
                    logger.error("%s", e, exc_info=True)
                
            except Exception as e:
                logger.error("%s", e, exc_info=True)


@receiver(pre_save, sender=model.Withdrawal)
def updateWithdrawal(sender, instance, **kwargs):
    obj = model.Withdrawal.objects.filter(pk=instance.pk).first()
    if obj and not kwargs.get('created', False):
        if obj.state != "done" and instance.state == "done":
            try:
                user = instance.account
                updateTransaction(user, 'done', instance.voucher)

                try:
                    tz = Tizorbank.objects.get(default="Tizorbank")
                    template_url = tz.template_withdrawal_status if tz.template_withdrawal_status else "mail/demo/template_withdrawal_status.html"
                    email_list=[user.email]
                    context_data = {'voucher': instance.voucher, 'amount': instance.amount, 'network': instance.network, 'address': instance.address}
                    sendEmail(f'Tizorbank - Transfer Successful-{context_data["voucher"]}', template_url, email_list, context_data)
                except Exception as e:
                    logger.error("sendEmail Error --> updateWithdrawal %s: %s", user.email, e, exc_info=True)
                    logger.error("%s", e, exc_info=True)

            except Exception as e:
                logger.error("%s", e, exc_info=True)

