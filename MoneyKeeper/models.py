from glob import glob
import json
import array

from django.db import models
from django.db.models import Sum

from MoneyKeeper.utils.utils import first_day, last_day, first_day_of_previous_month, last_day_of_previous_month

TRANSACTION_KINDS = (
    ('exp', 'Expense'),
    ('inc', 'Income'),
    ('trn', 'Transfer')
)

CATEGORY_KINDS = TRANSACTION_KINDS[:-1]


class TransactionManager(models.Manager):
    def get_amount(self, kind, fr=first_day(), to=last_day()):
        result = self.filter(kind=kind, date__gte=fr, date__lte=to)
        result = result.aggregate(Sum('amount'))
        return result['amount__sum'] or 0

    def get_income(self):
        return self.filter(kind='inc').aggregate(Sum('amount'))['amount__sum'] or 0

    def get_expense(self):
        return self.filter(kind='exp').aggregate(Sum('amount'))['amount__sum'] or 0

    def get_transfers(self):
        return self.filter(kind='trn').aggregate(Sum('amount'))['amount__sum'] or 0


class TransactionAmountMixin(object):
    def get_transactions_amount(self, *args, **kwargs):
        return self.transactions.get_amount(*args, **kwargs)


class Category(TransactionAmountMixin, models.Model):
    name = models.CharField(max_length=150)
    kind = models.CharField(max_length=100, choices=CATEGORY_KINDS)

    def __unicode__(self):
        return u'%s' % self.name

    def get_transactions_amount(self, *args, **kwargs):
        return super(Category, self).get_transactions_amount(kind=self.kind, *args, **kwargs)

    def get_transactions_amount_last_month(self):
        return super(Category, self).get_transactions_amount(kind=self.kind, fr=first_day_of_previous_month(), to=last_day_of_previous_month())


class Account(TransactionAmountMixin, models.Model):
    name = models.CharField(max_length=150, unique=True)
    opening = models.DecimalField(max_digits=12, decimal_places=2)

    def __unicode__(self):
        return u'%s' % self.name

    def get_balance(self):
        income = self.transactions.get_income()
        expenses = self.transactions.get_expense()
        transfers_from = self.transactions.get_transfers()
        transfers_to = self.transfers.aggregate(Sum('amount'))['amount__sum'] or 0
        return self.opening + income + transfers_to - expenses - transfers_from


class Transaction(models.Model):
    date = models.DateField()
    category = models.ForeignKey('Category', null=True, blank=True, related_name='transactions')
    account = models.ForeignKey('Account', related_name='transactions')
    transfer_to_account = models.ForeignKey('Account', null=True, blank=True, related_name='transfers')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    comment = models.TextField(blank=True)
    kind = models.CharField(max_length=100, choices=TRANSACTION_KINDS)
    objects = TransactionManager()

    def __unicode__(self):
        return u'%s::%s::%s::%d' % (self.account, self.kind, self.category, self.amount)
