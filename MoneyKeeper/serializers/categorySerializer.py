# coding=utf-8
import logging
from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from MoneyKeeper.models import Category
from MoneyKeeper.models.utils import log_addition, log_change
from MoneyKeeper.serializers.fields import UserField
from MoneyKeeper.serializers.mixins import GridSchemaMixin

__author__ = 'ilov3'
logger = logging.getLogger(__name__)


class CategorySerializer(GridSchemaMixin, serializers.ModelSerializer):
    user = UserField(queryset=User.objects.all())
    kind_display = serializers.CharField(source='get_kind_display', read_only=True)

    class Meta:
        model = Category
        fields = ('id', 'user', 'name', 'kind', 'kind_display', 'is_shown', 'get_transactions_amount', 'get_transactions_amount_last_month')
        grid_schema = [
            {'displayName': 'Name', 'field': 'name', 'colFilter': True},
            {'displayName': 'This month', 'field': 'get_transactions_amount', 'colFilter': True, 'type': 'number'},
            {'displayName': 'Previous month', 'field': 'get_transactions_amount_last_month', 'colFilter': True, 'type': 'number'},
        ]
        validators = [
            UniqueTogetherValidator(
                queryset=model.objects.all(),
                fields=('user', 'name', 'kind')
            )
        ]

    def create(self, validated_data):
        instance = super(CategorySerializer, self).create(validated_data)
        log_addition(self.context['request'], instance)
        return instance

    def update(self, instance, validated_data):
        instance = super(CategorySerializer, self).update(instance, validated_data)
        log_change(self.context['request'], instance)
        return instance