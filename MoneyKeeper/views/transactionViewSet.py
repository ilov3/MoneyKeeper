# coding=utf-8
import logging

from rest_framework.decorators import list_route
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from MoneyKeeper.models.utils import log_deletion
from MoneyKeeper.serializers import TransactionSerializer
from MoneyKeeper.utils.common_utils import to_pydate
from MoneyKeeper.views.filters import TransactionFilter
from MoneyKeeper.views.metadata import GridMetadata
from MoneyKeeper.views.view_utils import FilterQuerySetMixin

__author__ = 'ilov3'
logger = logging.getLogger(__name__)


class TransactionViewSet(FilterQuerySetMixin,
                         ModelViewSet):
    serializer_class = TransactionSerializer
    metadata_class = GridMetadata
    filter_class = TransactionFilter

    def perform_destroy(self, instance):
        log_deletion(self.request, instance)
        super(TransactionViewSet, self).perform_destroy(instance)

    @list_route()
    def amount(self, request):
        begin = request.query_params.get('begin', None)
        end = request.query_params.get('end', None)
        kind = request.query_params.get('kind', None)
        income = self.get_queryset().get_amount(kind, to_pydate(begin), to_pydate(end))
        return Response({'result': income})

    @list_route()
    def stats(self, request):
        stats = self.get_queryset().get_amounts_by_month()
        balance = 0
        result = []
        for stat in stats:
            balance += stat['profit']
            result.append({'income': stat['inc_sum'],
                           'expense': stat['exp_sum'],
                           'month': stat['month'],
                           'balance': balance})
        return Response({'result': result})
