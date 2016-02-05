# coding=utf-8
import logging

from rest_framework.viewsets import ModelViewSet

from MoneyKeeper.serializers import AccountSerializer
from MoneyKeeper.views.view_utils import FilterQuerySetMixin
from MoneyKeeper.views.metadata import GridMetadata

__author__ = 'ilov3'
logger = logging.getLogger(__name__)


class AccountViewSet(FilterQuerySetMixin,
                     ModelViewSet):
    serializer_class = AccountSerializer
    metadata_class = GridMetadata
    pagination_class = None