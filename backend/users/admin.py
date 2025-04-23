# Importing the admin module from Django, which provides tools to manage models via the Django admin interface.
from django.contrib import admin

# Importing the UserAdmin class, which is a pre-built admin interface for managing user models.
from django.contrib.auth.admin import UserAdmin

# Importing the CustomUser model from the current app's models.py file.
# This is the custom user model that you have defined in your project.
from .models import CustomUser

# The @admin.register decorator is a shortcut to register a model with the admin site.
# It automatically registers the CustomUser model with the CustomUserAdmin class.
@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    """
    CustomUserAdmin is a subclass of UserAdmin, which provides a pre-built admin interface
    for managing user models. By subclassing UserAdmin, we can customize the admin interface
    for our CustomUser model.
    """

    # list_display defines the fields that will be displayed in the list view of the admin interface.
    # This allows admins to quickly see key information about each user.
    list_display = ('username', 'email', 'role', 'is_staff')

    # list_filter adds filters to the right-hand side of the admin list view.
    # This makes it easier to filter users based on specific fields like role, is_staff, and is_active.
    list_filter = ('role', 'is_staff', 'is_active')

    # fieldsets define the layout of fields on the detail/edit page of the admin interface.
    # Each tuple represents a section, with a title and a dictionary of options.
    fieldsets = (
        # The first section (None) contains basic user information.
        (None, {'fields': ('username', 'email', 'password')}),

        # The 'Permissions' section contains fields related to user permissions.
        ('Permissions', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),

        # The 'Important dates' section contains fields for tracking user activity.
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    # add_fieldsets is used when creating a new user via the admin interface.
    # It defines the layout of fields on the "Add User" page.
    add_fieldsets = (
        (None, {
            'classes': ('wide',),  # Adds extra CSS classes for styling.
            'fields': ('username', 'email', 'password1', 'password2', 'role'),  # Fields to be filled when adding a user.
        }),
    )

    # search_fields defines the fields that can be searched in the admin interface.
    # This allows admins to quickly find users by username or email.
    search_fields = ('username', 'email')

    # ordering defines the default ordering of users in the admin list view.
    # Here, users are ordered alphabetically by their username.
    ordering = ('username',)

# --- Django Concepts and Related Explanations ---

# 1. Django Admin:
#    - The Django admin is a built-in interface for managing your application's data.
#    - It allows you to perform CRUD (Create, Read, Update, Delete) operations on your models.
#    - By default, the admin interface is accessible at /admin after running `python manage.py createsuperuser`.

# 2. Custom User Model:
#    - In Django, the default user model is provided by `django.contrib.auth.models.User`.
#    - However, for flexibility, you can define a custom user model by subclassing `AbstractUser` or `AbstractBaseUser`.
#    - This is useful when you need additional fields (e.g., `role`) or want to modify the default behavior.

# 3. UserAdmin:
#    - `UserAdmin` is a pre-built admin class for managing user models.
#    - It provides a lot of functionality out of the box, such as password hashing, permissions management, and user creation.
#    - By subclassing `UserAdmin`, you can customize the admin interface for your custom user model.

# 4. Decorators (@admin.register):
#    - The `@admin.register` decorator is a shortcut for registering a model with the admin site.
#    - Alternatively, you can use `admin.site.register(CustomUser, CustomUserAdmin)`.

# 5. Fieldsets:
#    - Fieldsets allow you to group fields into sections on the admin detail/edit page.
#    - This improves the organization and usability of the admin interface.

# 6. Best Practices:
#    - Always customize the admin interface to make it user-friendly for admins.
#    - Use `list_display` and `list_filter` to provide quick access to important information.
#    - Use `search_fields` to make it easy to find specific records.
#    - Keep the admin interface secure by limiting access to sensitive fields and actions.

# 7. Alternatives:
#    - If the Django admin doesn't meet your needs, you can build a custom admin interface using Django views and templates.
#    - For more advanced use cases, consider using third-party packages like `django-grappelli` or `django-suit` to enhance the admin interface.

# Workflow:
# - Define your models in `models.py`.
# - Register your models with the admin site by creating an admin class (e.g., `CustomUserAdmin`).
# - Customize the admin interface using options like `list_display`, `fieldsets`, and `search_fields`.
# - Access the admin interface at /admin and manage your data.

# With this explanation, you should have a solid understanding of how the Django admin works and how to customize it for your project.