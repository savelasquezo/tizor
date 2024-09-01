from django.db import models
from django.utils.translation import gettext_lazy as _

class Tizorbank(models.Model):
    default = models.CharField(_("Tizorbank"), max_length=32, unique=True, blank=True, null=True, default="Tizorbank")
    interest = models.FloatField(_("Interes"),blank=False,null=False,default=14)
    ref = models.FloatField(_("Interes-reF"),blank=False,null=False,default=0.5)
    
    def __str__(self):
        return f"{self.default}"

    class Meta:
        verbose_name = _("Tizorbank")
        verbose_name_plural = _("Tizorbank")

