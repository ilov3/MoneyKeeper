from django.conf.urls import url, include
from django.contrib.auth import views
from django.views.generic import TemplateView
from django.views.generic.base import RedirectView
from rest_framework.routers import DefaultRouter

from MoneyKeeper.views.userViewSet import ObtainJSONWebToken, PasswordResetView, password_reset_success
from views import TransactionViewSet, AccountViewSet, CategoryViewSet, UserViewSet, ConfViewSet, LogEntryViewSet

router = DefaultRouter()

router.register(r'transaction', viewset=TransactionViewSet, base_name='transaction')
router.register(r'category', viewset=CategoryViewSet, base_name='category')
router.register(r'account', viewset=AccountViewSet, base_name='account')
router.register(r'user', viewset=UserViewSet, base_name='user')
router.register(r'history', viewset=LogEntryViewSet, base_name='history')

urlpatterns = [
    url(r'^$', TemplateView.as_view(template_name='app.html')),
    url(r'^about$', TemplateView.as_view(template_name='landing.html')),
    url(r'^favicon\.ico$', RedirectView.as_view(url='/static/favicon.ico', permanent=True)),
    url(r'^password/reset/$', PasswordResetView.as_view(), name='password_reset'),
    url(r'^password/reset/confirm/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        views.password_reset_confirm, {'post_reset_redirect': '/user/password/done/'}, name='password_reset_confirm'),
    url(r'^user/password/done/$', password_reset_success, name='password_reset_success'),
    url(r'^api/', include(router.urls)),
    url(r'^api/token-auth/', ObtainJSONWebToken.as_view(), name='obtain_jwt_token'),
    url(r'^api/conf/', ConfViewSet.as_view({'get': 'get'}), name='conf'),
]
