# Importing necessary modules from Django Rest Framework (DRF) and Django
from rest_framework import generics, permissions  # DRF provides generic views and permission classes for API development
from rest_framework.response import Response  # Used to return HTTP responses in API views
from rest_framework.views import APIView  # Base class for creating custom API views
from django.contrib.auth import get_user_model  # Utility function to get the user model defined in the project
from .serializers import UserSerializer, UserCreateSerializer  # Importing serializers for data validation and transformation

# `get_user_model` is used to fetch the user model defined in the project. 
# By default, Django uses `User` from `django.contrib.auth.models`, but this allows flexibility if a custom user model is defined.
User = get_user_model()

# Class-based views are used here for better organization and reusability of code.
# DRF provides generic views like `CreateAPIView` to simplify common patterns.

class RegisterView(generics.CreateAPIView):
    """
    This view handles user registration.
    It uses DRF's `CreateAPIView`, which is a generic view for creating objects.
    """
    queryset = User.objects.all()  # Defines the queryset for the view. It fetches all user objects from the database.
    permission_classes = [permissions.AllowAny]  # Allows any user (authenticated or not) to access this view.
    serializer_class = UserCreateSerializer  # Specifies the serializer to validate and transform input data.

    # Explanation of serializers:
    # Serializers in DRF are used to convert complex data types (like Django models) into JSON (or other formats) 
    # and vice versa. They also handle validation of input data.
    # `UserCreateSerializer` is likely a custom serializer that defines how user registration data is validated and saved.

    # Alternatives:
    # - You could use a function-based view (FBV) instead of a class-based view (CBV), but CBVs are more modular and reusable.
    # - You could also use `APIView` and manually handle POST requests for more control.

class UserDetailView(APIView):
    """
    This view handles fetching details of the currently authenticated user.
    It uses DRF's `APIView` for more control over the logic.
    """
    permission_classes = [permissions.IsAuthenticated]  # Ensures only authenticated users can access this view.

    def get(self, request):
        """
        Handles GET requests to fetch user details.
        """
        serializer = UserSerializer(request.user)  # Serializes the authenticated user's data.
        return Response(serializer.data)  # Returns the serialized data as a JSON response.

    # Explanation of permissions:
    # Permissions in DRF control access to views. `IsAuthenticated` ensures that only logged-in users can access this view.
    # Other permissions include `IsAdminUser`, `IsAuthenticatedOrReadOnly`, or custom permissions.

    # Explanation of `APIView`:
    # `APIView` is a base class for creating custom views. It provides methods like `get`, `post`, `put`, etc., 
    # which can be overridden to handle specific HTTP methods.

    # Alternatives:
    # - You could use `RetrieveAPIView` (a generic view) if you want to simplify this logic.
    # - You could also use `ViewSet` for more complex APIs with multiple actions (e.g., list, retrieve, create).

# Best Practices:
# 1. Use serializers to validate and transform data. Avoid directly handling raw data in views.
# 2. Use permission classes to secure your APIs.
# 3. Use generic views when possible to reduce boilerplate code.
# 4. Follow RESTful principles: separate concerns (e.g., use different endpoints for different resources/actions).
# 5. Write tests for your views to ensure they work as expected.
# 6. Use Django's built-in authentication system for user management, and customize it as needed.