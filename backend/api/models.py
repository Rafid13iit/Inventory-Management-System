from django.db import models
from django.conf import settings
from django.utils import timezone

class Category(models.Model):
    """Model representing product categories."""
    
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']
    
    def __str__(self):
        return self.name

class Product(models.Model):
    """Model representing inventory products."""
    
    name = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=0)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name
    
    @property
    def is_low_stock(self):
        """Check if the product is low in stock."""
        threshold = getattr(settings, 'STOCK_THRESHOLD', 5)
        return self.quantity <= threshold

class Sale(models.Model):
    """Model representing sales transactions."""
    
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='sales')
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    sale_date = models.DateTimeField(default=timezone.now)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sales')
    
    def __str__(self):
        return f"Sale of {self.product.name} - {self.quantity} units"
    
    def save(self, *args, **kwargs):
        """Override save method to update product quantity and calculate total price."""
        if not self.pk:  # Only reduce stock on creation, not on updates
            self.product.quantity -= self.quantity
            self.product.save()
        
        # Calculate total price
        self.total_price = self.quantity * self.unit_price
        
        super().save(*args, **kwargs)