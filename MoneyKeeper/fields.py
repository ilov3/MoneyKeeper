# coding=utf-8
import logging
from rest_framework.serializers import RelatedField
from models import Category, Account

__author__ = 'ilov3'
logger = logging.getLogger(__name__)


class CategoryField(RelatedField):
    def to_internal_value(self, data):
        return Category.objects.get(name=data)

    def to_representation(self, value):
        return value.name


class AccountField(RelatedField):
    def to_internal_value(self, data):
        return Account.objects.get(name=data)

    def to_representation(self, value):
        return value.name
