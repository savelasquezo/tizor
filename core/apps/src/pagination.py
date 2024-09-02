import math

from django.db.models import Sum

from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

import apps.src.models as model

class TransactionPagination(PageNumberPagination):
    def get_paginated_response(self, data):
        profit = math.floor((self.__sumTransaction('interest') or 0) / (self.__sumTransaction('income') or 1))
        return Response({
            'count': self.page.paginator.count,
            'profit': profit,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        })
    
    def __sumTransaction(self, element):
        return model.Transaction.objects.filter(account=self.request.user, type=element, state='done').aggregate(tmp=Sum('amount'))['tmp']