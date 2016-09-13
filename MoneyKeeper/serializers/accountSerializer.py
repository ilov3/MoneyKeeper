# coding=utf-8
import logging

from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from MoneyKeeper.models import Account
from MoneyKeeper.models.utils import log_addition, log_change
from MoneyKeeper.serializers.fields import UserField
from MoneyKeeper.serializers.mixins import GridSchemaMixin

__author__ = 'ilov3'
logger = logging.getLogger(__name__)


class AccountSerializer(GridSchemaMixin, serializers.ModelSerializer):
    user = UserField(queryset=User.objects.all())

    class Meta:
        model = Account
        fields = ('id', 'user', 'name', 'opening', 'is_shown', 'get_balance')
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

    def create(self, validated_data):
        instance = super(AccountSerializer, self).create(validated_data)
        log_addition(self.context['request'], instance)
        return instance

    def update(self, instance, validated_data):
        instance = super(AccountSerializer, self).update(instance, validated_data)
        log_change(self.context['request'], instance)
        return instance
