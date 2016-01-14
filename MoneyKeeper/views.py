from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import list_route
from rest_framework.metadata import SimpleMetadata
from rest_framework.mixins import CreateModelMixin
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ViewSet, GenericViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_jwt.utils import jwt_payload_handler, jwt_encode_handler
from MoneyKeeper.models import Transaction, Category, Account
from MoneyKeeper.serializers import TransactionSerializer, CategorySerializer, AccountSerializer, UserSerializer
from MoneyKeeper.utils.utils import to_pydate, to_js_timestamp, first_day, last_day, random_color


class GridMetadata(SimpleMetadata):
    def determine_metadata(self, request, view):
        return view.serializer_class.get_grid_schema()


class TransactionViewSet(ModelViewSet):
    serializer_class = TransactionSerializer
    metadata_class = GridMetadata
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return Transaction.objects.filter(user=user)

    @list_route()
    def amount(self, request):
        begin = request.query_params.get('begin', None)
        end = request.query_params.get('end', None)
        kind = request.query_params.get('kind', None)
        income = self.get_queryset().get_amount(kind, to_pydate(begin), to_pydate(end))
        return Response({'result': income})

    @list_route()
    def stats(self, request):
        stats = self.get_queryset().get_amounts_by_month()
        balance = 0
        result = []
        for stat in stats:
            balance += stat['profit']
            result.append({'income': stat['inc_sum'],
                           'expense': stat['exp_sum'],
                           'month': stat['month'],
                           'balance': balance})
        return Response({'result': result})


class CategoryViewSet(ModelViewSet):
    serializer_class = CategorySerializer
    metadata_class = GridMetadata
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return Category.objects.filter(user=user)

    @list_route()
    def month_details(self, request):
        date = to_pydate(request.query_params.get('date'))
        kind = request.query_params.get('kind')
        qs = self.get_queryset().filter(kind=kind[:3])
        result = []
        for category in qs:
            value = category.get_transactions_amount(fr=first_day(date), to=last_day(date))
            if value:
                serializer = self.serializer_class(category)
                data = serializer.data
                data = {
                    'key': data['name'],
                    'y': value,
                    # 'color': random_color()
                }
                result.append(data)
        return Response({'result': result})


class AccountViewSet(ModelViewSet):
    serializer_class = AccountSerializer
    metadata_class = GridMetadata
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return Account.objects.filter(user=user)


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


class ConfViewSet(ViewSet):
    def get(self, request):
        user = request.user
        return Response({'username': user.username})
