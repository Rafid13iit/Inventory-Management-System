from rest_framework import viewsets, filters, status
# `rest_framework` is part of Django REST Framework (DRF), a toolkit for building Web APIs.
# `viewsets` provides a way to group related views together, reducing boilerplate code.
# `filters` includes tools for filtering querysets (e.g., search and ordering).
# `status` contains HTTP status codes for use in API responses.

from rest_framework.response import Response
# `Response` is used to return data in a format (e.g., JSON) that the client can understand.
# It is similar to Django's `HttpResponse` but tailored for APIs.

from rest_framework.decorators import action
# `@action` is a decorator that allows you to add custom endpoints to a `ViewSet`.
# It can define additional routes for specific actions (e.g., `low_stock`).

from django_filters.rest_framework import DjangoFilterBackend
# `DjangoFilterBackend` is a filtering backend provided by `django-filter`.
# It allows filtering querysets based on query parameters in the URL.

from .models import Category, Product, Sale
# Importing models from the current app. Models define the database structure.
# `Category`, `Product`, and `Sale` are likely Django models representing database tables.

from .serializers import (
    CategorySerializer,
    ProductSerializer,
    ProductListSerializer,
    SaleSerializer,
)
# Serializers convert complex data types (e.g., Django models) into JSON for APIs.
# They also validate incoming data before saving it to the database.

from .permissions import IsAdminUser, IsAdminOrReadOnly
# Permissions control access to views. 
# `IsAdminUser` allows only admin users to access certain views.
# `IsAdminOrReadOnly` allows read-only access for non-admin users.

from django.conf import settings
# `settings` provides access to Django's configuration (e.g., `INSTALLED_APPS`, custom settings).

import django_filters
# `django_filters` is a library for adding filtering capabilities to Django querysets.

# --- CategoryViewSet ---
class CategoryViewSet(viewsets.ModelViewSet):
    # `ModelViewSet` is a DRF class that provides CRUD operations (Create, Read, Update, Delete).
    # It automatically handles common API actions like listing, retrieving, creating, etc.

    queryset = Category.objects.all()
    # `queryset` defines the data this view will operate on.
    # `Category.objects.all()` retrieves all `Category` objects from the database.

    serializer_class = CategorySerializer
    # Specifies the serializer to use for converting `Category` objects to/from JSON.

    permission_classes = [IsAdminOrReadOnly]
    # Restricts access to the view. Admin users can modify data; others can only read.

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    # Adds filtering capabilities to the view.
    # `SearchFilter` allows searching based on specific fields.
    # `OrderingFilter` allows sorting results by specified fields.

    search_fields = ['name', 'description']
    # Defines fields that can be searched using the `SearchFilter`.

    ordering_fields = ['name', 'created_at']
    # Defines fields that can be used for ordering results.

# --- ProductFilter ---
class ProductFilter(django_filters.FilterSet):
    # `FilterSet` is a class from `django_filters` that defines custom filtering logic.

    is_low_stock = django_filters.BooleanFilter(method='filter_is_low_stock')
    # Adds a custom filter for checking if a product is low in stock.
    # `method` specifies the function that implements the filtering logic.

    class Meta:
        model = Product
        # Specifies the model this filter applies to.

        fields = ['category', 'is_low_stock']
        # Defines the fields that can be filtered.

    def filter_is_low_stock(self, queryset, name, value):
        # Custom filter method for `is_low_stock`.

        threshold = getattr(settings, 'STOCK_THRESHOLD', 5)
        # Retrieves the stock threshold from Django settings (default is 5).

        if value:  # If `is_low_stock=True`
            return queryset.filter(quantity__lte=threshold)
            # Filters products with quantity less than or equal to the threshold.
        else:  # If `is_low_stock=False`
            return queryset.filter(quantity__gt=threshold)
            # Filters products with quantity greater than the threshold.

# --- ProductViewSet ---
class ProductViewSet(viewsets.ModelViewSet):
    # Handles CRUD operations for `Product` objects.

    queryset = Product.objects.all()
    # Retrieves all `Product` objects from the database.

    permission_classes = [IsAdminOrReadOnly]
    # Restricts access: Admins can modify; others can only read.

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    # Adds filtering, searching, and ordering capabilities.

    filterset_class = ProductFilter
    # Uses the custom `ProductFilter` class for filtering.

    search_fields = ['name', 'description', 'category__name']
    # Allows searching by product name, description, or category name.

    ordering_fields = ['name', 'price', 'quantity', 'created_at']
    # Allows ordering by name, price, quantity, or creation date.

    def get_serializer_class(self):
        # Dynamically selects the serializer class based on the action.

        if self.action == 'list':
            return ProductListSerializer
            # Uses a lightweight serializer for listing products.
        return ProductSerializer
        # Uses the detailed serializer for other actions.

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        # Custom action to list products with low stock.

        products = self.get_queryset().filter(quantity__lte=5)
        # Filters products with quantity less than or equal to 5.

        page = self.paginate_queryset(products)
        # Paginates the results if pagination is enabled.

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            # Returns paginated response.

        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)
        # Returns the serialized data.

    @action(detail=True, methods=['post'])
    def update_stock(self, request, pk=None):
        # Custom action to update the stock quantity of a product.

        product = self.get_object()
        # Retrieves the product instance based on the primary key (`pk`).

        if not request.user.is_admin:
            # Checks if the user is an admin.
            return Response(
                {"detail": "You do not have permission to perform this action."},
                status=status.HTTP_403_FORBIDDEN
            )

        quantity = request.data.get('quantity')
        # Retrieves the `quantity` from the request data.

        if quantity is None:
            return Response(
                {"quantity": "This field is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            quantity = int(quantity)
            # Converts the quantity to an integer.
        except ValueError:
            return Response(
                {"quantity": "Must be an integer."},
                status=status.HTTP_400_BAD_REQUEST
            )

        product.quantity = quantity
        # Updates the product's quantity.

        product.save()
        # Saves the changes to the database.

        serializer = self.get_serializer(product)
        return Response(serializer.data)
        # Returns the updated product data.

# --- SaleViewSet ---
class SaleViewSet(viewsets.ModelViewSet):
    # Handles CRUD operations for `Sale` objects.

    queryset = Sale.objects.all()
    # Retrieves all `Sale` objects from the database.

    serializer_class = SaleSerializer
    # Specifies the serializer for `Sale` objects.

    permission_classes = [IsAdminUser]
    # Restricts access to admin users only.

    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    # Adds filtering and ordering capabilities.

    filterset_fields = ['product', 'created_by']
    # Allows filtering by product and creator.

    ordering_fields = ['sale_date', 'quantity', 'total_price']
    # Allows ordering by sale date, quantity, or total price.

    def get_queryset(self):
        # Overrides the default `get_queryset` method.

        return Sale.objects.select_related('product', 'created_by')
        # Uses `select_related` to optimize database queries by fetching related objects.