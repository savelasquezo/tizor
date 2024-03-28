from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.conf.locale.es import formats as es_formats

from apps.src.models import Account, Invoice, Withdrawals

class MyAdminSite(admin.AdminSite):
    index_title = 'Consola Administrativa'
    verbose_name = "TirzorMiner"


admin_site = MyAdminSite()
admin.site = admin_site
admin_site.site_header = "TirzorMiner"



class WithdrawalsInline(admin.StackedInline):
    
    model = Withdrawals
    extra = 0

    fieldsets = (
        (" ", {"fields": (
            ('method','state'),
            ('amount','date','voucher'),
                )
            }
        ),
    )

    radio_fields = {'state': admin.HORIZONTAL}
    readonly_fields = ('method','amount','date','voucher')
    def has_add_permission(self, request, obj=None):
        return False

class InvoiceInline(admin.StackedInline):
    
    model = Invoice
    extra = 0

    fieldsets = (
        (" ", {"fields": (
            ('method','state'),
            ('amount','date','voucher'),
                )
            }
        ),
    )

    radio_fields = {'state': admin.HORIZONTAL}
    readonly_fields = ('method','amount','date','voucher')
    def has_add_permission(self, request, obj=None):
        return False


class InvoiceAdmin(admin.ModelAdmin):
    list_display = (
        'voucher',
        'account',
        'amount',
        'date',
        'state'
        )

    list_filter = ['date','state']
    search_fields = ['voucher']

    radio_fields = {'state': admin.HORIZONTAL}
    es_formats.DATETIME_FORMAT = "d M Y"
    
    fieldsets = (
        (None, {'fields': (
            ('account','method','state'),
            ('amount','date','voucher'),
        )}),
    )

    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)
        return fieldsets

    readonly_fields=['account','method','amount','date','voucher']
    def has_add_permission(self, request):
         return False


class WithdrawalsAdmin(admin.ModelAdmin):
    list_display = (
        'voucher',
        'account',
        'amount',
        'date',
        'state'
        )

    list_filter = ['date','state']
    search_fields = ['voucher']

    radio_fields = {'state': admin.HORIZONTAL}
    es_formats.DATETIME_FORMAT = "d M Y"
    
    fieldsets = (
        (None, {'fields': (
            ('account','method','state'),
            ('amount','date','voucher'),
        )}),
    )

    readonly_fields=['account','uuid','method','amount','date','voucher']
    def has_add_permission(self, request):
         return False

class AccountAdmin(BaseUserAdmin):
    list_display = ('username', 'email')
    search_fields = ('username', 'email')

    fieldsets = (
        (None, {'fields': (('email','is_active','is_staff'), 'password')}),
            ('', {'fields': (
            ('username'),
            ('date_joined','last_joined'),
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
        self.inlines = [WithdrawalsInline, InvoiceInline]
        return fieldsets

    def get_readonly_fields(self, request, obj=None):
        return ['username','email']


admin.site.register(Group)

admin.site.register(Account,AccountAdmin)
admin.site.register(Invoice, InvoiceAdmin)
admin.site.register(Withdrawals, WithdrawalsAdmin)