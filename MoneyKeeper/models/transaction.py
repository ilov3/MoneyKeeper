# coding=utf-8
import logging
from django.contrib.auth.models import User
from django.db import models
from django.db.models import Sum
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

    def get_amounts_by_month(self, user_id):
        q = '''
SELECT
  t1.id,
  t1.month,
  t1.inc_sum AS income,
  t1.exp_sum AS expense,
  sum(t2.profit) AS balance
FROM
  (SELECT
     id,
     SUM(CASE WHEN `MoneyKeeper_transaction`.`kind` = 'inc'
       THEN `MoneyKeeper_transaction`.`amount`
         ELSE 0 END)                                            AS `inc_sum`,
     SUM(CASE WHEN `MoneyKeeper_transaction`.`kind` = 'exp'
       THEN `MoneyKeeper_transaction`.`amount`
         ELSE 0 END)                                            AS `exp_sum`,
     (CAST(DATE_FORMAT(date, '%%Y-%%m-01 00:00:00') AS DATETIME)) AS `month`
   FROM `MoneyKeeper_transaction`
   WHERE (`MoneyKeeper_transaction`.`user_id` = %s)
   GROUP BY (CAST(DATE_FORMAT(date, '%%Y-%%m-01 00:00:00') AS DATETIME))
   ORDER BY `month` ASC) t1
  JOIN (SELECT
          (CAST(DATE_FORMAT(date, '%%Y-%%m-01 00:00:00') AS DATETIME)) AS `month`,
          (SUM(CASE WHEN `MoneyKeeper_transaction`.`kind` = 'inc'
            THEN `MoneyKeeper_transaction`.`amount`
               ELSE 0 END) - SUM(CASE WHEN `MoneyKeeper_transaction`.`kind` = 'exp'
            THEN `MoneyKeeper_transaction`.`amount`
                                 ELSE 0 END))                        AS `profit`
        FROM `MoneyKeeper_transaction`
        WHERE (`MoneyKeeper_transaction`.`user_id` = %s)
        GROUP BY (CAST(DATE_FORMAT(date, '%%Y-%%m-01 00:00:00') AS DATETIME))
        ORDER BY `month` ASC) t2
    ON t1.month >= t2.month
GROUP BY t1.month
ORDER BY t1.month DESC
        '''
        q = self.raw(q, params=[user_id, user_id])
        return list(q)[::-1]


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
        if self.kind != 'inc':
            repr = u'%s %s > %s %s' % (self.date, self.account, self.category if self.category else self.transfer_to_account, self.amount)
        else:
            repr = u'%s %s < %s %s' % (self.date, self.account, self.category, self.amount)
        return repr

    class Meta:
        ordering = ['-date', '-amount']
