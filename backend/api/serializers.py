from rest_framework import serializers
from .models import Category, Product, Sale

class CategorySerializer(serializers.ModelSerializer):
    """Serializer for category objects."""
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class ProductSerializer(serializers.ModelSerializer):
    """Serializer for product objects."""
    
    category_name = serializers.ReadOnlyField(source='category.name')
    is_low_stock = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'category', 'category_name', 'price', 'quantity',
            'description', 'image', 'is_low_stock', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class ProductListSerializer(ProductSerializer):
    """Serializer for listing product objects with optimized fields."""
    
    class Meta(ProductSerializer.Meta):
        fields = [
            'id', 'name', 'category_name', 'price', 'quantity',
            'is_low_stock', 'image'
        ]

class SaleSerializer(serializers.ModelSerializer):
    """Serializer for sale objects."""
    
    product_name = serializers.ReadOnlyField(source='product.name')
    created_by_username = serializers.ReadOnlyField(source='created_by.username')
    
    class Meta:
        model = Sale
        fields = [
            'id', 'product', 'product_name', 'quantity', 'unit_price',
            'total_price', 'sale_date', 'created_by', 'created_by_username'
        ]
        read_only_fields = ['id', 'total_price', 'created_by']
    
    def validate(self, attrs):
        """Validate that there is enough stock for the sale."""
        product = attrs['product']
        quantity = attrs['quantity']
        
        if product.quantity < quantity:
            raise serializers.ValidationError(
                f"Not enough stock available. Only {product.quantity} units left."
            )
        
        return attrs
    
    def create(self, validated_data):
        """Create a new sale and set the created_by field."""
        validated_data['created_by'] = self.context['request'].user
        validated_data['unit_price'] = validated_data['product'].price
        return super().create(validated_data)