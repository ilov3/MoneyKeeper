# coding=utf-8
import logging
import rest_framework_filters as filters
import arrow
from django.db.models import Q

from models import Transaction

__author__ = 'ilov3'
logger = logging.getLogger(__name__)


class TransactionFilter(filters.FilterSet):
    date = filters.MethodFilter()
    category_or_transfer_to = filters.MethodFilter()
    kind_display = filters.CharFilter(name='kind')
    account = filters.CharFilter(name='account__name', lookup_type='icontains')
    ordering = filters.MethodFilter()

    class Meta:
        model = Transaction
        fields = ['date', 'kind_display', 'category_or_transfer_to', 'account', 'amount', 'comment', 'ordering']

    def filter_category_or_transfer_to(self, qs, value):
        return qs.filter(Q(category__name__icontains=value) | Q(transfer_to_account__name__icontains=value))

    def filter_date(self, qs, value):
        try:
            datetime = arrow.get(value).datetime
            return qs.filter(date=datetime)
        except Exception as e:
            logger.warning('can\'t filter with provided date: "%s\n The error was: %s"' % (value, e))
            return qs

    def filter_ordering(self, qs, value):
        return qs.order_by(value)
