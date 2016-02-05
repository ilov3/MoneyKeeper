from django.contrib import admin
from models import Transaction, Account, Category
from models.profile import UserProfile


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'account', 'kind', 'category', 'transfer_to_account', 'amount')


@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'opening', 'get_balance')


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'kind', 'get_transactions_amount')


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'key_expires')
