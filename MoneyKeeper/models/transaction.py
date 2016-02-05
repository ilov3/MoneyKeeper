# coding=utf-8
import logging

from django.contrib.auth.models import User
from django.db import models, connection
from django.db.models import Sum, Case, When, Value, F

from MoneyKeeper.utils.common_utils import first_day, last_day

__author__ = 'ilov3'
logger = logging.getLogger(__name__)
TRANSACTION_KINDS = (
    ('exp', 'Expense'),
    ('inc', 'Income'),
    ('trn', 'Transfer')
)


class TransactionQuerySet(models.QuerySet):
    def get_amount(self, kind, fr=None, to=None):
        fr = fr if fr else first_day()
        to = to if to else last_day()
        result = self.filter(kind=kind, date__gte=fr, date__lte=to)
        result = result.aggregate(Sum('amount'))
        return result['amount__sum'] or 0

    def get_income(self):
        return self.filter(kind='inc').aggregate(Sum('amount'))['amount__sum'] or 0

    def get_expense(self):
        return self.filter(kind='exp').aggregate(Sum('amount'))['amount__sum'] or 0

    def get_transfers(self):
        return self.filter(kind='trn').aggregate(Sum('amount'))['amount__sum'] or 0

    def get_amounts_by_month(self):
        truncate_date = connection.ops.date_trunc_sql('month', 'date')
        qs = self.extra({'month': truncate_date})
        return qs.values('month').distinct().order_by('month').annotate(
                inc_sum=Sum(Case(When(kind='inc', then='amount'), default=Value(0))),
                exp_sum=Sum(Case(When(kind='exp', then='amount'), default=Value(0))),
        ).annotate(profit=F('inc_sum') - F('exp_sum'))


class Transaction(models.Model):
    user = models.ForeignKey(User)
    date = models.DateField()
    category = models.ForeignKey('Category', null=True, blank=True, related_name='transactions')
    account = models.ForeignKey('Account', related_name='transactions')
    transfer_to_account = models.ForeignKey('Account', null=True, blank=True, related_name='transfers')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    comment = models.TextField(blank=True)
    kind = models.CharField(max_length=100, choices=TRANSACTION_KINDS)
    objects = TransactionQuerySet.as_manager()

    def __unicode__(self):
        return u'%s::%s::%s::%s' % (self.account, self.kind, self.category, self.amount)

    class Meta:
        ordering = ['-date', '-amount']
