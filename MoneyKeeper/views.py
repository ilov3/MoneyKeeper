from rest_framework.decorators import list_route
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from MoneyKeeper.models import Transaction, Category, Account
from MoneyKeeper.serializers import TransactionSerializer, CategorySerializer, AccountSerializer
from MoneyKeeper.utils import to_pydate


class TransactionViewSet(ModelViewSet):
    serializer_class = TransactionSerializer
    queryset = Transaction.objects.all()

    @list_route()
    def amount(self, request):
        begin = request.query_params.get('begin', None)
        end = request.query_params.get('end', None)
        kind = request.query_params.get('kind', None)
        income = Transaction.objects.get_amount(kind, to_pydate(begin), to_pydate(end))
        return Response({'result': income})


class CategoryViewSet(ModelViewSet):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()


class AccountViewSet(ModelViewSet):
    serializer_class = AccountSerializer
    queryset = Account.objects.all()
