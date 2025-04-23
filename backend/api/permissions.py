from rest_framework import permissions
# Importing the `permissions` module from Django REST Framework (DRF).
# DRF is an extension of Django that simplifies building RESTful APIs.
# Permissions in DRF are used to control access to views based on user roles, authentication, or custom logic.
# Related concept: Authentication
# - Authentication verifies the identity of a user (e.g., via tokens, sessions, or OAuth).
# - Permissions come into play after authentication to determine what the user is allowed to do.

class IsAdminUser(permissions.BasePermission):
    # This class defines a custom permission that allows access only to admin users.
    # Related concept: Custom Permissions
    # - DRF provides built-in permissions like `IsAuthenticated` and `IsAdminUser`.
    # - You can create custom permissions by subclassing `permissions.BasePermission`.

    def has_permission(self, request, view):
        # This method is called to check if the user has permission to access the view.
        # Parameters:
        # - `request`: The HTTP request object, which contains user information.
        # - `view`: The view being accessed.
        # Workflow:
        # 1. DRF calls this method before executing the view logic.
        # 2. If it returns `True`, the user is granted access; otherwise, access is denied.
        return bool(request.user and request.user.is_authenticated and request.user.is_admin)
        # Explanation:
        # - `request.user`: Represents the currently authenticated user.
        # - `request.user.is_authenticated`: Checks if the user is logged in.
        # - `request.user.is_admin`: A custom attribute that should be defined in your User model.
        #   - By default, Django's User model has `is_staff` and `is_superuser` attributes.
        #   - You might need to extend the User model to add `is_admin`.
        # Best Practice:
        # - Use Django's built-in `is_staff` or `is_superuser` attributes if possible.
        # - If you need custom roles, extend the User model using a custom User model or a profile model.

class IsAdminOrReadOnly(permissions.BasePermission):
    # This class defines a custom permission that allows:
    # - Read-only access (GET, HEAD, OPTIONS) for all authenticated users.
    # - Full access (POST, PUT, DELETE) only for admin users.
    # Related concept: SAFE_METHODS
    # - `permissions.SAFE_METHODS` is a tuple containing HTTP methods that are considered "safe" (read-only).
    # - These methods are: 'GET', 'HEAD', and 'OPTIONS'.

    def has_permission(self, request, view):
        # This method checks if the user has permission to access the view.
        if request.method in permissions.SAFE_METHODS:
            # If the request method is read-only (e.g., GET), allow access to any authenticated user.
            return bool(request.user and request.user.is_authenticated)
            # Explanation:
            # - This ensures that even non-admin users can view data but cannot modify it.
        return bool(request.user and request.user.is_authenticated and request.user.is_admin)
        # If the request method is not read-only (e.g., POST, PUT, DELETE), allow access only to admin users.
        # This logic is similar to the `IsAdminUser` class above.
        # Best Practice:
        # - Use `SAFE_METHODS` to differentiate between read-only and write operations.
        # - Clearly document which roles have access to which methods in your API documentation.

# Related Concept: Permissions Workflow in DRF
# 1. When a request is made to a view, DRF checks the `permission_classes` defined in the view.
# 2. Each permission class's `has_permission` method is called.
# 3. If all permission classes return `True`, the request is allowed; otherwise, it's denied.
# Example:
# ```python
# from rest_framework.views import APIView
# from .permissions import IsAdminOrReadOnly
#
# class ExampleView(APIView):
#     permission_classes = [IsAdminOrReadOnly]
#
#     def get(self, request):
#         return Response({"message": "This is a read-only view for non-admins."})
# ```

# Alternatives:
# - Use built-in permissions like `IsAuthenticated` or `IsAdminUser` if they meet your requirements.
# - Combine multiple permissions using `AND`, `OR`, or custom logic.
# Example:
# ```python
# from rest_framework.permissions import IsAuthenticated, IsAdminUser
# from rest_framework.views import APIView
#
# class CombinedPermissionView(APIView):
#     permission_classes = [IsAuthenticated & IsAdminUser]
# ```

# Best Practices:
# 1. Keep permissions simple and reusable.
# 2. Use descriptive names for custom permissions (e.g., `IsAdminOrReadOnly`).
# 3. Test permissions thoroughly to ensure they enforce the desired access control.
# 4. Document your permissions in your API documentation for clarity.