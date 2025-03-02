import uuid

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.auth.models import Group, Permission
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

states = (('invoiced','Invoiced'),('done','Approved'))
networks = (('erc20','ERC20'),('trc20','TRC20'),('bep20','BEP20'))

transactions = (('invoiced','Invoiced'),('done','Approved'),('refund','Refund'))
types = (('interest','Interest'),('outcome','Outcome'),('income','Income'),('investment','Investment'),('ref','Referred'))

investments = (('active','Active'),('inactive','Inactive'),('cancelled','Cancelled'))
historys = (('investment','Investment'),('interest','Interest'),('closure','Closure'),('refund','Refund'))


def LogoUploadTo(instance, filename):
    return f"uploads/{instance.username}/logo/{filename}"

class AccountManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('¡Email Obligatorio!')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)


class Account(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(_("ID"),default=uuid.uuid4, unique=True, primary_key=True)
    uuid =  models.CharField(_("UUID"), max_length=8, unique=True, null=True, blank=True)
    ref = models.CharField(_("Ref"), max_length=8, blank=True)
    email = models.EmailField(_("Email"),unique=True)
    username = models.CharField(_("Usuario"),max_length=64, unique=True)

    network = models.CharField(_("Network"),choices=networks, default="bep20" , max_length=8, blank=False, null=False)
    address = models.CharField(_("Address"), max_length=128, unique=True)
    
    date_joined = models.DateField(_("Date"),default=timezone.now)
    last_update = models.DateField(default=timezone.now)
    
    is_active = models.BooleanField(default=False, verbose_name="")
    is_staff = models.BooleanField(default=False, verbose_name="")

    balance = models.FloatField(_("Amount"), blank=True, null=True, default=0)
    interest = models.FloatField(_("Interest"), blank=True, null=True, default=0)
    profit = models.FloatField(_("Profit"), blank=True, null=True,default=0)
    
    objects = AccountManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username','address','network','ref']

    def __str__(self):
        return f"{self.email}"

    def save(self, *args, **kwargs):
        if not self.uuid:
            self.uuid = str(uuid.uuid4())[:8]
        super().save(*args, **kwargs)


    class Meta:
        indexes = [models.Index(fields=['email','uuid','ref']),]
        verbose_name = _("Account")
        verbose_name_plural = _("Accounts")



class Investment(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    uuid = models.UUIDField(_("ID"),default=uuid.uuid4, unique=True)
    amount = models.FloatField(_("Amount"), blank=True, null=True, default=0)
    interest = models.FloatField(_("Interest"), blank=True, null=True, default=0)
    accumulated = models.FloatField(_("Accumulated"), blank=True, null=True, default=0)

    date_joined = models.DateField(_("Initial"), default=timezone.now)
    date_target = models.DateField(_("Finish"), default=timezone.now)

    voucher = models.CharField(_("Voucher"), max_length=128, null=False, blank=False)
    state = models.CharField(choices=investments, default="active", max_length=16, verbose_name="")

    def __str__(self):
        return self.voucher

    def save(self, *args, **kwargs):
        if not self.voucher:
            self.voucher = str(uuid.uuid4())[:8]
        super().save(*args, **kwargs)


    class Meta:
        indexes = [models.Index(fields=['voucher']),]
        verbose_name = _("Investment")
        verbose_name_plural = _("Investment")



class InvestmentHistory(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    investment = models.ForeignKey(Investment, on_delete=models.CASCADE)
    amount = models.FloatField(_("Amount"),blank=False,null=False)
    date = models.DateField(_("Date"), default=timezone.now)
    type = models.CharField(_("Type"), choices=historys, max_length=128, null=False, blank=False)
    voucher = models.CharField(_("Voucher"), max_length=128, null=True, blank=True)

    def __str__(self):
        return f"{self.voucher}"

    def save(self, *args, **kwargs):
        if not self.voucher:
            self.voucher = str(uuid.uuid4())[:8]
        super().save(*args, **kwargs)

    class Meta:
        indexes = [models.Index(fields=['investment','voucher']),]
        verbose_name = _("History")
        verbose_name_plural = _("History")



class Invoice(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    uuid = models.UUIDField(_("ID"),default=uuid.uuid4, unique=True)
    amount = models.FloatField(_("Amount"),blank=False,null=False,default=0)
    date = models.DateField(_("Date"), default=timezone.now)
    voucher = models.CharField(_("Voucher"), max_length=128, null=False, blank=False)
    network = models.CharField(_("Network"),choices=networks, default="bep20" , max_length=8, blank=False, null=False)
    address = models.CharField(_("Address"), max_length=128, null=True, blank=True)
    state = models.CharField(choices=states, default="invoiced", max_length=16, verbose_name="")

    def __str__(self):
        return f"{self.voucher}"

    def save(self, *args, **kwargs):
        if not self.voucher:
            self.voucher = str(uuid.uuid4())[:8]
        super().save(*args, **kwargs)

    class Meta:
        indexes = [models.Index(fields=['voucher','state']),]
        verbose_name = _("Invoice")
        verbose_name_plural = _("Invoices")



class Withdrawal(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    uuid = models.UUIDField(_("ID"),default=uuid.uuid4, unique=True)
    amount = models.FloatField(_("Amount"),blank=False,null=False,default=0)
    date = models.DateField(_("Date"), default=timezone.now)
    voucher = models.CharField(_("Voucher"), max_length=128, null=False, blank=False)
    network = models.CharField(_("Network"),choices=networks, default="bep20" , max_length=8, blank=False, null=False)
    address = models.CharField(_("Address"), max_length=128, null=True, blank=True)
    state = models.CharField(choices=states, default="invoiced", max_length=16, verbose_name="")

    def __str__(self):
        return f"{self.voucher}"

    def save(self, *args, **kwargs):
        if not self.voucher:
            self.voucher = str(uuid.uuid4())[:8]
        super().save(*args, **kwargs)

    class Meta:
        indexes = [models.Index(fields=['voucher','state']),]
        verbose_name = _("Withdrawal")
        verbose_name_plural = _("Withdrawals")
        
        

class Transaction(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    amount = models.FloatField(_("Amount"),blank=False,null=False)
    date = models.TimeField(_("Date"), default=timezone.now)
    type = models.CharField(_("Type"), choices=types, max_length=128, null=False, blank=False)
    voucher = models.CharField(_("Voucher"), max_length=128, null=True, blank=True)
    state = models.CharField(choices=transactions, default="invoiced", max_length=16, verbose_name="")

    def __str__(self):
        return f"{self.voucher}"

    def save(self, *args, **kwargs):
        if not self.voucher:
            self.voucher = str(uuid.uuid4())[:8]
        super().save(*args, **kwargs)

    class Meta:
        indexes = [models.Index(fields=['account','voucher']),]
        verbose_name = _("Transaction")
        verbose_name_plural = _("Transactions")



