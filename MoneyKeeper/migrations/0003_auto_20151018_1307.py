# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('MoneyKeeper', '0002_auto_20151018_0941'),
    ]

    operations = [
        migrations.AlterField(
            model_name='account',
            name='opening',
            field=models.DecimalField(max_digits=12, decimal_places=2),
        ),
        migrations.AlterField(
            model_name='transaction',
            name='amount',
            field=models.DecimalField(max_digits=12, decimal_places=2),
        ),
    ]
