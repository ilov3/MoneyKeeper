# coding: utf-8
from django.conf.urls import url, include
from django.contrib.auth import views as auth_views
from django.views.generic import TemplateView
from django.views.generic.base import RedirectView

from MoneyKeeper.router import router
from MoneyKeeper.views.apiDocs import schema_view
from MoneyKeeper.views.userViewSet import ObtainJSONWebToken, PasswordResetView, password_reset_success, auth_token_redirect

urlpatterns = [
    url(r'^$', TemplateView.as_view(template_name='app.html')),
    url(r'^about$', TemplateView.as_view(template_name='landing.html')),
    url(r'^favicon\.ico$', RedirectView.as_view(url='/static/favicon.ico', permanent=True)),
    url(r'^password/reset/$', PasswordResetView.as_view(), name='password_reset'),
    url(r'^password/reset/confirm/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        auth_views.password_reset_confirm, {'post_reset_redirect': '/user/password/done/'}, name='password_reset_confirm'),
    url(r'^user/password/done/$', password_reset_success, name='password_reset_success'),
    url(r'^api/', include(router.urls)),
    url(r'^api/token-auth/', ObtainJSONWebToken.as_view(), name='obtain_jwt_token'),
    url(r'^auth/(?P<user_id>[0-9]*)/', auth_token_redirect, name='auth_token_redirect'),
    url(r'^accounts/login/$', auth_views.login, name='login'),
    url(r'^apidocs/', schema_view, name='apidocs'),
]
