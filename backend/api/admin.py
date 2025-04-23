# Importing the admin module from Django's contrib package. 
# The `admin` module is used to configure the Django admin interface, 
# which is an automatically generated backend interface for managing models.
from django.contrib import admin

# Importing the models that we want to register with the admin interface.
# These models are defined in the `models.py` file of the same app.
from .models import Category, Product, Sale

# Registering the `Category` model with the admin interface using the `@admin.register` decorator.
# This decorator is a shortcut for registering a model with a custom `ModelAdmin` class.
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Category model.
    This class customizes how the Category model appears and behaves in the admin interface.
    """

    # `list_display` defines the fields of the model that will be displayed in the list view of the admin interface.
    # Best practice: Include fields that provide a quick overview of the model's data.
    list_display = ('name', 'description', 'created_at', 'updated_at')

    # `search_fields` allows the admin interface to provide a search bar for the specified fields.
    # Best practice: Use fields that are commonly searched by admin users.
    search_fields = ('name', 'description')

    # `list_filter` adds filters in the admin interface for the specified fields.
    # This is useful for quickly narrowing down the list of records.
    list_filter = ('created_at',)

# Registering the `Product` model with the admin interface.
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Product model.
    """

    # `list_display` shows the specified fields in the list view.
    # Here, `is_low_stock` is likely a computed field (e.g., a property in the model).
    list_display = ('name', 'category', 'price', 'quantity', 'is_low_stock', 'created_at')

    # `list_filter` adds filtering options for the `category` and `created_at` fields.
    list_filter = ('category', 'created_at')

    # `search_fields` enables search functionality for the specified fields.
    # The double underscore (`__`) syntax allows searching related fields (e.g., `category__name`).
    search_fields = ('name', 'description', 'category__name')

    # `readonly_fields` makes the specified fields read-only in the admin interface.
    # Best practice: Use this for fields that are computed or should not be edited manually.
    readonly_fields = ('is_low_stock',)

# Registering the `Sale` model with the admin interface.
@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Sale model.
    """

    # `list_display` specifies the fields to display in the list view.
    # `total_price` is likely a computed field (e.g., a method or property in the model).
    list_display = ('product', 'quantity', 'unit_price', 'total_price', 'sale_date', 'created_by')

    # `list_filter` adds filtering options for the `sale_date`, `product`, and `created_by` fields.
    list_filter = ('sale_date', 'product', 'created_by')

    # `search_fields` enables search functionality for the specified fields.
    # The double underscore (`__`) syntax allows searching related fields (e.g., `product__name`).
    search_fields = ('product__name', 'created_by__username')

    # `readonly_fields` makes the `total_price` field read-only in the admin interface.
    readonly_fields = ('total_price',)

# --- Django Concepts Explained ---
# 1. Django Admin:
#    - The Django admin interface is a powerful tool for managing your application's data.
#    - It is automatically generated based on your models and can be customized using `ModelAdmin` classes.
#    - Alternatives: If you need a custom admin interface, you can build your own views using Django's generic views.

# 2. ModelAdmin:
#    - A `ModelAdmin` class is used to customize the admin interface for a specific model.
#    - Common customizations include `list_display`, `search_fields`, `list_filter`, and `readonly_fields`.
#    - Best practice: Keep the admin interface simple and intuitive for non-technical users.

# 3. Decorators:
#    - The `@admin.register` decorator is a shortcut for registering a model with a custom `ModelAdmin` class.
#    - Alternative: You can use `admin.site.register(Model, ModelAdmin)` instead of the decorator.

# 4. Related Fields:
#    - The double underscore (`__`) syntax is used to access related fields in Django.
#    - For example, `category__name` accesses the `name` field of the related `Category` model.

# 5. Read-Only Fields:
#    - Fields marked as `readonly_fields` cannot be edited in the admin interface.
#    - Use this for fields that are computed or should not be modified manually.

# 6. Best Practices:
#    - Keep the admin interface user-friendly and avoid exposing sensitive data.
#    - Use `list_filter` and `search_fields` to make it easier to find records.
#    - Test the admin interface to ensure it meets the needs of your users.