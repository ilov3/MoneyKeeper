# coding=utf-8
import logging
from rest_framework.serializers import RelatedField

__author__ = 'ilov3'
logger = logging.getLogger(__name__)


class CategoryField(RelatedField):
    def to_internal_value(self, data):
        kind = self.context['request'].data.get('kind', None)
        user = self.context['request'].user
        if kind:
            return self.queryset.get(name=data, kind=kind, user=user)
        else:
            raise Exception('Kind should be provided')

    def to_representation(self, value):
        return value.name


class AccountField(RelatedField):
    def to_internal_value(self, data):
        user = self.context['request'].user
        return self.queryset.get(name=data, user=user)

    def to_representation(self, value):
        return value.name


class UserField(RelatedField):
    def to_internal_value(self, data):
        return self.queryset.get(username=data)

    def to_representation(self, value):
        return value.username
