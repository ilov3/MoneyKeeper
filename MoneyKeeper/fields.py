# coding=utf-8
import logging
from django.contrib.auth.models import User
from rest_framework.serializers import RelatedField
from models import Category, Account

__author__ = 'ilov3'
logger = logging.getLogger(__name__)


class CategoryField(RelatedField):
    def to_internal_value(self, data):
        kind = self.context['request'].data.get('kind', None)
        if kind:
            return Category.objects.get(name=data, kind=kind)
        else:
            raise Exception('Kind should be provided')

    def to_representation(self, value):
        return value.name


class AccountField(RelatedField):
    def to_internal_value(self, data):
        return Account.objects.get(name=data)

    def to_representation(self, value):
        return value.name


class UserField(RelatedField):
    def to_internal_value(self, data):
        return User.objects.get(username=data)

    def to_representation(self, value):
        return value.username
