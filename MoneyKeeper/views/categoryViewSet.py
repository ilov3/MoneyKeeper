# coding=utf-8
import logging

from rest_framework.decorators import list_route
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from MoneyKeeper.models.utils import log_deletion
from MoneyKeeper.serializers import CategorySerializer
from MoneyKeeper.utils.common_utils import to_pydate, first_day, last_day
from MoneyKeeper.views.view_utils import FilterQuerySetMixin
from MoneyKeeper.views.metadata import GridMetadata

__author__ = 'ilov3'
logger = logging.getLogger(__name__)


class CategoryViewSet(FilterQuerySetMixin,
                      ModelViewSet):
    serializer_class = CategorySerializer
    metadata_class = GridMetadata
    pagination_class = None

    def perform_destroy(self, instance):
        log_deletion(self.request, instance)
        super(CategoryViewSet, self).perform_destroy(instance)

    @list_route()
    def month_details(self, request):
        date = to_pydate(request.query_params.get('date'))
        kind = request.query_params.get('kind')
        kind = kind if len(kind) == 3 else kind[:3]
        qs = self.get_queryset().filter(kind=kind).annotate_with_amount(first_day(date), last_day(date))
        result = []
        for category in qs:
            if category.transactions_amount:
                data = {
                    'key': category.name,
                    'y': category.transactions_amount,
                }
                result.append(data)
        return Response({'result': result})
