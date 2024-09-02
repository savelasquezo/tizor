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

class Tizorbank(models.Model):
    default = models.CharField(_("Tizorbank"), max_length=32, unique=True, blank=True, null=True, default="Tizorbank")
    interest = models.FloatField(_("Interet"),blank=False,null=False,default=14)
    ref = models.FloatField(_("Interet-reF"),blank=False,null=False,default=0.5)
    
    email = models.EmailField(_("Email"), max_length=256, blank=True, null=True)
    address = models.CharField(_("Wallet"),max_length=256, unique=True)
    
    terms = CKEditor5Field(_("Terms & Conditions"), config_name='extends')
    legal = CKEditor5Field(_("Legal"), config_name='extends')
    file = models.FileField(upload_to=FilesUploadTo, max_length=512, null=True, blank=True,
                            help_text="Files-Terms/Legal")
    
    template_invoice = models.FileField(upload_to=TemplatesUploadTo, max_length=512, null=True, blank=True,help_text="Template for invoice")
    template_invoice_status = models.FileField(upload_to=TemplatesUploadTo, max_length=512, null=True, blank=True,help_text="Template for invoice status")
                                             
    template_withdrawal = models.FileField(upload_to=TemplatesUploadTo, max_length=512, null=True, blank=True,help_text="Template for withdrawal")
    template_withdrawal_status = models.FileField(upload_to=TemplatesUploadTo, max_length=512, null=True, blank=True,help_text="Template for withdrawal status")
    
    template_block = models.FileField(upload_to=TemplatesUploadTo, max_length=512, null=True, blank=True,help_text="Template for block")
    template_block_status = models.FileField(upload_to=TemplatesUploadTo, max_length=512, null=True, blank=True,help_text="Template for block status")

    def __str__(self):
        return f"{self.default}"

    class Meta:
        verbose_name = _("Tizorbank")
        verbose_name_plural = _("Tizorbank")


class MediaLinks(models.Model):
    uuid = models.UUIDField(_("ID"),default=uuid.uuid4, unique=True)
    settings = models.ForeignKey(Tizorbank, on_delete=models.CASCADE)
    name = models.CharField(_("Name"),max_length=64, null=False, blank=False)
    link = models.URLField(_("Link"), max_length=128, blank=True, null=True)

    def __str__(self):
        return f"{self.uuid}"

    class Meta:
        verbose_name = _("Link")
        verbose_name_plural = _("Links")


class ImagenSlider(models.Model):
    uuid = models.UUIDField(_("ID"),default=uuid.uuid4, unique=True)
    settings = models.ForeignKey(Tizorbank, on_delete=models.CASCADE)
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
    question = models.CharField(_("Title"),max_length=64, null=False, blank=False)
    answer = models.TextField(_("Description"),max_length=1024, null=False, blank=False)
    is_active = models.BooleanField(default=True, verbose_name='')

    def __str__(self):
        return f"{self.uuid}"

    class Meta:
        verbose_name = _("FAQ")
        verbose_name_plural = _("FAQs")

