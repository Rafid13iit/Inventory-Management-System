from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product, Sale
from .serializers import (
    CategorySerializer,
    ProductSerializer,
    ProductListSerializer,
    SaleSerializer,
)
from .permissions import IsAdminUser, IsAdminOrReadOnly

class CategoryViewSet(viewsets.ModelViewSet):
    
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']

class ProductViewSet(viewsets.ModelViewSet):
    
    queryset = Product.objects.all()
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_low_stock']
    search_fields = ['name', 'description', 'category__name']
    ordering_fields = ['name', 'price', 'quantity', 'created_at']
    
    def get_serializer_class(self):
        # Returning appropriate serializer class based on action
        if self.action == 'list':
            return ProductListSerializer
        return ProductSerializer
    
    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        # Listing products with low stock
        products = self.get_queryset().filter(quantity__lte=5)
        page = self.paginate_queryset(products)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def update_stock(self, request, pk=None):
        # Updating product stock quantity
        product = self.get_object()
        
        # Check if user is admin
        if not request.user.is_admin:
            return Response(
                {"detail": "You do not have permission to perform this action."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        quantity = request.data.get('quantity')
        if quantity is None:
            return Response(
                {"quantity": "This field is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            quantity = int(quantity)
        except ValueError:
            return Response(
                {"quantity": "Must be an integer."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        product.quantity = quantity
        product.save()
        
        serializer = self.get_serializer(product)
        return Response(serializer.data)

class SaleViewSet(viewsets.ModelViewSet):
    
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['product', 'created_by']
    ordering_fields = ['sale_date', 'quantity', 'total_price']
    
    def get_queryset(self):
        return Sale.objects.select_related('product', 'created_by')