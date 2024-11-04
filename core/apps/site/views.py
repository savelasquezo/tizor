import logging, requests
from django.conf import settings

from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.template.loader import render_to_string

from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

import apps.site.models as model
import apps.site.serializers as serializer


logger = logging.getLogger(__name__)

class fetchInformation(generics.GenericAPIView):
    """
    Endpoint to retrieve Tizorbank Information.
    Not Requires authentication.
    """
    serializer_class = serializer.TizorbankSerializer
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):

        try:
            queryset = model.Tizorbank.objects.all().first()
            serializer = self.get_serializer(queryset)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error("%s", e, exc_info=True)
            return Response({'detail': 'NotFound Tizorbank Information.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class fetchImagesSlider(generics.ListAPIView):
    """
    Endpoint to retrieve all images of Slider module.
    Not Requires authentication.
    """
    queryset = model.ImageSlider.objects.all()
    serializer_class = serializer.ImageSliderSerializer
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):

        try:
            queryset = self.filter_queryset(self.get_queryset())
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error("%s", e, exc_info=True)
            return Response({'detail': 'NotFound Images.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)  


@api_view(['POST'])
@permission_classes([AllowAny])
def reCaptchaVerify(request):
    try:
        payload = {
            'secret': settings.GGRECAPTCHA_KEY,
            'response': request.data.get('token')
        }
        response = requests.post('https://www.google.com/recaptcha/api/siteverify', data=payload)
        result = response.json()
        if result.get('success'):
            return JsonResponse({'success': True, 'message': 'Verification successful'})

    except Exception as e:
        logger.error("%s", e, exc_info=True)
        return JsonResponse({'success': False, 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def sendEmail(request):
    try:
        subject = request.data.get('subject')
        requestEmail = request.data.get('email', None)
        requestMessage = request.data.get('message', None)
        email_template_name = 'message.html'

        context = {
            "send": requestEmail,
            "message": requestMessage,
        }

        email_content = render_to_string(email_template_name, context)
        support_email = dict(settings.ADMINS).get('Support')
        send_mail(subject, message=None, from_email=settings.SERVER_EMAIL,
                  recipient_list=[support_email], fail_silently=False, html_message=email_content)
        
        return Response({'detail': 'Email Enviado.'}, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error("%s", e, exc_info=True)
        return Response({'error': 'SendEmail Failed.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@csrf_exempt
def downloadPDF(request, id):
    obj = get_object_or_404(model.Informations, pk=id)        
    with open(obj.file.path, 'rb') as f:
        response = HttpResponse(f.read(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="PajoyTours.pdf"'
        return response
