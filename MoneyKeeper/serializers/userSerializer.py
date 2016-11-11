# coding=utf-8
import datetime
import logging

from django.conf import settings
from django.contrib.auth.models import User
from django.core.mail import EmailMultiAlternatives
from django.db import transaction
from django.template.loader import get_template
from django.utils.timezone import now
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from MoneyKeeper.models.profile import UserProfile

__author__ = 'ilov3'
logger = logging.getLogger(__name__)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        validators = [
            UniqueTogetherValidator(
                    queryset=model.objects.all(),
                    fields=('email',)
            )
        ]

    def create_profile(self, username):
        user = User.objects.get(username=username)
        key_expires = now() + datetime.timedelta(2)
        new_profile = UserProfile(user=user, activation_key='', key_expires=key_expires)
        new_profile.set_activation_key()
        new_profile.save()

    @staticmethod
    def get_activation_link(request, username):
        user_profile = UserProfile.objects.get(user__username=username)
        protocol = 'https' if request.is_secure() else 'http'
        return '%s://%s/api/user/confirm?activation_key=%s' % (protocol, request.META['HTTP_HOST'], user_profile.activation_key)

    @staticmethod
    def send_confirmation_email(username, activation_link):
        user_profile = UserProfile.objects.get(user__username=username)
        email_subject = 'Account confirmation'
        html = get_template('confirm_email.html')
        html_content = html.render({'username': username, 'activation_link': activation_link})
        msg = EmailMultiAlternatives(email_subject, '', settings.DEFAULT_FROM_EMAIL, [user_profile.user.email])
        msg.attach_alternative(html_content, 'text/html')
        msg.send()

    @transaction.atomic
    def create(self, validated_data):
        user = User(email=validated_data['email'], username=validated_data['username'])
        user.set_password(validated_data['password'])
        user.is_active = False
        user.save()
        self.create_profile(user.username)
        activation_link = self.get_activation_link(self.context['request'], user.username)
        self.send_confirmation_email(user.username, activation_link)
        return user
