# coding=utf-8
import logging

from django.contrib.auth.models import User
from django.db import models
from django.db.models import Sum, Case, When, Value

from MoneyKeeper.models.mixins import TransactionAmountMixin
from MoneyKeeper.models.transaction import TRANSACTION_KINDS
from MoneyKeeper.utils.utils import first_day_of_previous_month, last_day_of_previous_month

__author__ = 'ilov3'
logger = logging.getLogger(__name__)
CATEGORY_KINDS = TRANSACTION_KINDS[:-1]


class CategoryQuerySet(models.QuerySet):
    def annotate_with_amount(self, fr, to):
        return self.annotate(transactions_amount=Sum(Case(When(transactions__date__gte=fr, transactions__date__lte=to, then='transactions__amount'), default=Value(0))))


class Category(TransactionAmountMixin, models.Model):
    user = models.ForeignKey(User)
    name = models.CharField(max_length=150)
    kind = models.CharField(max_length=100, choices=CATEGORY_KINDS)
    objects = CategoryQuerySet.as_manager()

    def __unicode__(self):
        return u'%s' % self.name

    def get_transactions_amount(self, *args, **kwargs):
        return super(Category, self).get_transactions_amount(kind=self.kind, *args, **kwargs)

    def get_transactions_amount_last_month(self):
        return super(Category, self).get_transactions_amount(kind=self.kind, fr=first_day_of_previous_month(), to=last_day_of_previous_month())