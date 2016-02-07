# coding=utf-8
import logging

from django.contrib.auth.models import User
from rest_framework import serializers

from MoneyKeeper.models import Category, Account, Transaction
from MoneyKeeper.models.transaction import TRANSACTION_KINDS
from MoneyKeeper.serializers.fields import UserField, CategoryField, AccountField
from MoneyKeeper.serializers.mixins import GridSchemaMixin

__author__ = 'ilov3'
logger = logging.getLogger(__name__)


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
            {'displayName': 'Date', 'field': 'date', 'type': 'date', 'colFilter': True},
            {'displayName': 'Kind', 'field': 'kind_display', 'colFilter': True, 'enableSorting': False, 'filter':
                {'type': 'select', 'selectOptions': [{'value': abbr, 'label': display} for abbr, display in TRANSACTION_KINDS]}},
            {'displayName': 'Category/Transfer to', 'field': 'category_or_transfer_to', 'enableSorting': False, 'colFilter': True},
            {'displayName': 'Account', 'field': 'account', 'colFilter': True},
            {'displayName': 'Amount', 'field': 'amount', 'colFilter': True, 'type': 'number'},
            {'displayName': 'Comment', 'field': 'comment', 'colFilter': True},
        ]

    def get_category_or_transfer_to(self, obj):
        res = obj.category or obj.transfer_to_account
        return res.name
