#!/usr/bin/env python
import sys
from MoneyKeeper.utils.common_utils import setup_env

if __name__ == "__main__":
    setup_env()
    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)
