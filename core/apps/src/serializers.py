from djoser.serializers import PasswordResetConfirmSerializer
from djoser.serializers import UserCreateSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model

from apps.src.models import Invoice, Withdrawals

User = get_user_model()

class UserSerializer(UserCreateSerializer):
    bonus = serializers.SerializerMethodField()
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = '__all__'

class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = '__all__'

class WithdrawalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Withdrawals
        fields = '__all__'

class CustomPasswordResetConfirmSerializer(PasswordResetConfirmSerializer):
    def build_password_reset_confirm_url(self, uid, token):
        url = f"?forgot_password_confirm=True&uid={uid}&token={token}"
        return url