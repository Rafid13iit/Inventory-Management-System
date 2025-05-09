from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from .models import Category, Product, Sale
from decimal import Decimal

User = get_user_model()

class CategoryTests(TestCase):
    """Test the category API."""

    def setUp(self):
        self.client = APIClient()
        # Create admin user
        self.admin_user = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='testpass123',
            role='ADMIN'
        )
        # Create regular user
        self.user = User.objects.create_user(
            username='user',
            email='user@example.com',
            password='testpass123',
            role='USER'
        )
        
        # Create test category
        self.category = Category.objects.create(
            name='Test Category',
            description='Test description'
        )
        
        self.category_url = reverse('category-list')
        self.category_detail_url = reverse('category-detail', args=[self.category.id])

    def test_list_categories_authenticated(self):
        """Test that authenticated users can list categories."""
        self.client.force_authenticate(user=self.user)
        res = self.client.get(self.category_url)
        
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data['results']), 1)
        self.assertEqual(res.data['results'][0]['name'], self.category.name)

    def test_create_category_admin(self):
        """Test that admin users can create categories."""
        self.client.force_authenticate(user=self.admin_user)
        payload = {
            'name': 'New Category',
            'description': 'New description'
        }
        res = self.client.post(self.category_url, payload)
        
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Category.objects.count(), 2)
        
    def test_create_category_user_fails(self):
        """Test that regular users cannot create categories."""
        self.client.force_authenticate(user=self.user)
        payload = {
            'name': 'New Category',
            'description': 'New description'
        }
        res = self.client.post(self.category_url, payload)
        
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Category.objects.count(), 1)

class ProductTests(TestCase):
    """Test the product API."""

    def setUp(self):
        self.client = APIClient()
        # Create admin user
        self.admin_user = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='testpass123',
            role='ADMIN'
        )
        # Create regular user
        self.user = User.objects.create_user(
            username='user',
            email='user@example.com',
            password='testpass123',
            role='USER'
        )
        
        # Create test category
        self.category = Category.objects.create(
            name='Test Category',
            description='Test description'
        )
        
        # Create test product
        self.product = Product.objects.create(
            name='Test Product',
            category=self.category,
            price=Decimal('10.00'),
            quantity=10,
            description='Test product description'
        )
        
        self.product_url = reverse('product-list')
        self.product_detail_url = reverse('product-detail', args=[self.product.id])

    def test_list_products_authenticated(self):
        """Test that authenticated users can list products."""
        self.client.force_authenticate(user=self.user)
        res = self.client.get(self.product_url)
        
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data['results']), 1)
        self.assertEqual(res.data['results'][0]['name'], self.product.name)

    def test_create_product_admin(self):
        """Test that admin users can create products."""
        self.client.force_authenticate(user=self.admin_user)
        payload = {
            'name': 'New Product',
            'category': self.category.id,
            'price': '15.00',
            'quantity': 20,
            'description': 'New product description'
        }
        res = self.client.post(self.product_url, payload)
        
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Product.objects.count(), 2)
        
    def test_create_product_user_fails(self):
        """Test that regular users cannot create products."""
        self.client.force_authenticate(user=self.user)
        payload = {
            'name': 'New Product',
            'category': self.category.id,
            'price': '15.00',
            'quantity': 20,
            'description': 'New product description'
        }
        res = self.client.post(self.product_url, payload)
        
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Product.objects.count(), 1)
        
    def test_update_product_admin(self):
        """Test that admin users can update products."""
        self.client.force_authenticate(user=self.admin_user)
        payload = {'quantity': 5}
        res = self.client.patch(self.product_detail_url, payload)
        
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.product.refresh_from_db()
        self.assertEqual(self.product.quantity, 5)
        
    def test_update_product_user_fails(self):
        """Test that regular users cannot update products."""
        self.client.force_authenticate(user=self.user)
        payload = {'quantity': 5}
        res = self.client.patch(self.product_detail_url, payload)
        
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.product.refresh_from_db()
        self.assertEqual(self.product.quantity, 10)
        
    def test_delete_product_admin(self):
        """Test that admin users can delete products."""
        self.client.force_authenticate(user=self.admin_user)
        res = self.client.delete(self.product_detail_url)
        
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Product.objects.count(), 0)
        
    def test_delete_product_user_fails(self):
        """Test that regular users cannot delete products."""
        self.client.force_authenticate(user=self.user)
        res = self.client.delete(self.product_detail_url)
        
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Product.objects.count(), 1)

    def test_low_stock_endpoint(self):
        """Test the low_stock endpoint."""
        # Update product to have low stock
        self.product.quantity = 3
        self.product.save()
        
        self.client.force_authenticate(user=self.user)
        res = self.client.get(reverse('product-low-stock'))
        
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data['results']), 1)
        self.assertEqual(res.data['results'][0]['name'], self.product.name)

class SaleTests(TestCase):
    """Test the sale API."""

    def setUp(self):
        self.client = APIClient()
        # Create admin user
        self.admin_user = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='testpass123',
            role='ADMIN'
        )
        # Create regular user
        self.user = User.objects.create_user(
            username='user',
            email='user@example.com',
            password='testpass123',
            role='USER'
        )
        
        # Create test category and product
        self.category = Category.objects.create(
            name='Test Category',
            description='Test description'
        )
        self.product = Product.objects.create(
            name='Test Product',
            category=self.category,
            price=Decimal('10.00'),
            quantity=10,
            description='Test product description'
        )
        
        # Create test sale
        self.sale = Sale.objects.create(
            product=self.product,
            quantity=2,
            unit_price=self.product.price,
            created_by=self.admin_user
        )
        
        self.sale_url = reverse('sale-list')
        self.sale_detail_url = reverse('sale-detail', args=[self.sale.id])

    def test_list_sales_admin(self):
        """Test that admin users can list sales."""
        self.client.force_authenticate(user=self.admin_user)
        res = self.client.get(self.sale_url)
        
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data['results']), 1)
        
    def test_list_sales_user_fails(self):
        """Test that regular users cannot list sales."""
        self.client.force_authenticate(user=self.user)
        res = self.client.get(self.sale_url)
        
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        
    def test_create_sale_admin(self):
        """Test that admin users can create sales."""
        self.client.force_authenticate(user=self.admin_user)
        payload = {
            'product': self.product.id,
            'quantity': 1,
            'unit_price': '10.00'
        }
        res = self.client.post(self.sale_url, payload)
        
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Sale.objects.count(), 2)
        # Check that product quantity was updated
        self.product.refresh_from_db()
        self.assertEqual(self.product.quantity, 7)  # 10 - 2 - 1 = 7
        
    def test_create_sale_not_enough_stock(self):
        """Test creating a sale with insufficient stock fails."""
        self.client.force_authenticate(user=self.admin_user)
        payload = {
            'product': self.product.id,
            'quantity': 20,  # More than available stock
            'unit_price': '10.00'
        }
        res = self.client.post(self.sale_url, payload)
        
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Sale.objects.count(), 1)