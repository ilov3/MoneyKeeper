from rest_framework import serializers
from models import Transaction, Account, Category


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ('name', 'opening', 'get_balance')


class CategorySerializer(serializers.ModelSerializer):
    kind = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ('name', 'kind', 'get_transactions_amount')

    def get_kind(self, obj):
        return obj.get_kind_display()


class TransactionSerializer(serializers.ModelSerializer):
    kind = serializers.SerializerMethodField()
    category = serializers.PrimaryKeyRelatedField(source='category.name', queryset=Category.objects.all(), allow_null=True)
    account = serializers.PrimaryKeyRelatedField(source='account.name', queryset=Account.objects.all())
    transfer_to_account = serializers.PrimaryKeyRelatedField(source='transfer_to_account.name', queryset=Account.objects.all(), allow_null=True)

    class Meta:
        model = Transaction

    def get_kind(self, obj):
        return obj.get_kind_display()
