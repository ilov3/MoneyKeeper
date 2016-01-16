# coding=utf-8
import logging

from rest_framework.metadata import SimpleMetadata

__author__ = 'ilov3'
logger = logging.getLogger(__name__)


class GridMetadata(SimpleMetadata):
    def determine_metadata(self, request, view):
        return view.serializer_class.get_grid_schema()
