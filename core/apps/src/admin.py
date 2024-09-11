from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.conf.locale.es import formats as es_formats

import apps.src.models as model

class MyAdminSite(admin.AdminSite):
    index_title = 'Consola Administrativa'
    verbose_name = "TirzorMiner"


admin_site = MyAdminSite()
admin.site = admin_site
admin_site.site_header = "TirzorMiner"

###################################################################
###################################################################

class InvestmentlInline(admin.StackedInline):
    
    model = model.Investment
    extra = 0

    fieldsets = (
        (" ", {"fields": (
            ('amount','interest','accumulated'),
            ('date_joined','date_target'),
                )
            }
        ),
    )

    radio_fields = {'state': admin.HORIZONTAL}
    readonly_fields = ('uuid','amount','date_joined','date_target',)

    def has_add_permission(self, request, obj=None):
        return False


class InvestmentHistorylInline(admin.TabularInline):
    
    model = model.InvestmentHistory
    extra = 0

    fieldsets = (
        (" ", {"fields": (
            ('account','amount'),
            ('date','type','voucher'),
                )
            }
        ),
    )

    radio_fields = {'state': admin.HORIZONTAL}

    def get_readonly_fields(self, request, obj=None):
        return [field.name for field in self.model._meta.fields]

    def has_add_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    class Media:
        css = {'all': ('css/styles.css',)}

class InvoiceInline(admin.StackedInline):
    
    model = model.Invoice
    extra = 0

    fieldsets = (
        (" ", {"fields": (
            ('uuid','address','state'),
            ('amount','date','voucher'),
                )
            }
        ),
    )

    radio_fields = {'state': admin.HORIZONTAL}
    readonly_fields = ('uuid','address','amount','date','voucher')

    def has_add_permission(self, request, obj=None):
        return False


class WithdrawalInline(admin.StackedInline):
    
    model = model.Withdrawal
    extra = 0

    fieldsets = (
        (" ", {"fields": (
            ('uuid','address','state'),
            ('amount','date','voucher'),
                )
            }
        ),
    )

    radio_fields = {'state': admin.HORIZONTAL}
    readonly_fields = ('uuid','address','amount','date','voucher')

    def has_add_permission(self, request, obj=None):
        return False


class InvestmentAdmin(admin.ModelAdmin):
    list_display = (
        'voucher',
        'account',
        'amount',
        'interest',
        'accumulated',
        'date_joined',
        'date_target',
        'state'
        )

    list_filter = ['date_target','state']
    search_fields = ['voucher']

    radio_fields = {'state': admin.HORIZONTAL}
    es_formats.DATETIME_FORMAT = "d M Y"
    
    fieldsets = (
        (None, {'fields': (
            ('account','amount','interest','accumulated'),
            ('date_joined','date_target','state'),
        )}),
    )

    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)
        self.inlines = [InvestmentHistorylInline]
        return fieldsets

    def get_readonly_fields(self, request, obj=None):
        return [field.name for field in self.model._meta.fields]



class InvoiceAdmin(admin.ModelAdmin):
    list_display = (
        'voucher',
        'account',
        'amount',
        'address',
        'date',
        'state'
        )

    list_filter = ['date','state']
    search_fields = ['voucher']

    radio_fields = {'state': admin.HORIZONTAL}
    es_formats.DATETIME_FORMAT = "d M Y"
    
    fieldsets = (
        (None, {'fields': (
            ('account','address','state'),
            ('amount','date','voucher'),
        )}),
    )

    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)
        return fieldsets

    def get_readonly_fields(self, request, obj=None):
        if obj and obj.state != "invoiced":
            return [field.name for field in self.model._meta.fields]
        return ['uuid','account','address','amount','date','voucher']


class WithdrawalAdmin(admin.ModelAdmin):
    list_display = (
        'voucher',
        'account',
        'amount',
        'address',
        'date',
        'state'
        )

    list_filter = ['date','state']
    search_fields = ['voucher']

    radio_fields = {'state': admin.HORIZONTAL}
    es_formats.DATETIME_FORMAT = "d M Y"
    
    fieldsets = (
        (None, {'fields': (
            ('account','address','state'),
            ('amount','date','voucher'),
        )}),
    )

    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)
        return fieldsets

    def get_readonly_fields(self, request, obj=None):
        if obj and obj.state != "invoiced":
            return [field.name for field in self.model._meta.fields]
        return ['uuid','account','address','amount','date','voucher']

class TransactionAdmin(admin.ModelAdmin):
    list_display = (
        'voucher',
        'account',
        'amount',
        'date',
        'type',
        'state'
        )

    list_filter = ['date','type']
    search_fields = ['voucher']

    radio_fields = {'type': admin.HORIZONTAL}
    es_formats.DATETIME_FORMAT = "d M Y"
    
    fieldsets = (
        (None, {'fields': (
            ('account','type','voucher','state'),
            ('date','amount'),
        )}),
    )

    # readonly_fields=['account','uuid','method','amount','date','voucher']
    # def has_add_permission(self, request):
    #      return False



class AccountAdmin(BaseUserAdmin):
    list_display = ('username', 'email')
    search_fields = ('username', 'email')

    fieldsets = (
        (None, {'fields': (('username','email','uuid','ref','is_active'), 'password')}),
            ('', {'fields': (
            ('address','date_joined'),
            ('balance','interest','profit'),
        )}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2'),
        }),
    )

    list_filter=['is_active']

    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)
        self.inlines = [InvestmentlInline, InvoiceInline, WithdrawalInline]
        return fieldsets

    def get_readonly_fields(self, request, obj=None):
        return ['username','email','uuid','date_joined']


admin.site.register(Group)

admin.site.register(model.Account,AccountAdmin)
admin.site.register(model.Investment,InvestmentAdmin)
admin.site.register(model.Invoice, InvoiceAdmin)
admin.site.register(model.Withdrawal, WithdrawalAdmin)
admin.site.register(model.Transaction, TransactionAdmin)



