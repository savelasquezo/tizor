import logging

from django.utils import timezone
from django.db.models import Sum
from django.conf import settings

from apps.src.models import Account, Investment
from apps.site.models import Tizorbank
from apps.src.functions import makeTransaction, makeHistory, updateJson, sendEmail

logger = logging.getLogger(__name__)

def daily(amount: float, interest: float) -> float:
    return amount * ((1 + interest*0.01) ** (1/365) - 1)


def AddFunds():
    
    try:
        list_user = Account.objects.filter(is_active=True, balance__gt=0)
        tz = Tizorbank.objects.get(default="Tizorbank")

        for user in list_user:

            balance = user.balance
            interest = user.interest
            amount = daily(balance, interest)
            makeTransaction(user, amount, 'interest','done', None)

            list_ref = list_user.filter(ref=user.uuid)
            amount_ref = 0
            for ref in list_ref:
                totalref = ref.balance + (Investment.objects.filter(account=ref).aggregate(total=Sum('amount'))['total'] or 0)
                amount_ref += daily(totalref, tz.ref)

            if amount_ref > 0:
                makeTransaction(user, amount_ref, 'ref','done')

            user.balance += amount + amount_ref
            user.profit += amount + amount_ref
            user.save()
            
            list_investments = Investment.objects.filter(account=user)
            for invest in list_investments:
                if invest.date_target <= timezone.now().date() and invest.state == 'active':
                    invest.state = 'inactive'
                    total_invest = invest.amount + invest.accumulated
                    user.balance += total_invest
                    user.profit += invest.accumulated
                    invest.save()
                    user.save()
                    
                    makeTransaction(user, total_invest, 'investment','done')
                    makeHistory(user, invest, invest.accumulated, 'closure')
                    
                    try:
                        template_url = tz.template_investment_status if tz.template_investment_status else "mail/demo/template_investment_status.html"
                        email_list=[user.email]
                        context_data = {'voucher': invest.voucher, 'amount': total_invest, 'state': invest.state}
                        sendEmail(f'Tizorbank - Investment-{context_data["voucher"]}', template_url, email_list, context_data)
                    except Exception as e:
                        logger.error("sendEmail Error --> cronService %s: %s", user.email, e, exc_info=True)
                        logger.error("%s", e, exc_info=True)

                if invest.date_target > timezone.now().date() and invest.state == 'active':
                    total_invest = invest.amount + invest.accumulated
                    daily_interest = daily(total_invest, invest.interest)
                    invest.accumulated += daily_interest
                    invest.save()
                    
                    makeHistory(user, invest, daily_interest, 'interest')
            
            updateJson(user, user.balance)

    except Exception as e:
        logger.error("%s", e, exc_info=True)

