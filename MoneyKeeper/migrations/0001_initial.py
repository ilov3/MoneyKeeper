# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Account',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=150)),
                ('opening', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=150)),
                ('kind', models.CharField(max_length=100, choices=[(b'exp', b'Expense'), (b'inc', b'Income')])),
            ],
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date', models.DateField()),
                ('amount', models.IntegerField()),
                ('comment', models.TextField()),
                ('kind', models.CharField(max_length=100, choices=[(b'exp', b'Expense'), (b'inc', b'Income'), (b'trn', b'Transfer')])),
                ('account', models.ForeignKey(to='MoneyKeeper.Account')),
                ('category', models.ForeignKey(to='MoneyKeeper.Category')),
            ],
        ),
    ]
