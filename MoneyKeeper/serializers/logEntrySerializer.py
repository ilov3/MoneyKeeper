# coding=utf-8
import logging

from django.contrib.admin.models import LogEntry
from rest_framework import serializers

__author__ = 'ilov3'
logger = logging.getLogger(__name__)


class LogEntrySerializer(serializers.ModelSerializer):
    object_repr = serializers.CharField(read_only=True)
    content_type = serializers.ReadOnlyField(source='content_type.model')
    action_type = serializers.SerializerMethodField()

    class Meta:
        model = LogEntry
        fields = ('action_time', 'object_repr', 'content_type', 'action_type')

    def get_action_type(self, obj):
        if obj.is_addition():
            return 'addition'
        elif obj.is_change():
            return 'change'
        elif obj.is_deletion():
            return 'deletion'
        else:
            return 'unknown'
