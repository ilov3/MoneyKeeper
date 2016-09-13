# coding=utf-8
import logging
from django.contrib.admin.models import LogEntry, CHANGE, DELETION, ADDITION
from django.contrib.admin.options import get_content_type_for_model
from django.utils.encoding import force_text

__author__ = 'ilov3'
logger = logging.getLogger(__name__)


def log_addition(request, obj):
    message = ''
    LogEntry.objects.log_action(
            user_id=request.user.pk,
            content_type_id=get_content_type_for_model(obj).pk,
            object_id=obj.pk,
            object_repr=force_text(obj),
            action_flag=ADDITION,
            change_message=message,
    )


def log_change(request, obj):
    message = ''
    LogEntry.objects.log_action(
            user_id=request.user.pk,
            content_type_id=get_content_type_for_model(obj).pk,
            object_id=obj.pk,
            object_repr=force_text(obj),
            action_flag=CHANGE,
            change_message=message,
    )


def log_deletion(request, obj):
    LogEntry.objects.log_action(
            user_id=request.user.pk,
            content_type_id=get_content_type_for_model(obj).pk,
            object_id=obj.pk,
            object_repr=force_text(obj),
            action_flag=DELETION,
    )
