import uuid

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

methods = (('crypto','Cryptomonedas'),('bold','Bold'))
states = (('pending','Pendiente'),('done','Aprobado'),('error','Error'))

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
    email = models.EmailField(_("Email"),unique=True)
    username = models.CharField(_("Usuario"),max_length=64, unique=True)
    date_joined = models.DateField(_("Fecha"),default=timezone.now)
    last_joined = models.DateField(_("Ultimo Ingreso"),default=timezone.now)
    is_active = models.BooleanField(_("¿Activo?"),default=False)
    is_staff = models.BooleanField(_("¿Staff?"),default=False)

    ammount = models.PositiveBigIntegerField(_("Ammount"),blank=True,default=0)
    interest = models.DecimalField(_("Interest"), max_digits=5, decimal_places=2, blank=True,default=0)
    available = models.PositiveBigIntegerField(_("Available"),blank=True,default=0)
    paid = models.PositiveBigIntegerField(_("Paid"),blank=True,default=0)
    total = models.PositiveBigIntegerField(_("Total"),blank=True,default=0)
    
    objects = AccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"{self.email}"

    class Meta:
        indexes = [models.Index(fields=['email']),]
        verbose_name = _("Account")
        verbose_name_plural = _("Accounts")


class Withdrawals(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    uuid = models.UUIDField(_("ID"),default=uuid.uuid4, unique=True)
    amount = models.FloatField(_("Ammount"),blank=False,null=False,default=0)
    date = models.DateField(_("Date"), default=timezone.now)
    method = models.CharField(_("Method"), max_length=128, null=False, blank=False)
    voucher = models.CharField(_("Voucher"), max_length=128, null=False, blank=False)
    state = models.CharField(_("¿Estado?"), choices=states, default="pending", max_length=16)

    def save(self, *args, **kwargs):
        if not self.uuid:
            self.uuid = str(uuid.uuid4())[:12]
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.voucher}"

    class Meta:
        indexes = [models.Index(fields=['account','voucher','state']),]
        verbose_name = _("Withdrawal")
        verbose_name_plural = _("Withdrawals")

class Invoice(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    uuid = models.UUIDField(_("ID"),default=uuid.uuid4, unique=True)
    amount = models.FloatField(_("Ammount"),blank=False,null=False,default=0)
    date = models.DateField(_("Date"), default=timezone.now)
    method = models.CharField(_("Method"), choices=methods, max_length=128, null=False, blank=False)
    voucher = models.CharField(_("Voucher"), max_length=128, null=False, blank=False)
    state = models.CharField(_("¿State?"), choices=states, default="pending", max_length=16)

    def save(self, *args, **kwargs):
        if not self.uuid:
            self.uuid = str(uuid.uuid4())[:12]
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.voucher}"

    class Meta:
        indexes = [models.Index(fields=['account','voucher','state']),]
        verbose_name = _("Invoice")
        verbose_name_plural = _("Invoices")