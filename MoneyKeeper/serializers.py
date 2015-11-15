from django.contrib.auth.models import User
from rest_framework import serializers
from MoneyKeeper.fields import CategoryField, AccountField, UserField
from models import Transaction, Account, Category


class GridSchemaMixin(object):
    @classmethod
    def get_grid_schema(cls):
        return cls.Meta.grid_schema


class AccountSerializer(GridSchemaMixin, serializers.ModelSerializer):
    user = UserField(queryset=User.objects.all())

    class Meta:
        model = Account
        fields = ('user', 'name', 'opening', 'get_balance')
        grid_schema = [
            {'displayName': 'Name', 'field': 'name', 'colFilter': True},
            {'displayName': 'Opening', 'field': 'opening', 'colFilter': True},
            {'displayName': 'Balance', 'field': 'get_balance', 'colFilter': True},
        ]


class CategorySerializer(GridSchemaMixin, serializers.ModelSerializer):
    user = UserField(queryset=User.objects.all())
    kind_display = serializers.CharField(source='get_kind_display', read_only=True)

    class Meta:
        model = Category
        fields = ('user', 'name', 'kind', 'kind_display', 'get_transactions_amount', 'get_transactions_amount_last_month')
        grid_schema = [
            {'displayName': 'Name', 'field': 'name', 'colFilter': True},
            {'displayName': 'This month', 'field': 'get_transactions_amount', 'colFilter': True},
            {'displayName': 'Previous month', 'field': 'get_transactions_amount_last_month', 'colFilter': True},
        ]


class TransactionSerializer(GridSchemaMixin, serializers.ModelSerializer):
    user = UserField(queryset=User.objects.all())
    kind_display = serializers.CharField(source='get_kind_display', read_only=True)
    category = CategoryField(queryset=Category.objects.all(), allow_null=True, required=False)
    account = AccountField(queryset=Account.objects.all())
    transfer_to_account = AccountField(queryset=Account.objects.all(), allow_null=True, required=False)
    category_or_transfer_to = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        grid_schema = [
            {'displayName': 'Date', 'field': 'date', 'cellFilter': 'date', 'colFilter': True},
            {'displayName': 'Kind', 'field': 'kind_display', 'colFilter': True},
            {'displayName': 'Category/Transfer to', 'field': 'category_or_transfer_to', 'colFilter': True},
            {'displayName': 'Account', 'field': 'account', 'colFilter': True},
            {'displayName': 'Amount', 'field': 'amount', 'colFilter': True},
            {'displayName': 'Comment', 'field': 'comment', 'colFilter': True},
        ]

    def get_category_or_transfer_to(self, obj):
        res = obj.category or obj.transfer_to_account
        return res.name


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User

    def create(self, validated_data):
        user = User(email=validated_data['email'], username=validated_data['username'])
        user.set_password(validated_data['password'])
        user.save()
        return user
