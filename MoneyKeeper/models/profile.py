# coding=utf-8
import hashlib
import logging

import random

from django.contrib.auth.models import User
from django.db import models
from django.utils.timezone import now

__author__ = 'ilov3'
logger = logging.getLogger(__name__)


class UserProfile(models.Model):
    user = models.OneToOneField(User)
    activation_key = models.CharField(max_length=40, blank=True)
    key_expires = models.DateTimeField(default=now())

    def __unicode__(self):
        return u'%s' % self.user.username

    class Meta:
        verbose_name_plural = u'User profiles'

    def set_activation_key(self):
        salt = hashlib.sha1(str(random.random())).hexdigest()[:5]
        activation_key = hashlib.sha1(salt + self.user.email).hexdigest()
        self.activation_key = activation_key
        self.save()
        return activation_key
