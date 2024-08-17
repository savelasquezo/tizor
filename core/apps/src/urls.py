from django.urls import path
import apps.src.views as view

urlpatterns = [
    path('fetch-invoices', view.fetchInvoice.as_view(), name='fetch-invoices'),
    path('fetch-withdrawals', view.fetchWithdrawal.as_view(), name='fetch-withdrawals'),
    path('fetch-transactions', view.fetchTransactions.as_view(), name='fetch-transactions'),
]