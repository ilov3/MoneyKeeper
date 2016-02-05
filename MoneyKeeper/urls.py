from django.conf.urls import url, include
from django.views.generic import TemplateView
from django.views.generic.base import RedirectView
from rest_framework.routers import DefaultRouter

from MoneyKeeper.views.userViewSet import ObtainJSONWebToken
from views import TransactionViewSet, AccountViewSet, CategoryViewSet, UserViewSet, ConfViewSet

router = DefaultRouter()

router.register(r'transaction', viewset=TransactionViewSet, base_name='transaction')
router.register(r'category', viewset=CategoryViewSet, base_name='category')
router.register(r'account', viewset=AccountViewSet, base_name='account')
router.register(r'user', viewset=UserViewSet, base_name='user')

urlpatterns = [
    url(r'^about$', TemplateView.as_view(template_name='landing.html')),
    url(r'^$', TemplateView.as_view(template_name='app.html')),
    url(r'^favicon\.ico$', RedirectView.as_view(url='/static/favicon.ico')),
    url(r'^api/', include(router.urls)),
    url(r'^api/token-auth/', ObtainJSONWebToken.as_view()),
    url(r'^api/conf/', ConfViewSet.as_view({'get': 'get'}))
]
