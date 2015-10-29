from rest_framework import serializers
from MoneyKeeper.fields import CategoryField, AccountField
from models import Transaction, Account, Category


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ('name', 'opening', 'get_balance')


class CategorySerializer(serializers.ModelSerializer):
    kind = serializers.CharField(source='get_kind_display')

    class Meta:
        model = Category
        fields = ('name', 'kind', 'get_transactions_amount', 'get_transactions_amount_last_month')


class TransactionSerializer(serializers.ModelSerializer):
    kind_display = serializers.CharField(source='get_kind_display', read_only=True)
    category = CategoryField(queryset=Category.objects.all(), allow_null=True, required=False)
    account = AccountField(queryset=Account.objects.all())
    transfer_to_account = AccountField(queryset=Account.objects.all(), allow_null=True, required=False)

    class Meta:
        model = Transaction
