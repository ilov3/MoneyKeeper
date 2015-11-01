# coding=utf-8
import glob
import logging
import os
import arrow

__author__ = 'ilov3'
logger = logging.getLogger(__name__)

to_pydate = lambda jsts: arrow.get(jsts).replace(days=+1).datetime
first_day = lambda dt=None: dt.floor('month').datetime if dt else arrow.now().floor('month').datetime
first_day_of_previous_month = lambda: first_day(arrow.now().replace(months=-1))
last_day = lambda dt=None: dt.ceil('month').datetime if dt else arrow.now().ceil('month').datetime
last_day_of_previous_month = lambda: last_day(arrow.now().replace(months=-1))


def setup_env(env_dir='envdir'):
    """
    Sets up django app environment.
    env_dir - path to the folder containing necessary env vars.
    If confused read this:
    http://bruno.im/2013/may/18/django-stop-writing-settings-files/
    """
    env_vars = glob.glob(os.path.join(env_dir, '*'))
    for env_var in env_vars:
        with open(env_var, 'r') as env_var_file:
            os.environ.setdefault(env_var.split(os.sep)[-1],
                                  env_var_file.read().strip())
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "moneykeeper.settings")
