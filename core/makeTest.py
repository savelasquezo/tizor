
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

import logging
from typing import Optional
from django.utils import timezone

from apps.src.models import Account, Transaction
from apps.site.models import Tizorbank

logger = logging.getLogger(__name__)

def makeTransaction(user: Account, amount: float, type: str) -> Optional[Transaction]:
    return Transaction.objects.create(account=user,**{'amount':amount,'type':type,'state':'done'})

def daily(balance: float, interest: float) -> float:
    return balance * ((1 + interest*0.01) ** (1/365) - 1)

def main():
    print(f'CronJob -{timezone.now().strftime("%Y-%m-%d %H:%M")}')
    logger.error("%s", f'CronJob -{timezone.now().strftime("%Y-%m-%d %H:%M")}', exc_info=True)

    list_user = Account.objects.filter(is_active=True, balance__gt=0)
    interest_ref = Tizorbank.objects.get(default="Tizorbank").ref

    for user in list_user:

        balance = user.balance
        interest = user.interest
        amount = daily(balance, interest)
        user.balance += amount + amount_ref
        makeTransaction(user, amount, 'interest')

        list_ref = list_user.filter(ref=user.uuid)
        amount_ref = 0
        for ref in list_ref:
            amount_ref += daily(ref.balance, interest_ref)

        user.profit += amount + amount_ref
        makeTransaction(user, amount_ref, 'ref')

        user.save()

if __name__ == '__main__':
    main()