import datetime

from django.conf import settings
from django.contrib.auth.models import User
from django.core.mail import EmailMultiAlternatives
from django.db import transaction
from django.template.loader import get_template
from django.utils.timezone import now
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.validators import UniqueTogetherValidator
from rest_framework_jwt.serializers import JSONWebTokenSerializer

from MoneyKeeper.fields import CategoryField, AccountField, UserField
from MoneyKeeper.models.profile import UserProfile
from MoneyKeeper.models.transaction import TRANSACTION_KINDS
from models import Transaction, Account, Category


class GridSchemaMixin(object):
    @classmethod
    def get_grid_schema(cls):
        return cls.Meta.grid_schema


class AccountSerializer(GridSchemaMixin, serializers.ModelSerializer):
    user = UserField(queryset=User.objects.all())

    class Meta:
        model = Account
        fields = ('user', 'name', 'opening', 'get_balance')
        grid_schema = [
            {'displayName': 'Name', 'field': 'name', 'colFilter': True},
            {'displayName': 'Opening', 'field': 'opening', 'colFilter': True, 'type': 'number'},
            {'displayName': 'Balance', 'field': 'get_balance', 'colFilter': True, 'type': 'number'},
        ]
        validators = [
            UniqueTogetherValidator(
                    queryset=Account.objects.all(),
                    fields=('user', 'name')
            )
        ]


class CategorySerializer(GridSchemaMixin, serializers.ModelSerializer):
    user = UserField(queryset=User.objects.all())
    kind_display = serializers.CharField(source='get_kind_display', read_only=True)

    class Meta:
        model = Category
        fields = ('user', 'name', 'kind', 'kind_display', 'get_transactions_amount', 'get_transactions_amount_last_month')
        grid_schema = [
            {'displayName': 'Name', 'field': 'name', 'colFilter': True},
            {'displayName': 'This month', 'field': 'get_transactions_amount', 'colFilter': True, 'type': 'number'},
            {'displayName': 'Previous month', 'field': 'get_transactions_amount_last_month', 'colFilter': True, 'type': 'number'},
        ]
        validators = [
            UniqueTogetherValidator(
                    queryset=model.objects.all(),
                    fields=('user', 'name', 'kind')
            )
        ]


class TransactionSerializer(GridSchemaMixin, serializers.ModelSerializer):
    user = UserField(queryset=User.objects.all())
    kind_display = serializers.CharField(source='get_kind_display', read_only=True)
    category = CategoryField(queryset=Category.objects.all(), allow_null=True, required=False)
    account = AccountField(queryset=Account.objects.all())
    transfer_to_account = AccountField(queryset=Account.objects.all(), allow_null=True, required=False)
    category_or_transfer_to = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        grid_schema = [
            {'displayName': 'Date', 'field': 'date', 'type': 'date', 'colFilter': True},
            {'displayName': 'Kind', 'field': 'kind_display', 'colFilter': True, 'enableSorting': False, 'filter':
                {'type': 'select', 'selectOptions': [{'value': abbr, 'label': display} for abbr, display in TRANSACTION_KINDS]}},
            {'displayName': 'Category/Transfer to', 'field': 'category_or_transfer_to', 'enableSorting': False, 'colFilter': True},
            {'displayName': 'Account', 'field': 'account', 'colFilter': True},
            {'displayName': 'Amount', 'field': 'amount', 'colFilter': True, 'type': 'number'},
            {'displayName': 'Comment', 'field': 'comment', 'colFilter': True},
        ]

    def get_category_or_transfer_to(self, obj):
        res = obj.category or obj.transfer_to_account
        return res.name


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
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
