import arrow
from rest_framework.decorators import list_route
from rest_framework.metadata import SimpleMetadata
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from MoneyKeeper.models import Transaction, Category, Account
from MoneyKeeper.serializers import TransactionSerializer, CategorySerializer, AccountSerializer
from MoneyKeeper.utils.utils import to_pydate


class GridMetadata(SimpleMetadata):
    def determine_metadata(self, request, view):
        return view.serializer_class.get_grid_schema()


class TransactionViewSet(ModelViewSet):
    serializer_class = TransactionSerializer
    queryset = Transaction.objects.all()
    metadata_class = GridMetadata

    @list_route()
    def amount(self, request):
        begin = request.query_params.get('begin', None)
        end = request.query_params.get('end', None)
        kind = request.query_params.get('kind', None)
        income = Transaction.objects.get_amount(kind, to_pydate(begin), to_pydate(end))
        return Response({'result': income})

    @list_route()
    def stats(self, request):
        stats = self.queryset.get_amounts_by_month()
        return Response({'result': {
            'incomes': [stat['inc_sum'] or 0 for stat in stats],
            'expenses': [stat['exp_sum'] or 0 for stat in stats],
            'months': [arrow.get(stat['month']).format('MMMM') for stat in stats]
        }})


class CategoryViewSet(ModelViewSet):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()
    metadata_class = GridMetadata


class AccountViewSet(ModelViewSet):
    serializer_class = AccountSerializer
    queryset = Account.objects.all()
    metadata_class = GridMetadata
