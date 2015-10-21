# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('MoneyKeeper', '0004_auto_20151018_1315'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='transfer_to_account',
            field=models.ForeignKey(related_name='transfers', blank=True, to='MoneyKeeper.Account', null=True),
        ),
    ]
