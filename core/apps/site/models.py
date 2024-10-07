import uuid

from django.db import models
from django_ckeditor_5.fields import CKEditor5Field
from django.utils.translation import gettext_lazy as _

def TemplatesUploadTo(instance, id):
    return f"templates/mail/{id}"

def FilesUploadTo(instance, id):
    return f"uploads/items/{id}"

def ImagesUploadTo(instance, id):
    return f"uploads/files/{id}"

links = (('facebook', 'Facebook'),('instagram', 'Instagram'),('youtube', 'YouTube'),('tiktok', 'TikTok'),
         ('twitter', 'Twitter'),('linkedin', 'LinkedIn'),('reddit', 'Reddit'),('pinterest', 'Pinterest'),
         ('snapchat', 'Snapchat'),('telegram', 'Telegram'),('whatsapp', 'WhatsApp'),
        )

networks = (('erc20','ERC20'),('trc20','TRC20'),('bep20','BEP20'))

class Tizorbank(models.Model):
    default = models.CharField(_("Tizorbank"), max_length=32, unique=True, default="Tizorbank")
    
    min_interest = models.FloatField(_("Interest (Min)"),blank=False,null=False,default=14)
    max_interest = models.FloatField(_("Interest (Max)"),blank=False,null=False,default=24)
    ref = models.FloatField(_("Interet-reF"),blank=False,null=False,default=5)
    unlock = models.FloatField(_("Unlock"),blank=False,null=False,default=30)
    
    email = models.EmailField(_("Email"), max_length=256, blank=False, null=False)
    network = models.CharField(_("Network"),choices=networks, default="bep20" , max_length=8, blank=False, null=False)
    address = models.CharField(_("Address"),max_length=256, unique=True, blank=False, null=False)
    
    terms = CKEditor5Field(_("Terms & Conditions"), config_name='extends', blank=True, null=True)
    legal = CKEditor5Field(_("Legal"), config_name='extends', blank=True, null=True)
    file = models.FileField(upload_to=FilesUploadTo, max_length=512, null=True, blank=True,
                            help_text="Files-Terms/Legal")
    
    template_invoice = models.FileField(_("Invoice"),upload_to=TemplatesUploadTo, max_length=512, null=True, blank=True,help_text="Template for invoice")
    template_invoice_status = models.FileField(_("Invoice Alert"),upload_to=TemplatesUploadTo, max_length=512, null=True, blank=True,help_text="Template for invoice status")
                                             
    template_withdrawal = models.FileField(_("Withdrawal"),upload_to=TemplatesUploadTo, max_length=512, null=True, blank=True,help_text="Template for withdrawal")
    template_withdrawal_status = models.FileField(_("Withdrawal Alert"),upload_to=TemplatesUploadTo, max_length=512, null=True, blank=True,help_text="Template for withdrawal status")
    
    template_investment = models.FileField(_("Investment"),upload_to=TemplatesUploadTo, max_length=512, null=True, blank=True,help_text="Template for block")
    template_investment_status = models.FileField(_("Investment Alert"),upload_to=TemplatesUploadTo, max_length=512, null=True, blank=True,help_text="Template for block status")

    def __str__(self):
        return f"{self.default}"

    class Meta:
        verbose_name = _("Tizorbank")
        verbose_name_plural = _("Tizorbank")


class Link(models.Model):
    uuid = models.UUIDField(_("ID"),default=uuid.uuid4, unique=True)
    settings = models.ForeignKey(Tizorbank, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True, verbose_name='')
    
    name = models.CharField(_("Name-SM google"),choices=links, max_length=64, null=False, blank=False)
    link = models.URLField(_("Link-SM (https://google.com/*)"), max_length=128, blank=True, null=True)

    def __str__(self):
        return f'{""}'

    class Meta:
        verbose_name = _("Link")
        verbose_name_plural = _("Links")


class ImageSlider(models.Model):
    uuid = models.UUIDField(_("ID"),default=uuid.uuid4, unique=True)
    settings = models.ForeignKey(Tizorbank, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True, verbose_name='')

    file = models.ImageField(_("Image"), upload_to=ImagesUploadTo, max_length=512, null=True, blank=True,
                              help_text="Width-(1280px) - Height-(640px)")

    def __str__(self):
        return f"{self.uuid}"

    class Meta:
        verbose_name = _("Image")
        verbose_name_plural = _("Images")


class FAQs(models.Model):
    uuid = models.UUIDField(_("ID"),default=uuid.uuid4, unique=True)
    settings = models.ForeignKey(Tizorbank, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True, verbose_name='')
    
    question = models.CharField(_("Title"),max_length=64, null=False, blank=False)
    answer = models.TextField(_("Description"),max_length=1024, null=False, blank=False)

    def __str__(self):
        return f"{self.uuid}"

    class Meta:
        verbose_name = _("FAQ")
        verbose_name_plural = _("FAQs")

