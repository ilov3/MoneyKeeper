# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-02-21 18:18
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MoneyKeeper', '0006_auto_20160206_1724'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='is_shown',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='category',
            name='is_shown',
            field=models.BooleanField(default=True),
        ),
    ]
