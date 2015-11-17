"""
WSGI config for moneykeeper project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/howto/deployment/wsgi/
"""

import os
import sys
from django.core.wsgi import get_wsgi_application
from MoneyKeeper.utils.utils import setup_env

current_dir = os.path.dirname(os.path.abspath(__file__))
base_dir = os.path.dirname(os.path.dirname(current_dir))
sys.path.append(base_dir)
setup_env(os.path.join(base_dir, 'envdir'))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "moneykeeper.settings")
application = get_wsgi_application()
