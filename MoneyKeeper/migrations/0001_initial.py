# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import MoneyKeeper.models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Account',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(unique=True, max_length=150)),
                ('opening', models.DecimalField(max_digits=12, decimal_places=2)),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            bases=(MoneyKeeper.models.TransactionAmountMixin, models.Model),
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=150)),
                ('kind', models.CharField(max_length=100, choices=[(b'exp', b'Expense'), (b'inc', b'Income')])),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            bases=(MoneyKeeper.models.TransactionAmountMixin, models.Model),
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date', models.DateField()),
                ('amount', models.DecimalField(max_digits=12, decimal_places=2)),
                ('comment', models.TextField(blank=True)),
                ('kind', models.CharField(max_length=100, choices=[(b'exp', b'Expense'), (b'inc', b'Income'), (b'trn', b'Transfer')])),
                ('account', models.ForeignKey(related_name='transactions', to='MoneyKeeper.models.account.Account')),
                ('category', models.ForeignKey(related_name='transactions', blank=True, to='MoneyKeeper.models.category.Category', null=True)),
                ('transfer_to_account', models.ForeignKey(related_name='transfers', blank=True, to='MoneyKeeper.models.account.Account', null=True)),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-date', '-amount'],
            },
        ),
    ]
