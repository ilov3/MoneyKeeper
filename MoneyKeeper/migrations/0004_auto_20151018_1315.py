# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('MoneyKeeper', '0003_auto_20151018_1307'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transaction',
            name='account',
            field=models.ForeignKey(related_name='transactions', to='MoneyKeeper.Account'),
        ),
        migrations.AlterField(
            model_name='transaction',
            name='category',
            field=models.ForeignKey(related_name='transactions', to='MoneyKeeper.Category'),
        ),
    ]
