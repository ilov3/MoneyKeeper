# coding=utf-8
import logging

from rest_framework.routers import DefaultRouter
from views import TransactionViewSet, AccountViewSet, CategoryViewSet, UserViewSet, ConfViewSet, LogEntryViewSet

__author__ = 'ilov3'
logger = logging.getLogger(__name__)

router = DefaultRouter()

router.register(r'transaction', viewset=TransactionViewSet, base_name='transaction')
router.register(r'category', viewset=CategoryViewSet, base_name='category')
router.register(r'account', viewset=AccountViewSet, base_name='account')
router.register(r'user', viewset=UserViewSet, base_name='user')
router.register(r'history', viewset=LogEntryViewSet, base_name='history')
router.register(r'conf', viewset=ConfViewSet, base_name='conf')
