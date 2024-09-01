from django.contrib import admin
import apps.core.models as model

class TizorbankAdmin(admin.ModelAdmin):

    list_display = (
        'default',
        'interest',
        'ref'
        )

    fieldsets = (
        (None, {'fields': (
            ('interest','ref'),
        )}),
    )


admin.site.register(model.Tizorbank, TizorbankAdmin)

