# coding=utf-8
import logging

from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

__author__ = 'ilov3'
logger = logging.getLogger(__name__)


class ConfViewSet(ViewSet):
    def get(self, request):
        user = request.user
        return Response({'username': user.username})
