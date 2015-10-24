# coding=utf-8
import glob
import logging
import os
import arrow

__author__ = 'ilov3'
logger = logging.getLogger(__name__)

to_pydate = lambda jsts: arrow.get(jsts).replace(days=+1).datetime
first_day = lambda dt=arrow.now(): dt.floor('month').datetime
last_day = lambda dt=arrow.now(): dt.ceil('month').datetime


def setup_env(env_dir='envdir'):
    env_vars = glob.glob(os.path.join(env_dir, '*'))
    for env_var in env_vars:
        with open(env_var, 'r') as env_var_file:
            os.environ.setdefault(env_var.split(os.sep)[-1],
                                  env_var_file.read().strip())
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "moneykeeper.settings")
