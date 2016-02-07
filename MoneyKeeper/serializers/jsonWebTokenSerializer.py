# coding=utf-8
import logging

from rest_framework.exceptions import ValidationError
from rest_framework_jwt.serializers import JSONWebTokenSerializer

__author__ = 'ilov3'
logger = logging.getLogger(__name__)


class JWTokenSerializer(JSONWebTokenSerializer):
    message_map = {
        'User account is disabled.': 'User account is disabled. Probably you didn\'t check confirmation e-mail.'
    }

    def validate(self, attrs):
        try:
            return super(JWTokenSerializer, self).validate(attrs)
        except ValidationError as error:
            if len(error.detail) and error.detail[0] in self.message_map:
                raise ValidationError(self.message_map.get(error.detail[0]))
            raise error
