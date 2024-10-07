import os, json, logging
from typing import Optional

from django.db import transaction
from django.utils import timezone
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

from apps.src.models import Account, Transaction, Investment, InvestmentHistory

logger = logging.getLogger(__name__)

def makeHistory(account: Account, investment: Investment, amount: float, type: str, voucher: Optional[str] = None) -> Optional[InvestmentHistory]:
    obj = InvestmentHistory.objects.create(account=account, investment=investment, amount=amount, type=type, voucher=voucher)
    obj.save()

def makeTransaction(account: Account, amount: float, type: str, state: str, voucher: Optional[str] = None) -> Optional[Transaction]:
    data = {'amount': amount, 'type': type, 'state': state}
    with transaction.atomic():
        obj, created = Transaction.objects.get_or_create(account=account, state='invoiced', voucher=voucher, defaults={**data})
        if not created:
            for attr, value in data.items():
                setattr(obj, attr, value)
            obj.save()

def updateTransaction(user: Account, state: str, voucher: str) -> Optional[Transaction]:
    obj = Transaction.objects.get(account=user, voucher=voucher)
    obj.state = state
    obj.save()

def updateJson(user, amount):
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
        "balance": round(amount, 2)
    })

    with open(file_path, 'w') as file:
        json.dump(user_data, file, indent=4)

def sendEmail(subject, template_url, email_list, data=None):
    try:
        template_path = template_url.path if hasattr(template_url, 'path') else template_url
        context_data = data if data is not None else {}

        email = EmailMultiAlternatives(subject, '', settings.EMAIL_HOST_USER, email_list)
        email.attach_alternative(render_to_string(template_path, context_data), 'text/html')
        email.send()

    except Exception as e:
        logger.error("%s", e, exc_info=True)
