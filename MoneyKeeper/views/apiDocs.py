# coding=utf-8
import logging

from rest_framework.decorators import api_view, renderer_classes, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework import response, schemas
from rest_framework_swagger.renderers import OpenAPIRenderer, SwaggerUIRenderer

from MoneyKeeper.router import router

__author__ = 'ilov3'
logger = logging.getLogger(__name__)


@api_view()
@renderer_classes([OpenAPIRenderer, SwaggerUIRenderer])
@permission_classes((IsAdminUser,))
def schema_view(request):
    generator = schemas.SchemaGenerator(title='MoneyKeeper API', url='/api', patterns=router.urls)
    return response.Response(generator.get_schema(request=request))
