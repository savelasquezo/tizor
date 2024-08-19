import os, json, base64, logging

from django.http import JsonResponse
from django.utils import timezone
from django.conf import settings

from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from rest_framework.permissions import IsAuthenticated, AllowAny

import apps.src.models as model
import apps.src.serializers as serializer
import apps.src.pagination as paginate

logger = logging.getLogger(__name__)

def makeInvoice(length=12):
    return base64.urlsafe_b64encode(os.urandom(length)).decode('utf-8')[:length]


class fetchInvoice(generics.ListAPIView):

    serializer_class = serializer.InvoiceSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return model.Invoice.objects.filter(account=self.request).order_by('-id')

    def get(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serialized_data = self.serializer_class(queryset, many=True).data
            return Response(serialized_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'detail': 'NotFound Invoices.'}, status=status.HTTP_404_NOT_FOUND)


    def post(self, request, *args, **kwargs):

        method = str(request.data.get('method'))
        amount = int(request.data.get('amount'))

        data = {'method':method,'amount':amount}

        try:
            obj = model.Invoice.objects.create(account=request,**data)
            apiInvoice = makeInvoice()
            obj.voucher = apiInvoice
            obj.save()
            
            return Response({'apiInvoice': apiInvoice, 'amount': amount}, status=status.HTTP_200_OK)
        
        except Exception as e:
            date = timezone.now().strftime("%Y-%m-%d %H:%M")
            with open(os.path.join(settings.BASE_DIR, 'logs/core.log'), 'a') as f:
                f.write("requestInvoice {} --> Error: {}\n".format(date, str(e)))
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
        print(data)
        with open(data, 'r') as file:
            response = json.load(file)
    
        return JsonResponse(response, safe=False)