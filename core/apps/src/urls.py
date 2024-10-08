from django.urls import path
import apps.src.views as view

urlpatterns = [
    path('update-account/', view.updateAccount.as_view(), name='update-account'),
    path('request-invoice/', view.requestInvoice.as_view(), name='request-invoice'),
    path('request-withdrawal/', view.requestWithdrawal.as_view(), name='request-withdrawal'),
    path('request-investment/', view.requestInvestment.as_view(), name='request-investment'),
    path('refund-investment/', view.refundInvestment.as_view(), name='refund-investment'),
    path('fetch-transactions', view.fetchTransactions.as_view(), name='fetch-transactions'),
    path('fetch-history', view.fetchHistory.as_view(), name='fetch-history'),
    path('fetch-referred/', view.fetchReferred.as_view(), name='fetch-referred'),
]