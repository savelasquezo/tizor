import os, logging
from django.utils import timezone

from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.conf import settings

import apps.src.models as model
from apps.src.functions import updateTransaction

logger = logging.getLogger(__name__)

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

            except Exception as e:
                logger.error("%s", e, exc_info=True)

