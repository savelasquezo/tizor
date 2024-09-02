from django.urls import path
import apps.src.views as view

urlpatterns = [
    path('request-invoice/', view.requestInvoice.as_view(), name='request-invoice'),
    path('fetch-withdrawals', view.fetchWithdrawal.as_view(), name='fetch-withdrawals'),
    path('fetch-transactions', view.fetchTransactions.as_view(), name='fetch-transactions'),
    path('fetch-history', view.fetchHistory.as_view(), name='fetch-history'),
]