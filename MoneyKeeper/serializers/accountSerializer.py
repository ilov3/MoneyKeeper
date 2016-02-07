# coding=utf-8
import logging

from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from MoneyKeeper.models import Account
from MoneyKeeper.serializers.fields import UserField
from MoneyKeeper.serializers.mixins import GridSchemaMixin

__author__ = 'ilov3'
logger = logging.getLogger(__name__)


class AccountSerializer(GridSchemaMixin, serializers.ModelSerializer):
    user = UserField(queryset=User.objects.all())

    class Meta:
        model = Account
        fields = ('user', 'name', 'opening', 'get_balance')
        grid_schema = [
            {'displayName': 'Name', 'field': 'name', 'colFilter': True},
            {'displayName': 'Opening', 'field': 'opening', 'colFilter': True, 'type': 'number'},
            {'displayName': 'Balance', 'field': 'get_balance', 'colFilter': True, 'type': 'number'},
        ]
        validators = [
            UniqueTogetherValidator(
                    queryset=Account.objects.all(),
                    fields=('user', 'name')
            )
        ]
