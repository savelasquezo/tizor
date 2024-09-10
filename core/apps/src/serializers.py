from djoser.serializers import PasswordResetConfirmSerializer
from djoser.serializers import UserCreateSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model

import apps.src.models as model

Account = get_user_model()

class AccountSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = model.Account
        fields = '__all__'

class InvestmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = model.Investment
        fields = '__all__'

class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = model.Invoice
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        address = representation.get('address', '')
        if address and len(address) > 6:
            masked_address = f"{address[:3]}****{address[-3:]}"
            representation['address'] = masked_address

        return representation

class WithdrawalSerializer(serializers.ModelSerializer):
    class Meta:
        model = model.Withdrawal
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        address = representation.get('address', '')
        if address and len(address) > 6:
            masked_address = f"{address[:3]}****{address[-3:]}"
            representation['address'] = masked_address

        return representation

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = model.Transaction
        fields = '__all__'

class CustomPasswordResetConfirmSerializer(PasswordResetConfirmSerializer):
    def build_password_reset_confirm_url(self, uid, token):
        url = f"?forgot_password_confirm=True&uid={uid}&token={token}"
        return url