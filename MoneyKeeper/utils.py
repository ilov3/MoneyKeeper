# coding=utf-8
import logging
import arrow

__author__ = 'ilov3'
logger = logging.getLogger(__name__)

to_pydate = lambda jsts: arrow.get(jsts).replace(days=+1).datetime
first_day = lambda dt=arrow.now(): dt.floor('month').datetime
last_day = lambda dt=arrow.now(): dt.ceil('month').datetime
