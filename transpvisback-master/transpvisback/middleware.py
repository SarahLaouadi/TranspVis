import os
import logging
from django.db import connections
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

class DatabaseMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Reset default database settings
        connections['default'].settings_dict.update({
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.getenv("DB_NAME", "postgres"),
            "USER": os.getenv("DB_USER", "postgres"),
            "PASSWORD": os.getenv("DB_PASSWORD", "None"),
            "HOST": os.getenv("DB_HOST", "db-transpvisback"),
            "PORT": os.getenv("DB_PORT", "5432"),
        })

        path = request.path
        logger = logging.getLogger(__name__)
        logger.debug(f"Request path: {path}")

        if path.startswith('/api/v2'):
            connections['default'].settings_dict.update({
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
            })
            logger.debug("Using SQLite database for /api/v2.")
        else:
            logger.debug("Using PostgreSQL database for other URLs.")

        response = self.get_response(request)
        return response
