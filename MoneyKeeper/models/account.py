# coding=utf-8
import logging

from django.contrib.auth.models import User
from django.db import models
from django.db.models import Sum

from MoneyKeeper.models.mixins import TransactionAmountMixin

__author__ = 'ilov3'
logger = logging.getLogger(__name__)


class Account(TransactionAmountMixin, models.Model):
    user = models.ForeignKey(User, related_name='accounts')
    name = models.CharField(max_length=150)
    is_shown = models.BooleanField(default=True)
    opening = models.DecimalField(max_digits=12, decimal_places=2)

    def __unicode__(self):
        return u'%s' % self.name

    def get_balance(self):
        income = self.transactions.get_income()
        expenses = self.transactions.get_expense()
        transfers_from = self.transactions.get_transfers()
        transfers_to = self.transfers.aggregate(Sum('amount'))['amount__sum'] or 0
        return self.opening + income + transfers_to - expenses - transfers_from
