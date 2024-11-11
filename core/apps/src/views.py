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
from apps.src.functions import makeTransaction, makeHistory, updateJson, sendEmail

logger = logging.getLogger(__name__)

def makeInvoice(length=12):
    return base64.urlsafe_b64encode(os.urandom(length)).decode('utf-8')[:length]


class updateAccount(generics.GenericAPIView):
    """
    API view to update the authenticated user's address.

    Attributes:
        serializer_class (serializer.AccountSerializer): The serializer for request and response data.
        permission_classes (list): The permissions required to access this view.

    Methods:
        post(request, *args, **kwargs):
            Updates the user's address if it's not already associated with another account.
    """
    serializer_class = serializer.AccountSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        network = request.data.get('network')
        address = request.data.get('address')
        
        try:
            if model.Account.objects.filter(address=address) and address != request.user.address:
                return Response({'error': 'The wallet is already associated with another account'}, status=status.HTTP_409_CONFLICT)
            
            if network:
                request.user.network = network
            if address:
                request.user.address = address
                
            request.user.save()
            return Response({'message': 'The user has been updated successfully'}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error("%s", e, exc_info=True)
            return Response({'error': 'NotFound Account'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



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
            logger.error("requestInvoice GET: %s", e, exc_info=True)
            return Response({'error': 'Not Found Invoices.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, *args, **kwargs):
        user = request.user
        amount = float(request.data.get('amount'))
        tz = Tizorbank.objects.get(default="Tizorbank")
        
        data = {'amount': amount, 'network':user.network, 'address':tz.address}
        if data['amount'] <= 0:
            return Response({'detail': 'The requested amount is incorrect'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            with transaction.atomic():
                obj, created = model.Invoice.objects.get_or_create(account=user,state='invoiced',defaults={**data})
                if not created:
                    for attr, value in data.items():
                        setattr(obj, attr, value)
                    obj.save()

            apiInvoice = obj.voucher
            makeTransaction(user, obj.amount, 'income','invoiced', apiInvoice)
            
            try:
                template_url = tz.template_invoice if tz.template_invoice else "mail/demo/template_invoice.html"
                email_list=[user.email]
                context_data = {'voucher': obj.voucher, 'amount': amount, 'network': tz.network, 'address': tz.address}
                sendEmail(f'Tizorbank - Invoiced-{context_data["voucher"]}', template_url, email_list, context_data)
            except Exception as e:
                logger.error("sendEmail Error --> requestInvoice %s: %s", user.email, e, exc_info=True)
                logger.error("%s", e, exc_info=True)

            return Response({'apiInvoice': apiInvoice}, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error("requestInvoice POST: %s", e, exc_info=True)
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
        user = request.user
        
        amount = float(request.data.get('amount'))
        data = {'amount': amount, 'network':user.network, 'address':user.address}
        if amount > user.balance or amount <= 0:
            return Response({'detail': 'The requested amount is incorrect'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            with transaction.atomic():
                obj, created = model.Withdrawal.objects.get_or_create(account=user, state='invoiced', defaults={**data})
                if not created:
                    obj.amount += amount
                    obj.save()
            
            user.balance -= amount
            user.save()
            
            updateJson(user, user.balance)

            apiWithdrawal = obj.voucher
            makeTransaction(request.user, -obj.amount, 'outcome', 'invoiced', apiWithdrawal)
            
            try:
                tz = Tizorbank.objects.get(default="Tizorbank")
                template_url = tz.template_withdrawal if tz.template_withdrawal else "mail/demo/template_withdrawal.html"
                email_list=[user.email]
                context_data = {'voucher': obj.voucher, 'amount': obj.amount, 'network': obj.network, 'address': obj.address}
                sendEmail(f'Tizorbank - Withdrawal-{context_data["voucher"]}', template_url, email_list, context_data)
            except Exception as e:
                logger.error("sendEmail Error --> requestWithdrawal %s: %s", user.email, e, exc_info=True)
                logger.error("%s", e, exc_info=True)
            
            return Response({'apiWithdrawal': apiWithdrawal}, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error("%s", e, exc_info=True)
            return Response({'error': 'NotFound Invoice.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 


class requestInvestment(generics.GenericAPIView):
    
    serializer_class = serializer.InvestmentSerializer
    permission_classes = [IsAuthenticated]

    pagination_class = paginate.InvestmentPagination
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
        user = request.user
        
        amount = request.data.get('amount')
        months = request.data.get('months')
        if amount > user.balance or amount <= 0 or not months in range(6, 37):
            return Response({'detail': 'The requested amount is incorrect'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            tz = Tizorbank.objects.get(default="Tizorbank")
            obj = model.Investment.objects.create(account=user)
        
            obj.amount = amount
            obj.interest = round(tz.min_interest * math.exp((math.log(tz.max_interest/tz.min_interest) / 36) * months),2)
            obj.date_target = timezone.now() + relativedelta(months=months)
            obj.save()
            
            user.balance -= amount
            user.save()
            
            updateJson(user, user.balance)
            apiInvestment = obj.voucher
            makeHistory(request.user, obj, obj.amount, 'investment')
            makeTransaction(request.user, -amount, 'investment', 'done', apiInvestment)
            
            try:
                template_url = tz.template_investment if tz.template_investment else "mail/demo/template_investment.html"
                email_list=[user.email]
                context_data = {'voucher': obj.voucher, 'amount': obj.amount, 'interest': obj.interest, 'date_target': obj.date_target}
                sendEmail(f'Tizorbank - Investment-{context_data["voucher"]}', template_url, email_list, context_data)
            except Exception as e:
                logger.error("sendEmail Error --> requestInvestment %s: %s", user.email, e, exc_info=True)
                logger.error("%s", e, exc_info=True)
            
            return Response({'apiInvestment': apiInvestment}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error("%s", e, exc_info=True)
            return Response({'error': 'NotFound Investment.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 


class refundInvestment(generics.GenericAPIView):
    
    serializer_class = serializer.InvestmentSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            user = request.user      
            voucher = request.data.get('voucher')  
            investment = model.Investment.objects.get(account=user, voucher=voucher)

            if investment.state != 'active':
                return Response({'detail': 'The requested state is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

            data = Tizorbank.objects.get(default="Tizorbank")
            investment.state = 'cancelled'
            investment.save()
            
            amount = investment.amount + investment.accumulated*(data.unlock/100)
            user.balance += amount
            user.save()
            
            updateJson(user, user.balance)
            makeHistory(user, investment, amount, 'refund')
            makeTransaction(user, amount, 'investment','refund')

            try:
                tz = Tizorbank.objects.get(default="Tizorbank")
                template_url = tz.template_investment_status if tz.template_investment_status else "mail/demo/template_investment_status.html"
                email_list=[user.email]
                context_data = {'voucher': investment.voucher, 'amount': amount, 'state': investment.state}
                sendEmail(f'Tizorbank - Investment-{context_data["voucher"]}', template_url, email_list, context_data)
            except Exception as e:
                logger.error("sendEmail Error --> refundInvestment %s: %s", user.email, e, exc_info=True)
                logger.error("%s", e, exc_info=True)

            return Response({'message': 'the investment was refunded successful'}, status=status.HTTP_200_OK)

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