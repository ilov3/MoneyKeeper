# coding=utf-8
import logging

from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from MoneyKeeper.models import Account
from MoneyKeeper.serializers import AccountSerializer
from MoneyKeeper.views.metadata import GridMetadata

__author__ = 'ilov3'
logger = logging.getLogger(__name__)


class AccountViewSet(ModelViewSet):
    serializer_class = AccountSerializer
    metadata_class = GridMetadata
    permission_classes = (IsAuthenticated,)
    pagination_class = None

    def get_queryset(self):
        user = self.request.user
        return Account.objects.filter(user=user)
