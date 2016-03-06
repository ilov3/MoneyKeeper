# coding=utf-8
import logging

from rest_framework.viewsets import ModelViewSet

from MoneyKeeper.serializers.logEntrySerializer import LogEntrySerializer
from MoneyKeeper.views.view_utils import FilterQuerySetMixin

__author__ = 'ilov3'
logger = logging.getLogger(__name__)


class LogEntryViewSet(FilterQuerySetMixin,
                      ModelViewSet):
    serializer_class = LogEntrySerializer

    def get_queryset(self):
        return super(LogEntryViewSet, self).get_queryset().exclude(content_type__model='user')[:15]
