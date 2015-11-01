# coding=utf-8
import sys
import os
from utils import setup_env
from glob import glob
import json
import logging
import arrow

current_dir = os.path.dirname(os.path.abspath(__file__))
base_dir = os.path.dirname(os.path.dirname(current_dir))
sys.path.append(base_dir)
setup_env(os.path.join(base_dir, 'envdir'))

import django

django.setup()

from MoneyKeeper.models import Transaction, Category, Account

__author__ = 'ilov3'
logger = logging.getLogger(__name__)


def importer(path):
    """
    VIZI Budget android app backup importer
    path str should contain the path to file "permanent_data" and "dynamic" folder

    """
    permanent_data = open('%s/permanent_data' % path)
    dynamic_data = glob('%s/dynamic/*/*' % path)
    perm_data_json = json.loads(permanent_data.read())

    accounts = {acc['id']: {
        'name': acc['name'],
        'obj': Account.objects.get_or_create(name=acc['name'], opening=0)[0]
    } for acc in perm_data_json['accounts']}

    expenses = {exp['id']: {
        'name': exp['name'],
        'obj': Category.objects.get_or_create(name=exp['name'], kind='exp')[0]
    } for exp in perm_data_json['expenses']}

    incomes = {inc['id']: {
        'name': inc['name'],
        'obj': Category.objects.get_or_create(name=inc['name'], kind='inc')[0]
    } for inc in perm_data_json['incomes']}

    transactions = []
    for tran_file in dynamic_data:
        try:
            transactions += json.loads(open(tran_file).read())['operations']
        except KeyError:
            pass

    for t in transactions:
        if t['type'] == 'INCOME':
            Transaction.objects.get_or_create(date=arrow.get(t['dateTime'] / 1000.0).datetime,
                                              category=incomes[t['incomeId']]['obj'],
                                              account=accounts[t['accountId']]['obj'],
                                              amount=t['sum'],
                                              comment=t['comment'],
                                              kind='inc')
        elif t['type'] == 'EXPENSE':
            Transaction.objects.get_or_create(date=arrow.get(t['dateTime'] / 1000.0).datetime,
                                              category=expenses[t['expenseId']]['obj'],
                                              account=accounts[t['accountId']]['obj'],
                                              amount=t['sum'],
                                              comment=t['comment'],
                                              kind='exp')
        elif t['type'] == 'TRANSFER':
            Transaction.objects.get_or_create(date=arrow.get(t['dateTime'] / 1000.0).datetime,
                                              transfer_to_account=accounts[t['destAccountId']]['obj'],
                                              account=accounts[t['accountId']]['obj'],
                                              amount=t['destSum'],
                                              comment=t['comment'],
                                              kind='trn')


if __name__ == '__main__':
    if len(sys.argv) == 2:
        path = sys.argv[1]
        importer(path)
    else:
        print 'you must define the path!'
