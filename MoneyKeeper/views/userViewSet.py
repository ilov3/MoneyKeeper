# coding=utf-8
import logging

from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import list_route
from rest_framework.mixins import CreateModelMixin
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework_jwt.utils import jwt_payload_handler, jwt_encode_handler

from MoneyKeeper.serializers import UserSerializer

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
        payload = jwt_payload_handler(self.queryset.get(username=serializer.data['username']))
        data = serializer.data
        data['token'] = jwt_encode_handler(payload)
        headers = self.get_success_headers(serializer.data)
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)

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
