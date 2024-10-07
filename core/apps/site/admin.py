from django.contrib import admin
from django.contrib.auth.models import Group

import apps.site.models as model

import apps.src.models as models
import apps.src.admin as admins

class TZAdminSite(admin.AdminSite):
    index_title = 'Consola Administrativa'
    verbose_name = "T-Bank"

    def get_app_list(self, request, app_label=None):
        """
        Return a sorted list of all the installed apps that have been
        registered in this site. NewMetod for ordering Models
        """
        ordering = {"Groups": 0,"Accounts": 1, "Investment":2, "Invoices": 3, "Withdrawals": 4, "Transactions": 5, "Tizorbank": 6}
        app_dict = self._build_app_dict(request, app_label)

        app_list = sorted(app_dict.values(), key=lambda x: x["name"].lower())

        for app in app_list:
            app['models'].sort(key=lambda x: ordering[x['name']])

        return app_list

admin_site = TZAdminSite()
admin.site = admin_site
admin_site.site_header = "T-Bank"

###################################################################
###################################################################

class ImageSliderInline(admin.StackedInline):

    model = model.ImageSlider
    extra = 0
    fieldsets = ((' ', {'fields': (('file','is_active'),)}),)

class LinksInline(admin.TabularInline):
    
    model = model.Link
    extra = 0
    fieldsets = ((' ', {'fields': (('name','link','is_active'),)}),)

class FAQsInline(admin.StackedInline):
    
    model = model.FAQs
    extra = 0
    fieldsets = ((' ', {'fields': (('question','is_active'),'answer')}),)



class TizorbankAdmin(admin.ModelAdmin):

    inlines = [ImageSliderInline, LinksInline, FAQsInline, ]
    
    list_display = (
        'default',
        'email',
        'network',
        'address',
        'min_interest',
        'max_interest',
        'ref',
        'unlock',
        )

    fieldsets_ = {'fields': (
        ('email','network','address'),
        ('min_interest','max_interest','ref','unlock'),
        )}

    fieldsets_templates = {'fields': (
        ('template_invoice','template_invoice_status'),
        ('template_withdrawal','template_withdrawal_status'),
        ('template_investment','template_investment_status'),
        )}

    fieldsets_legal = {'fields': (
        'file',
        ('terms','legal'),
        )}

    fieldsets = (
        ('', fieldsets_),
        ('Templates', fieldsets_templates),
        ('Terms/Legal', fieldsets_legal),
    )

    def has_add_permission(self, request):
        return False if model.Tizorbank.objects.exists() else True

    readonly_fields=['default',]
    
admin.site.register(Group)
admin.site.register(models.Account,admins.AccountAdmin)
admin.site.register(models.Investment,admins.InvestmentAdmin)
admin.site.register(models.Invoice, admins.InvoiceAdmin)
admin.site.register(models.Withdrawal, admins.WithdrawalAdmin)
admin.site.register(models.Transaction, admins.TransactionAdmin)
admin.site.register(model.Tizorbank, TizorbankAdmin)

