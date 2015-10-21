from django.conf.urls import url, include
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter
from views import TransactionViewSet, AccountViewSet, CategoryViewSet

router = DefaultRouter()

router.register(r'transaction', viewset=TransactionViewSet)
router.register(r'category', viewset=CategoryViewSet)
router.register(r'account', viewset=AccountViewSet)

urlpatterns = [
    url(r'^$', TemplateView.as_view(template_name='app.html')),
    url(r'^api/', include(router.urls))
]
