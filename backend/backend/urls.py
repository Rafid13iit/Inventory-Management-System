from django.contrib import admin  # Importing the admin module to enable the Django admin interface.
# The Django admin interface is a built-in feature that allows you to manage your application's data through a web-based UI.
# It is automatically generated based on your models and is highly customizable.

from django.urls import path, include  # Importing path and include to define URL patterns.
# `path` is used to define individual URL routes.
# `include` allows you to include other URL configurations, which is useful for modularizing your app's URLs.

from django.conf import settings  # Importing settings to access project-wide configurations.
# The `settings` module contains all the configuration for your Django project, such as DEBUG mode, database settings, and media/static file configurations.

from django.conf.urls.static import static  # Importing static to serve media files during development.
# `static` is used to serve media files (like images, videos, etc.) when `DEBUG` is set to `True`.
# In production, media files should be served by a dedicated web server like Nginx or Apache.

# Define the URL patterns for the project
urlpatterns = [
    path('admin/', admin.site.urls),  # Route for the Django admin interface.
    # When you visit `/admin/` in your browser, Django will load the admin interface.
    # Best practice: Restrict access to the admin interface by using strong passwords and enabling HTTPS.

    path('api/', include('api.urls')),  # Include the URL patterns from the `api` app.
    # The `include` function allows you to reference another URL configuration file (e.g., `api/urls.py`).
    # This helps in organizing your project by keeping app-specific URLs in their respective files.

    path('api/users/', include('users.urls')),  # Include the URL patterns from the `users` app.
    # This route prefixes all URLs in `users/urls.py` with `api/users/`.
    # Best practice: Use meaningful prefixes for your API endpoints to make them self-explanatory.

]

# Serve media files in development
if settings.DEBUG:  # Check if the project is in development mode.
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    # `settings.MEDIA_URL` is the base URL for accessing media files (e.g., `/media/`).
    # `settings.MEDIA_ROOT` is the directory where media files are stored on the server.
    # This configuration is only for development purposes. In production, use a web server like Nginx to serve media files.

# Workflow Explanation:
# 1. When a user visits a URL, Django checks the `urlpatterns` list to find a matching route.
# 2. If a match is found, Django calls the corresponding view function or includes another URL configuration.
# 3. The view function processes the request and returns a response (e.g., an HTML page or JSON data).

# Related Concepts:
# - Views: Functions or classes that handle HTTP requests and return HTTP responses.
# - Models: Define the structure of your database tables.
# - Templates: Define the HTML structure of your web pages.
# - Middleware: Hooks that process requests/responses globally before they reach views or after they leave views.

# Best Practices:
# - Use modular URL configurations to keep your code organized.
# - Avoid hardcoding URLs in your templates or views; use the `reverse` function or `{% url %}` template tag instead.
# - Secure your admin interface by restricting access and using strong authentication methods.
# - Use versioning for your API endpoints (e.g., `api/v1/`) to make it easier to manage changes over time.