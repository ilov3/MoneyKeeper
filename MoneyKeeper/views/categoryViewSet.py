# coding=utf-8
import logging

from rest_framework.decorators import list_route
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from MoneyKeeper.models import Category
from MoneyKeeper.serializers import CategorySerializer
from MoneyKeeper.utils.utils import to_pydate, first_day, last_day
from MoneyKeeper.views.metadata import GridMetadata

__author__ = 'ilov3'
logger = logging.getLogger(__name__)


class CategoryViewSet(ModelViewSet):
    serializer_class = CategorySerializer
    metadata_class = GridMetadata
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return Category.objects.filter(user=user)

    @list_route()
    def month_details(self, request):
        date = to_pydate(request.query_params.get('date'))
        kind = request.query_params.get('kind')
        kind = kind if len(kind) == 3 else kind[:3]
        qs = self.get_queryset().filter(kind=kind)
        result = []
        for category in qs:
            value = category.get_transactions_amount(fr=first_day(date), to=last_day(date))
            if value:
                data = {
                    'key': category.name,
                    'y': value,
                }
                result.append(data)
        return Response({'result': result})
