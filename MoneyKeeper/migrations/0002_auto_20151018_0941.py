# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('MoneyKeeper', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transaction',
            name='comment',
            field=models.TextField(blank=True),
        ),
    ]
