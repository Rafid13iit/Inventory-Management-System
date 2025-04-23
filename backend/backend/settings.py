from pathlib import Path  # Path is used for handling filesystem paths in an OS-independent way.
from datetime import timedelta  # timedelta is used for time-based calculations, such as token expiration.
import os  # os is used to interact with the operating system, such as reading environment variables.
from dotenv import load_dotenv  # dotenv is used to load environment variables from a `.env` file.

# Load environment variables from a .env file. This is a best practice to keep sensitive data (like keys) out of the codebase.
load_dotenv()

# BASE_DIR is the root directory of the project. It helps in constructing paths relative to the project directory.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECRET_KEY is a critical setting for Django's security. It is used for cryptographic signing.
# Best practice: Keep this key secret and unique for each project. Use environment variables to store it securely.
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-3m=9#12@i=f*=m$!-w2x(f0*g%!)u7t8z5-g8xf+#8w5r7nxrb')

# DEBUG determines whether the application is in development or production mode.
# Best practice: Set DEBUG to False in production to avoid exposing sensitive information in error pages.
DEBUG = os.getenv('DEBUG', 'True') == 'True'

# ALLOWED_HOSTS specifies the domains/hosts that can serve the application.
# Best practice: In production, explicitly list allowed domains to prevent HTTP Host header attacks.
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '*').split(',')

# INSTALLED_APPS lists all the apps that are enabled in the project.
# Django apps can be:
# - Built-in apps (e.g., admin, auth)
# - Third-party apps (e.g., rest_framework)
# - Custom apps (e.g., api, users)
INSTALLED_APPS = [
    'django.contrib.admin',  # Admin interface for managing the application.
    'django.contrib.auth',  # Authentication framework for user management.
    'django.contrib.contenttypes',  # Framework for content types (polymorphic models).
    'django.contrib.sessions',  # Session framework for storing user session data.
    'django.contrib.messages',  # Messaging framework for one-time notifications.
    'django.contrib.staticfiles',  # Framework for serving static files (CSS, JS, images).

    # Third-party apps
    'rest_framework',  # Django REST Framework for building APIs.
    'rest_framework_simplejwt',  # JWT-based authentication for APIs.
    'corsheaders',  # Handles Cross-Origin Resource Sharing (CORS) for APIs.
    'djoser',  # Simplifies user authentication and management.
    'django_filters',  # Provides filtering capabilities for APIs.

    # Local apps (custom apps created for this project)
    'api.apps.ApiConfig',  # Custom app for API-related functionality.
    'users.apps.UsersConfig',  # Custom app for user-related functionality.
]

# MIDDLEWARE is a list of middleware classes that process requests and responses.
# Middleware is executed in the order listed here.
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',  # Provides security enhancements like HTTPS redirection.
    'django.contrib.sessions.middleware.SessionMiddleware',  # Manages user sessions.
    'corsheaders.middleware.CorsMiddleware',  # Handles CORS headers for cross-origin requests.
    'django.middleware.common.CommonMiddleware',  # Provides common HTTP functionalities.
    'django.middleware.csrf.CsrfViewMiddleware',  # Protects against Cross-Site Request Forgery attacks.
    'django.contrib.auth.middleware.AuthenticationMiddleware',  # Associates users with requests.
    'django.contrib.messages.middleware.MessageMiddleware',  # Enables messaging framework.
    'django.middleware.clickjacking.XFrameOptionsMiddleware',  # Protects against clickjacking attacks.
]

# ROOT_URLCONF specifies the Python module where the URL configuration is defined.
ROOT_URLCONF = 'backend.urls'

# TEMPLATES defines the settings for rendering HTML templates.
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',  # Specifies the template engine.
        'DIRS': [],  # List of directories where templates are stored.
        'APP_DIRS': True,  # Enables automatic template discovery in app directories.
        'OPTIONS': {
            'context_processors': [  # Context processors add variables to templates automatically.
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# WSGI_APPLICATION specifies the WSGI application callable for serving the project.
# WSGI is a standard interface between web servers and Python applications.
WSGI_APPLICATION = 'backend.wsgi.application'

# DATABASES defines the database configuration.
# Best practice: Use environment variables to store sensitive database credentials.
DATABASES = {
    'default': {
        'ENGINE': os.getenv('DB_ENGINE', 'django.db.backends.sqlite3'),  # Database engine (e.g., SQLite, PostgreSQL).
        'NAME': os.getenv('DB_NAME', os.path.join(BASE_DIR, 'db.sqlite3')),  # Database name or path.
        'USER': os.getenv('DB_USER', ''),  # Database username.
        'PASSWORD': os.getenv('DB_PASSWORD', ''),  # Database password.
        'HOST': os.getenv('DB_HOST', ''),  # Database host.
        'PORT': os.getenv('DB_PORT', ''),  # Database port.
    }
}

# AUTH_PASSWORD_VALIDATORS defines password validation rules for user authentication.
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',  # Prevents passwords similar to user attributes.
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',  # Enforces a minimum password length.
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',  # Prevents common passwords.
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',  # Prevents fully numeric passwords.
    },
]

# Internationalization settings for language and timezone.
LANGUAGE_CODE = 'en-us'  # Default language for the application.
TIME_ZONE = 'UTC'  # Default timezone for the application.
USE_I18N = True  # Enables internationalization (translation of text).
USE_TZ = True  # Enables timezone-aware datetimes.

# Static files settings for serving CSS, JavaScript, and images.
STATIC_URL = '/static/'  # URL prefix for static files.
STATIC_ROOT = os.path.join(BASE_DIR, 'static')  # Directory where static files are collected.

# Media files settings for user-uploaded content.
MEDIA_URL = '/media/'  # URL prefix for media files.
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')  # Directory where media files are stored.

# DEFAULT_AUTO_FIELD specifies the default type for primary keys in models.
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# AUTH_USER_MODEL allows using a custom user model instead of the default one.
AUTH_USER_MODEL = 'users.CustomUser'

# REST Framework settings for building APIs.
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',  # JWT-based authentication.
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',  # Default permission: only authenticated users can access.
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',  # Pagination for API responses.
    'PAGE_SIZE': 10,  # Number of items per page in paginated responses.
}

# SIMPLE_JWT settings for configuring JWT authentication.
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),  # Access token validity period.
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),  # Refresh token validity period.
    'ROTATE_REFRESH_TOKENS': False,  # Whether to issue a new refresh token on each use.
    'BLACKLIST_AFTER_ROTATION': True,  # Whether to blacklist old refresh tokens after rotation.
    'ALGORITHM': 'HS256',  # Algorithm used for signing tokens.
    'SIGNING_KEY': SECRET_KEY,  # Key used for signing tokens.
    'AUTH_HEADER_TYPES': ('Bearer',),  # Prefix for the Authorization header.
    'USER_ID_FIELD': 'id',  # Field used to identify the user in tokens.
    'USER_ID_CLAIM': 'user_id',  # Claim in the token payload for the user ID.
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),  # Token classes used.
    'TOKEN_TYPE_CLAIM': 'token_type',  # Claim in the token payload for the token type.
}

# CORS settings for handling cross-origin requests.
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', 'http://localhost:3000,http://127.0.0.1:3000').split(',')
CORS_ALLOW_CREDENTIALS = True  # Allows cookies to be included in cross-origin requests.

# STOCK_THRESHOLD is a custom setting for managing inventory levels.
STOCK_THRESHOLD = int(os.getenv('STOCK_THRESHOLD', 5))  # Default threshold for low stock alerts.