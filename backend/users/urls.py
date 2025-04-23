# Importing the `path` function from `django.urls` to define URL patterns.
# URL patterns are used to map URLs to their corresponding views.
from django.urls import path

# Importing views from the Django REST Framework SimpleJWT package.
# These views handle JSON Web Token (JWT) authentication.
from rest_framework_simplejwt.views import (
    TokenObtainPairView,  # Used to obtain a new JWT token pair (access and refresh tokens).
    TokenRefreshView,     # Used to refresh an expired access token using a valid refresh token.
)

# Importing custom views from the current app's `views.py` file.
# These views handle user registration and fetching user details.
from .views import RegisterView, UserDetailView

# The `urlpatterns` list is a core concept in Django.
# It defines the mapping between URLs and their corresponding views.
# Each `path` function maps a specific URL pattern to a view.
urlpatterns = [
    # URL for user registration.
    # When a user accesses `/register/`, the `RegisterView` class-based view is called.
    path('register/', RegisterView.as_view(), name='register'),

    # URL for obtaining a JWT token pair (access and refresh tokens).
    # This is typically used during user login.
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),

    # URL for refreshing an expired access token.
    # This requires a valid refresh token to generate a new access token.
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # URL for fetching the details of the currently authenticated user.
    # This is typically used to retrieve user profile information.
    path('me/', UserDetailView.as_view(), name='user-detail'),
]

# --- Django Concepts and Related Explanations ---

# 1. **Class-Based Views (CBVs) and `as_view()`**:
#    - In Django, views can be written as either function-based views (FBVs) or class-based views (CBVs).
#    - CBVs provide a more structured and reusable way to define views.
#    - The `as_view()` method is used to convert a CBV into a callable view function that Django can use.
#    - When you call `RegisterView.as_view()`, Django creates an instance of the `RegisterView` class and calls its `dispatch()` method to handle the HTTP request.

# 2. **Django REST Framework (DRF)**:
#    - DRF is an extension of Django that simplifies building RESTful APIs.
#    - It provides tools like serializers, viewsets, and authentication mechanisms (e.g., JWT).
#    - In this file, DRF's SimpleJWT views (`TokenObtainPairView` and `TokenRefreshView`) are used for token-based authentication.

# 3. **JWT Authentication**:
#    - JWT is a stateless authentication mechanism where the server issues a token to the client after successful login.
#    - The client includes this token in the `Authorization` header of subsequent requests.
#    - The server validates the token to authenticate the user.
#    - SimpleJWT is a popular library in DRF for implementing JWT authentication.

# 4. **URL Patterns**:
#    - Each `path()` function maps a URL pattern to a view.
#    - The `name` parameter is used to give a unique name to the URL pattern, which can be used in templates or reverse lookups.
#    - Example: `reverse('register')` will return the URL `/register/`.

# 5. **Best Practices**:
#    - Use meaningful names for your URL patterns to make them easy to understand.
#    - Group related URLs into namespaces if your project has multiple apps.
#    - Use DRF's built-in views (like `TokenObtainPairView`) whenever possible to avoid reinventing the wheel.

# 6. **Alternatives**:
#    - Instead of using `path()`, you can use `re_path()` for more complex regular expression-based URL patterns.
#    - For larger projects, consider using `routers` provided by DRF to automatically generate URL patterns for viewsets.

# 7. **Workflow**:
#    - When a user accesses a URL (e.g., `/register/`), Django matches the URL pattern in `urlpatterns`.
#    - It calls the corresponding view (e.g., `RegisterView.as_view()`).
#    - The view processes the request and returns an HTTP response (e.g., JSON data or an HTML page).

# --- Summary ---
# This `urls.py` file defines the entry points for user-related operations in your API:
# - User registration (`/register/`).
# - Token-based authentication (`/token/` and `/token/refresh/`).
# - Fetching user details (`/me/`).
# Understanding these concepts will help you build and extend your Django project effectively.