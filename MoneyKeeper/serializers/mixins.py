# coding=utf-8
import logging

__author__ = 'ilov3'
logger = logging.getLogger(__name__)


class GridSchemaMixin(object):
    @classmethod
    def get_grid_schema(cls):
        return cls.Meta.grid_schema
