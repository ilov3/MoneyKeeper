# coding=utf-8
import logging
from rest_framework import serializers

__author__ = 'ilov3'
logger = logging.getLogger(__name__)


class CategoryField(serializers.RelatedField):
    def to_internal_value(self, data):
        kind = self.context['request'].data.get('kind', None)
        user = self.context['request'].user
        if not kind:
            raise serializers.ValidationError('Kind should be provided!')
        if kind == 'trn':
            raise serializers.ValidationError('Category field is unacceptable for this transaction kind(transfer)! Category was "%s".' % data)
        return self.queryset.get(name=data, kind=kind, user=user)

    def to_representation(self, value):
        return value.name


class AccountField(serializers.RelatedField):
    def to_internal_value(self, data):
        user = self.context['request'].user
        return self.queryset.get(name=data, user=user)

    def to_representation(self, value):
        return value.name


class UserField(serializers.RelatedField):
    def to_internal_value(self, data):
        return self.queryset.get(username=data)

    def to_representation(self, value):
        return value.username
