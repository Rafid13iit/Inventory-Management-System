from django.contrib import admin
from .models import Category, Product, Sale

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Admin configuration for Category model."""
    
    list_display = ('name', 'description', 'created_at', 'updated_at')
    search_fields = ('name', 'description')
    list_filter = ('created_at',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """Admin configuration for Product model."""
    
    list_display = ('name', 'category', 'price', 'quantity', 'is_low_stock', 'created_at')
    list_filter = ('category', 'created_at')
    search_fields = ('name', 'description', 'category__name')
    readonly_fields = ('is_low_stock',)

@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    """Admin configuration for Sale model."""
    
    list_display = ('product', 'quantity', 'unit_price', 'total_price', 'sale_date', 'created_by')
    list_filter = ('sale_date', 'product', 'created_by')
    search_fields = ('product__name', 'created_by__username')
    readonly_fields = ('total_price',)