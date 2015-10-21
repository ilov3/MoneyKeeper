# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('MoneyKeeper', '0005_transaction_transfer_to_account'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transaction',
            name='category',
            field=models.ForeignKey(related_name='transactions', blank=True, to='MoneyKeeper.Category', null=True),
        ),
    ]
