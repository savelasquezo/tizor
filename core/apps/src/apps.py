from django.apps import AppConfig


class SrcConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.src'
    verbose_name = 'Usuarios'

    def ready(self):
        from . import signals