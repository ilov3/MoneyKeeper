import arrow
from rest_framework.decorators import list_route
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from MoneyKeeper.models import Transaction, Category, Account
from MoneyKeeper.serializers import TransactionSerializer, CategorySerializer, AccountSerializer

to_pydate = lambda jsts: arrow.get(jsts).replace(days=+1).datetime


class TransactionViewSet(ModelViewSet):
    serializer_class = TransactionSerializer
    queryset = Transaction.objects.all()

    @list_route()
    def income(self, request):
        begin = request.query_params.get('begin', None)
        end = request.query_params.get('end', None)
        if begin and end:
            income = Transaction.objects.get_amount('inc', to_pydate(begin), to_pydate(end))
        else:
            income = Transaction.objects.get_income()
        return Response({'result': income})

    @list_route()
    def expense(self, request):
        begin = request.query_params.get('begin', None)
        end = request.query_params.get('end', None)
        if begin and end:
            expense = Transaction.objects.get_amount('exp', to_pydate(begin), to_pydate(end))
        else:
            expense = Transaction.objects.get_expense()
        return Response({'result': expense})


class CategoryViewSet(ModelViewSet):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()


class AccountViewSet(ModelViewSet):
    serializer_class = AccountSerializer
    queryset = Account.objects.all()
