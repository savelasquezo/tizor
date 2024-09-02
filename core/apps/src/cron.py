import logging
from django.utils import timezone
from apps.src.models import Account
from apps.site.models import Tizorbank
from apps.src.functions import makeTransaction

logger = logging.getLogger(__name__)

def daily(balance: float, interest: float) -> float:
    return balance * ((1 + interest*0.01) ** (1/365) - 1)

def AddFunds():
    
    try:
        list_user = Account.objects.filter(is_active=True, balance__gt=0)
        interest_ref = Tizorbank.objects.get(default="Tizorbank").ref

        for user in list_user:

            balance = user.balance
            interest = user.interest
            amount = daily(balance, interest)
            makeTransaction(user, amount, 'interest','done')

            list_ref = list_user.filter(ref=user.uuid)
            amount_ref = 0
            for ref in list_ref:
                amount_ref += daily(ref.balance, interest_ref)

            user.balance += amount + amount_ref
            user.profit += amount + amount_ref
            makeTransaction(user, amount_ref, 'ref','done')
            user.save()
            
    except Exception as e:
        print(f'AddFunds Error-{e}')

    

