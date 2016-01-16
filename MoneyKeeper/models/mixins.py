# coding=utf-8
import logging

__author__ = 'ilov3'
logger = logging.getLogger(__name__)


class TransactionAmountMixin(object):
    def get_transactions_amount(self, *args, **kwargs):
        return self.transactions.get_amount(*args, **kwargs)
