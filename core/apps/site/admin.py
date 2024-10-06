from django.contrib import admin
import apps.site.models as model


class ImageSliderInline(admin.StackedInline):

    model = model.ImageSlider
    extra = 0
    fieldsets = ((' ', {'fields': (('file','is_active'),)}),)

    def has_delete_permission(self, request, obj=None):
        return False

class LinksInline(admin.TabularInline):
    
    model = model.Link
    extra = 0
    fieldsets = ((' ', {'fields': (('name','link','is_active'),)}),)

    def has_delete_permission(self, request, obj=None):
        return False

class FAQsInline(admin.StackedInline):
    
    model = model.FAQs
    extra = 0
    fieldsets = ((' ', {'fields': (('question','is_active'),'answer')}),)

    def has_delete_permission(self, request, obj=None):
        return False

class TizorbankAdmin(admin.ModelAdmin):

    inlines = [ImageSliderInline, LinksInline, FAQsInline, ]
    
    list_display = (
        'default',
        'email',
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
        ('template_block','template_block_status'),
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


admin.site.register(model.Tizorbank, TizorbankAdmin)

