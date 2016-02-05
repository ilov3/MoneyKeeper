# coding=utf-8
import logging

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser

__author__ = 'ilov3'
logger = logging.getLogger(__name__)


class DemoAccessMixin(object):
    def get_user(self):
        user = get_user_model().objects.get(username=settings.DEMO_USER_NAME) if isinstance(self.request.user, AnonymousUser) else self.request.user
        return user


class FilterQuerySetMixin(object):
    def get_user(self):
        user = self.request.user
        return user

    def get_model(self):
        return self.serializer_class.Meta.model

    def get_queryset(self):
        user = self.get_user()
        return self.get_model().objects.filter(user=user)
