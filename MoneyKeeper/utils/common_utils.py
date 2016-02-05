# coding=utf-8
import glob
import logging
import os
import arrow

__author__ = 'ilov3'
logger = logging.getLogger(__name__)


def to_pydate(js_timestamp):
    return arrow.get(js_timestamp).replace(days=+1).datetime.date()


def first_day(dt=None):
    if dt:
        return arrow.get(dt).floor('month').datetime.date()
    return arrow.now().floor('month').datetime.date()


def last_day(dt=None):
    if dt:
        return arrow.get(dt).ceil('month').datetime.date()
    return arrow.now().ceil('month').datetime.date()


def first_day_of_previous_month():
    return first_day(arrow.now().replace(months=-1))


def last_day_of_previous_month():
    return last_day(arrow.now().replace(months=-1))


def setup_env(env_dir='envdir'):
    """
    Sets up django app environment.
    If confused read this:
    http://bruno.im/2013/may/18/django-stop-writing-settings-files/
    :param env_dir: path to the folder containing necessary env vars.
    :type env_dir: str
    """
    env_vars = glob.glob(os.path.join(env_dir, '*'))
    if env_vars:
        for env_var in env_vars:
            with open(env_var, 'r') as env_var_file:
                os.environ.setdefault(env_var.split(os.sep)[-1],
                                      env_var_file.read().strip())
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "moneykeeper.settings")
