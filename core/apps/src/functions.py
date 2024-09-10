from typing import Optional
from django.db import transaction
from apps.src.models import Account, Transaction

def makeTransaction(user: Account, amount: float, type: str, state: str, voucher: Optional[str] = None) -> Optional[Transaction]:
    data = {'amount': amount, 'type': type, 'state': state}
    with transaction.atomic():
        obj, created = Transaction.objects.get_or_create(account=user, state='invoiced', voucher=voucher, defaults={**data})
        if not created:
            for attr, value in data.items():
                setattr(obj, attr, value)
            obj.save()
    return obj

def updateTransaction(user: Account, state: str, voucher: str) -> Optional[Transaction]:
    obj = Transaction.objects.get(account=user, voucher=voucher)
    obj.state = state
    obj.save()
