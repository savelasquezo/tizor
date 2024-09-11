
import os, json, logging
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.conf import settings
from django.db.models import Sum
from django.utils import timezone

from apps.src.models import Account, Investment
from apps.site.models import Tizorbank
from apps.src.functions import makeTransaction, makeHistory

logger = logging.getLogger(__name__)

def daily(amount: float, interest: float) -> float:
    return amount * ((1 + interest*0.01) ** (1/365) - 1)

def updateJson(user, amount, history):
    file_path = os.path.join(settings.BASE_DIR, 'data', f'{user.username}.json')

    user_data = {
        "id": str(user.uuid),
        "email": user.email,
        "data": []
    }

    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            try:
                user_data = json.load(file)
            except json.JSONDecodeError:
                logger.error(f"Error decoding JSON for user {user.username}")
    
    user_data["data"].append({
        "date": timezone.now().strftime('%Y-%m-%d'),
        "balance": round(amount, 2),
        "history": history
    })

    with open(file_path, 'w') as file:
        json.dump(user_data, file, indent=4)

def main():
    print(f'CronJob -{timezone.now().strftime("%Y-%m-%d %H:%M")}')
    logger.info("%s", f'CronJob -{timezone.now().strftime("%Y-%m-%d %H:%M")}', exc_info=True)

    list_user = Account.objects.filter(is_active=True)
    interest_ref = Tizorbank.objects.get(default="Tizorbank").ref

    for user in list_user:

        balance = user.balance
        interest = user.interest
        amount = daily(balance, interest)
        makeTransaction(user, amount, 'interest','done', None)

        list_investments = Investment.objects.filter(account=user)
        for invest in list_investments:
            daily_interest = daily(invest.amount, invest.interest)
            invest.accumulated += daily_interest
            makeHistory(user, invest, daily_interest, 'interest')
            invest.save()

        list_ref = list_user.filter(ref=user.uuid)
        amount_ref = 0
        for ref in list_ref:
            totalref = ref.balance + (Investment.objects.filter(account=ref).aggregate(total=Sum('amount'))['total'] or 0)
            amount_ref += daily(totalref, interest_ref)
        makeTransaction(user, amount_ref, 'ref','done')
        
        user.balance += amount + amount_ref
        user.profit += amount + amount_ref
        user.save()
        
        updateJson(user, user.balance, user.profit)

if __name__ == '__main__':
    main()