"""
Django settings for Hadi88 Apps project.
"Find and ask for your dreaming apps"
"We are building app on your demand"
"""

from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'django-hadi88-apps-secure-production-key-2026')
DEBUG = os.environ.get('DJANGO_DEBUG', 'True') == 'True'

# Cloudflare Tunnels aur kisi bhi domain ko allow karne ke liye
ALLOWED_HOSTS = [
    '*',
    'api.uqn88.store',
    'app.uqn88.store',
]

# Cloudflare Tunnel URLs, Custom Domains aur Localhost ke liye CSRF trusted origins
CSRF_TRUSTED_ORIGINS = [
    'https://*.trycloudflare.com',
    'https://*.uqn88.store',
    'https://api.uqn88.store',
    'https://app.uqn88.store',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    'http://localhost:3000',
]


INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Hadi88 Apps Core Store application
    'store.apps.StoreConfig',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    # WhiteNoise Middleware static CSS/JS/Images serve karne ke liye (SecurityMiddleware ke foran baad):
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'appstore_project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            BASE_DIR / 'templates',
            BASE_DIR / 'dist', # React build output directory (agar build serve karna ho)
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.media',
            ],
        },
    },
]

WSGI_APPLICATION = 'appstore_project.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'

# Agar static directory exist nahi karti to Django error na de iske liye checking:
STATICFILES_DIRS = [
    path for path in [BASE_DIR / 'static', BASE_DIR / 'dist'] if path.exists()
]

STATIC_ROOT = BASE_DIR / 'staticfiles'

# WhiteNoise storage handler for static file caching & compression
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media files (Uploaded APKs, Icons, Banners)
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Store pagination requirement: Exactly 18 apps per page
APPS_PER_PAGE = 18
DATA_UPLOAD_MAX_MEMORY_SIZE = 150 * 1024 * 1024  # 150 MB
FILE_UPLOAD_MAX_MEMORY_SIZE = 150 * 1024 * 1024
