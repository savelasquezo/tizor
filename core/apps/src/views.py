import os, math, json, base64, logging
from dateutil.relativedelta import relativedelta

from django.http import JsonResponse
from django.utils import timezone
from django.conf import settings
from django.db import transaction

from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticated, AllowAny

from apps.site.models import Tizorbank
import apps.src.models as model
import apps.src.serializers as serializer
import apps.src.pagination as paginate
from apps.src.functions import makeTransaction, makeHistory

logger = logging.getLogger(__name__)

def makeInvoice(length=12):
    return base64.urlsafe_b64encode(os.urandom(length)).decode('utf-8')[:length]


class requestInvoice(generics.GenericAPIView):
    
    serializer_class = serializer.InvoiceSerializer
    permission_classes = [IsAuthenticated]

    pagination_class = paginate.PageNumberPagination
    page_size = 5

    def get_queryset(self, request):
        return model.Invoice.objects.filter(account=request.user).order_by('-id')

    def get(self, request, *args, **kwargs):
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
            return Response({'error': 'Not Found Invoices.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, *args, **kwargs):
        
        amount = float(request.data.get('amount'))
        address = Tizorbank.objects.get(default="Tizorbank").address
        
        data = {'amount': amount, 'address':address}
        if data['amount'] <= 0:
            return Response({'detail': 'The requested amount is incorrect'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            with transaction.atomic():
                obj, created = model.Invoice.objects.get_or_create(account=request.user,state='invoiced',defaults={**data})
                if not created:
                    for attr, value in data.items():
                        setattr(obj, attr, value)
                    obj.save()
            
            apiInvoice = obj.voucher
            makeTransaction(request.user, obj.amount, 'income','invoiced', apiInvoice)
            return Response({'apiInvoice': apiInvoice}, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error("%s", e, exc_info=True)
            return Response({'error': 'NotFound Invoice.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class requestWithdrawal(generics.GenericAPIView):
    
    serializer_class = serializer.WithdrawalSerializer
    permission_classes = [IsAuthenticated]

    pagination_class = paginate.PageNumberPagination
    page_size = 5

    def get_queryset(self, request):
        return model.Withdrawal.objects.filter(account=request.user).order_by('-id')

    def get(self, request, *args, **kwargs):
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
            return Response({'error': 'Not Found Withdrawals.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
 
    def post(self, request, *args, **kwargs):
        
        amount = float(request.data.get('amount'))
        address = request.user.address
        
        data = {'amount': amount, 'address':address}
        if amount > request.user.balance or amount <= 0:
            return Response({'detail': 'The requested amount is incorrect'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            with transaction.atomic():
                obj, created = model.Withdrawal.objects.get_or_create(account=request.user, state='invoiced', defaults={**data})
                if not created:
                    obj.amount += amount
                    obj.save()
            
            request.user.balance -= amount
            request.user.save()

            apiWithdrawal = obj.voucher
            makeTransaction(request.user, -obj.amount, 'outcome', 'invoiced', apiWithdrawal)
            return Response({'apiWithdrawal': apiWithdrawal}, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error("%s", e, exc_info=True)
            return Response({'error': 'NotFound Invoice.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 


class requestInvestment(generics.GenericAPIView):
    
    serializer_class = serializer.InvestmentSerializer
    permission_classes = [IsAuthenticated]

    pagination_class = paginate.PageNumberPagination
    page_size = 5

    def get_queryset(self, request):
        return model.Investment.objects.filter(account=request.user).order_by('-id')

    def get(self, request, *args, **kwargs):
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
            return Response({'error': 'Not Found Investments.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, *args, **kwargs):
        amount = request.data.get('amount')
        months = request.data.get('months')
        
        if amount > request.user.balance or amount <= 0 or not months in range(6, 37):
            return Response({'detail': 'The requested amount is incorrect'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            data = Tizorbank.objects.get(default="Tizorbank")
            obj = model.Investment.objects.create(account=request.user)
        
            obj.amount = amount
            obj.interest = round(data.min_interest * math.exp((math.log(data.max_interest/data.min_interest) / 36) * months),2)
            obj.date_target = timezone.now() + relativedelta(months=months)
            obj.save()
            
            request.user.balance -= amount
            request.user.save()

            apiInvestment = obj.voucher
            
            makeHistory(request.user, obj, obj.amount, 'investment')
            makeTransaction(request.user, -amount, 'investment', 'done', apiInvestment)
            return Response({'apiInvestment': apiInvestment}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error("%s", e, exc_info=True)
            return Response({'error': 'NotFound Investment.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 



class fetchTransactions(generics.ListAPIView):

    serializer_class = serializer.TransactionSerializer
    permission_classes = [IsAuthenticated]

    pagination_class = paginate.TransactionPagination

    def get_queryset(self, request):
        queryset = model.Transaction.objects.filter(account=request.user).order_by('-id')
        voucher = request.query_params.get('voucher')
        if voucher:
            queryset = queryset.filter(voucher__icontains=voucher)

        transaction_date = request.query_params.get('date')
        if transaction_date:
            queryset = queryset.filter(date__icontains=transaction_date)

        return queryset

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
            return Response({'error': 'Not Found Transactions.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class fetchHistory(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            username = request.user.username
            data = os.path.join(settings.BASE_DIR, 'data', f'{username}.json')
            with open(data, 'r') as file:
                response = json.load(file)
            return JsonResponse(response, safe=False)
        
        except Exception as e:
            logger.error("%s", e, exc_info=True)
            return Response({'error': 'Not Found History.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class fetchReferred(generics.ListAPIView):
    serializer_class = serializer.AccountSerializer
    permission_classes = [IsAuthenticated]

    pagination_class = paginate.PageNumberPagination

    def get_queryset(self, request):
        queryset = model.Account.objects.filter(ref=request.user.uuid).order_by('-id')[:5]
        return queryset

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
            return Response({'error': 'Not Found Referred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)