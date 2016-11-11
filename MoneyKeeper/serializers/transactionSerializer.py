# coding=utf-8
import logging

from django.contrib.auth.models import User
from rest_framework import serializers

from MoneyKeeper.models import Category, Account, Transaction
from MoneyKeeper.models.transaction import TRANSACTION_KINDS
from MoneyKeeper.models.utils import log_addition, log_change
from MoneyKeeper.serializers.fields import UserField, CategoryField, AccountField
from MoneyKeeper.serializers.mixins import GridSchemaMixin

__author__ = 'ilov3'
logger = logging.getLogger(__name__)


def transfer_transaction_is_valid(value):
    if value.get('kind', None) == 'trn':
        if not value['transfer_to_account']:
            raise serializers.ValidationError('Endpoint account for transaction not provided!')


def income_expense_transaction_is_valid(value):
    if value.get('kind', None) in ('inc', 'exp'):
        if not value.get('category', None):
            raise serializers.ValidationError('Category field is necessary for this transaction kind(income)!')
        if value.get('transfer_to_account', None):
            raise serializers.ValidationError(
                    'Transfer_to_account field is unacceptable for this transaction kind(income)! Transfer_to_account was "%s".' % value['transfer_to_account'])


class TransactionSerializer(GridSchemaMixin, serializers.ModelSerializer):
    user = UserField(queryset=User.objects.all())
    kind_display = serializers.CharField(source='get_kind_display', read_only=True)
    category = CategoryField(queryset=Category.objects.all(), allow_null=True, required=False)
    account = AccountField(queryset=Account.objects.all())
    transfer_to_account = AccountField(queryset=Account.objects.all(), allow_null=True, required=False)
    category_or_transfer_to = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = '__all__'
        grid_schema = [
            {'displayName': 'Date', 'field': 'date', 'type': 'date', 'colFilter': True, 'cellFilter': 'date:"dd.MM.yyyy"', 'enableCellEdit': False},
            {'displayName': 'Kind', 'field': 'kind_display', 'colFilter': True, 'enableSorting': False, 'editableCellTemplate': 'ui-grid/dropdownEditor',
             'editDropdownOptionsArray': [{'id': display, 'value': display} for abbr, display in TRANSACTION_KINDS],
             'filter': {'type': 'select', 'selectOptions': [{'value': abbr, 'label': display} for abbr, display in TRANSACTION_KINDS]}},
            {'displayName': 'Category/Transfer to', 'field': 'category_or_transfer_to', 'enableSorting': False, 'colFilter': True,
             'editableCellTemplate': 'ui-grid/dropdownEditor'},
            {'displayName': 'Account', 'field': 'account', 'colFilter': True, 'editableCellTemplate': 'ui-grid/dropdownEditor'},
            {'displayName': 'Amount', 'field': 'amount', 'colFilter': True, 'type': 'numberStr'},
            {'displayName': 'Comment', 'field': 'comment', 'colFilter': True},
        ]
        validators = [
            transfer_transaction_is_valid,
            income_expense_transaction_is_valid,
        ]

    def get_category_or_transfer_to(self, obj):
        res = obj.category or obj.transfer_to_account
        return res.name

    def create(self, validated_data):
        instance = super(TransactionSerializer, self).create(validated_data)
        log_addition(self.context['request'], instance)
        return instance

    def update(self, instance, validated_data):
        instance = super(TransactionSerializer, self).update(instance, validated_data)
        log_change(self.context['request'], instance)
        return instance
