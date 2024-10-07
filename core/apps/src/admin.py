from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.conf.locale.es import formats as es_formats

import apps.src.models as model


class InvestmentlInline(admin.TabularInline):
    
    model = model.Investment
    extra = 0

    fieldsets = (
        (" ", {"fields": (
            ('amount','interest','accumulated','date_joined','date_target'),
                )
            }
        ),
    )

    radio_fields = {'state': admin.HORIZONTAL}


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
    class Media:
        css = {'all': ('css/styles.css',)}

class InvoiceInline(admin.TabularInline):
    
    model = model.Invoice
    extra = 0

    fieldsets = (
        (" ", {"fields": (
            ('network','address','state'),
            ('amount','date','voucher'),
                )
            }
        ),
    )

    radio_fields = {'state': admin.HORIZONTAL}



class WithdrawalInline(admin.TabularInline):
    
    model = model.Withdrawal
    extra = 0

    fieldsets = (
        (" ", {"fields": (
            ('network','address','state'),
            ('amount','date','voucher'),
                )
            }
        ),
    )

    radio_fields = {'state': admin.HORIZONTAL}



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

    list_filter = ['date_joined','date_target','state']
    search_fields = ['account','voucher']

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
        if request.user.is_superuser:
            return []
        return [field.name for field in self.model._meta.fields]


class InvoiceAdmin(admin.ModelAdmin):
    list_display = (
        'voucher',
        'account',
        'amount',
        'network',
        'address',
        'date',
        'state'
        )

    list_filter = ['date','state','network']
    search_fields = ['account','voucher']

    radio_fields = {'state': admin.HORIZONTAL}
    es_formats.DATETIME_FORMAT = "d M Y"
    
    fieldsets = (
        (None, {'fields': (
            ('account','network','address'),
            ('date','amount','voucher','state'),
        )}),
    )

    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)
        return fieldsets

    def get_readonly_fields(self, request, obj=None):
        if request.user.is_superuser:
            return []
        
        readonly_fields = [field.name for field in self.model._meta.fields]
        if obj and obj.state != "invoiced":
            return readonly_fields
        return [field for field in readonly_fields if field != 'state']



class WithdrawalAdmin(admin.ModelAdmin):
    list_display = (
        'voucher',
        'account',
        'amount',
        'network',
        'address',
        'date',
        'state'
        )

    list_filter = ['date','state','network']
    search_fields = ['account','voucher']

    radio_fields = {'state': admin.HORIZONTAL}
    es_formats.DATETIME_FORMAT = "d M Y"
    
    fieldsets = (
        (None, {'fields': (
            ('account','network','address'),
            ('date','amount','voucher','state'),
        )}),
    )

    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)
        return fieldsets

    def get_readonly_fields(self, request, obj=None):
        if request.user.is_superuser:
            return []
        
        readonly_fields = [field.name for field in self.model._meta.fields]
        if obj and obj.state != "invoiced":
            return readonly_fields
        return [field for field in readonly_fields if field != 'state']



class TransactionAdmin(admin.ModelAdmin):
    list_display = (
        'voucher',
        'account',
        'amount',
        'date',
        'type',
        'state'
        )

    list_filter = ['date','type','state']
    search_fields = ['account','voucher']

    radio_fields = {'type': admin.HORIZONTAL}
    es_formats.DATETIME_FORMAT = "d M Y"
    
    fieldsets = (
        (None, {'fields': (
            ('account','type','voucher','state'),
            ('date','amount'),
        )}),
    )

    def get_readonly_fields(self, request, obj=None):
        if request.user.is_superuser:
            return []
        return [field.name for field in self.model._meta.fields]



class AccountAdmin(BaseUserAdmin):
    list_display = (
        'username',
        'email',
        'uuid',
        'ref',
        'network',
        'address',
        'formatted_balance',
        'interest',
        'date_joined'
    )
    
    def formatted_balance(self, obj):
        return f'{obj.balance:.2f}'
    formatted_balance.short_description = 'Saldo'
    
    search_fields = ('username', 'email','address')
    list_filter=['network','date_joined','is_active']
        
    fieldsets = (
        (None, {'fields': (
            ('username','email','uuid','ref','is_active','is_staff'), 'password')}),
            ('', {'fields': (
            ('network','address','date_joined'),
            ('balance','interest','profit'),
            )}
        ),
        (None, {"fields": ['groups']})
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2'),
        }),
    )

    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)
        self.inlines = [InvestmentlInline, InvoiceInline, WithdrawalInline]
        if not request.user.is_superuser:
            fieldsets = [fieldsets[1]]
        return fieldsets





