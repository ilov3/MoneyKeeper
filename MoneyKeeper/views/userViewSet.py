# coding=utf-8
import logging
import base64

from django.contrib.auth.models import User, AnonymousUser
from django.db import transaction
from django.shortcuts import get_object_or_404, render_to_response, redirect
from django.utils.timezone import now
from rest_framework import status
from rest_framework.decorators import list_route
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import CreateModelMixin
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework_jwt.views import JSONWebTokenAPIView
from rest_framework_jwt.settings import api_settings
import redis

from MoneyKeeper.models.profile import UserProfile
from MoneyKeeper.serializers import UserSerializer, JWTokenSerializer
from MoneyKeeper.serializers.passwordResetSerializers import PasswordResetSerializer

__author__ = 'ilov3'
logger = logging.getLogger(__name__)


class UserViewSet(CreateModelMixin,
                  GenericViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        data = serializer.data
        return Response(data, status=status.HTTP_201_CREATED)

    @list_route()
    def exists(self, request):
        username = request.query_params.get('username', None)
        email = request.query_params.get('email', None)
        if username:
            try:
                self.queryset.get(username=username)
                return Response({'result': True})
            except self.serializer_class.Meta.model.DoesNotExist:
                return Response({'result': False})
        if email:
            try:
                self.queryset.get(email=email)
                return Response({'result': True})
            except self.serializer_class.Meta.model.DoesNotExist:
                return Response({'result': False})
        else:
            return Response({'details': 'no data provided'}, status=status.HTTP_400_BAD_REQUEST)

    @list_route()
    def confirm(self, request):
        activation_key = request.query_params.get('activation_key')
        if activation_key:
            user_profile = get_object_or_404(UserProfile, activation_key=activation_key)
            if user_profile.key_expires < now():
                inner_content = (
                    '''
                    <p>Your confirmation link has been expired.</p>
                    <p>You can request a new one by button below</p>
                    <p class="lead">
                    <a href="/api/user/confirm_refresh?activation_key=%s" class="btn btn-lg btn-default">Request</a>
                    </p>
                    ''' % activation_key
                )
            else:
                user = user_profile.user
                user.is_active = True
                user.save()
                inner_content = (
                    '''
                    <p>Your account has been activated!</p>
                    <p>Provide your account credentials on next view</p>
                    <p class="lead">
                    <a href="/" class="btn btn-lg btn-default">Next</a>
                    </p>
                    '''
                )
                logger.info('"%s" successfully activated his account', user)
            return render_to_response('confirm.html', {'inner_content': inner_content})
        return redirect('/about')

    @list_route()
    @transaction.atomic
    def confirm_refresh(self, request):
        activation_key = request.query_params.get('activation_key')
        if activation_key:
            user_profile = get_object_or_404(UserProfile, activation_key=activation_key)
            user_profile.set_activation_key()
            activation_link = UserSerializer.get_activation_link(request, user_profile.user.username)
            UserSerializer.send_confirmation_email(user_profile.user.username, activation_link)
            inner_content = (
                '''
                <p>We send you new confirmation e-mail to %s</p>
                ''' % user_profile.user.email
            )
            return render_to_response('confirm.html', {'inner_content': inner_content})
        return redirect('/about')


class ObtainJSONWebToken(JSONWebTokenAPIView):
    """
    API View that receives a POST with a user's username and password.

    Returns a JSON Web Token that can be used for authenticated requests.
    """
    serializer_class = JWTokenSerializer


class PasswordResetView(GenericAPIView):
    """
    Calls Django Auth PasswordResetForm save method.
    Accepts the following POST parameters: email
    Returns the success/fail message.
    """

    serializer_class = PasswordResetSerializer
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        # Create a serializer with request.data
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            serializer.save()
            # Return the success message with OK HTTP status
            return Response(
                    {"success": "Password reset e-mail has been sent."},
                    status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.error('Error on password reset request.')
            logger.exception(e)


def password_reset_success(request):
    inner_content = ('''
                    <p>Password has been reset with the new password.</p>
                    <p>Provide your account credentials on next view</p>
                    <p class="lead">
                    <a href="/" class="btn btn-lg btn-default">Next</a>
                    </p>
                    ''')
    logger.info('Password has been reset')
    return render_to_response('confirm.html', {'inner_content': inner_content})


def auth_token_redirect(request, user_id):
    if request.user == AnonymousUser:
        # TODO finish this case
        inner_content = ('''
        <p>Provide your login and password:</p>
        ''')
        return render_to_response('confirm.html', {'inner_content': inner_content})
    else:
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
        payload = jwt_payload_handler(request.user)
        token = jwt_encode_handler(payload)
        r = redis.StrictRedis(host='localhost', port=6379, db=0)
        r.hset(user_id, 'token', token)
        return redirect('https://telegram.me/MoneyKeeperBot?start=authenticated')
