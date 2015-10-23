from rest_framework import serializers
from MoneyKeeper.fields import CategoryField, AccountField
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
    category = CategoryField(queryset=Category.objects.all(), allow_null=True)
    account = AccountField(queryset=Account.objects.all())
    transfer_to_account = AccountField(queryset=Account.objects.all(), allow_null=True)

    class Meta:
        model = Transaction

    def get_kind(self, obj):
        return obj.get_kind_display()
