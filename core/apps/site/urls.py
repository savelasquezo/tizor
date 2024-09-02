from django.urls import path
import apps.site.views as view

urlpatterns = [
    path('fetch-sliders/', view.fetchImagesSlider.as_view(), name='fetch-sliders'),
    path('fetch-faqs/', view.fetchFAQs.as_view(), name='fetch-faqs'),
    path('fetch-information/', view.fetchInformation.as_view(), name='fetch-information'),
    path('recaptcha-verify/', view.reCaptchaVerify, name='recaptcha-verify'),
    path('send-email/', view.sendEmail, name='send-email'),
    path('files/<int:id>/download/', view.downloadPDF, name='download-file'),
]