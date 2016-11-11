# coding=utf-8
import logging

from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from MoneyKeeper.views.view_utils import FilterQuerySetMixin

__author__ = 'ilov3'
logger = logging.getLogger(__name__)


class ConfViewSet(FilterQuerySetMixin,
                  ViewSet):
    def list(self, request):
        user = self.get_user()
        logger.debug('User "%s" has logged in.' % user.username)
        return Response({'username': user.username})
