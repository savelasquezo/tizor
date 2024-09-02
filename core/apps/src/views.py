import os, uuid, json, base64, logging

from django.http import JsonResponse
from django.utils import timezone
from django.conf import settings
from django.db import transaction

from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from rest_framework.permissions import IsAuthenticated, AllowAny

import apps.src.models as model
import apps.src.serializers as serializer
import apps.src.pagination as paginate
from apps.src.functions import makeTransaction

logger = logging.getLogger(__name__)

def makeInvoice(length=12):
    return base64.urlsafe_b64encode(os.urandom(length)).decode('utf-8')[:length]


class requestInvoice(generics.GenericAPIView):

    def post(self, request, *args, **kwargs):

        data = {'amount':request.data.get('amount')}
        try:
            with transaction.atomic():
                obj, created = model.Invoice.objects.get_or_create(account=request.user,state='invoiced',defaults={**data})
                if not created:
                    for attr, value in data.items():
                        setattr(obj, attr, value)
                    obj.save()
            
            apiInvoice = obj.voucher
            makeTransaction(request.user, data.get('amount'), 'income','invoiced')
            return Response({'apiInvoice': apiInvoice}, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error("%s", e, exc_info=True)
            return Response({'error': 'NotFound Invoice.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        

class fetchWithdrawal(generics.ListAPIView):

    serializer_class = serializer.WithdrawalSerializer
    permission_classes = [AllowAny]

    def get_queryset(self, myaccount):
        return model.Withdrawal.objects.filter(account=myaccount).order_by('-id')

    def get(self, request, *args, **kwargs):
        myaccount = model.Account.objects.get(email="email@email.com")
        try:
            queryset = self.get_queryset(myaccount)
            serialized_data = self.serializer_class(queryset, many=True).data
            return Response(serialized_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'detail': 'NotFound Withdrawals.'}, status=status.HTTP_404_NOT_FOUND)



class fetchTransactions(generics.ListAPIView):

    serializer_class = serializer.TransactionSerializer
    permission_classes = [IsAuthenticated]

    pagination_class = paginate.TransactionPagination
    page_size = 5

    def get_queryset(self, request):
        return model.Transaction.objects.filter(account=request.user).order_by('id')

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset(request)
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error("%s", e, exc_info=True)
            return Response({'error': 'Not Found Advertisement.'}, status=status.HTTP_404_NOT_FOUND)


class fetchHistory(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        username = request.user.username
        data = os.path.join(settings.BASE_DIR, 'data', f'{username}.json')
        with open(data, 'r') as file:
            response = json.load(file)
    
        return JsonResponse(response, safe=False)