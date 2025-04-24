// src/pages/products/ProductEdit.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import ProductForm from '../../components/products/ProductForm';
import { ProductFormData, Product } from '../../types/product.types';
import { getProduct, updateProduct } from '../../api/productApi';
import { getCategories } from '../../api/categoryApi';
import { Category } from '../../types/category.types';
import { useToast } from '../../components/layouts/MainLayout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || '0');
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    if (productId) {
      fetchProduct();
      fetchCategories();
    } else {
      setError('Invalid product ID');
      setLoading(false);
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const data = await getProduct(productId);
      setProduct(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch product');
      addToast('Failed to load product details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.results);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      addToast('Failed to load categories.', 'error');
    }
  };

  const handleSubmit = async (data: ProductFormData) => {
    setSubmitting(true);
    try {
      await updateProduct(productId, data);
      addToast('Product updated successfully!', 'success');
      navigate('/products');
    } catch (error: any) {
      let errorMessage = 'Failed to update product.';
      if (error.response && error.response.data) {
        // Format validation errors
        if (typeof error.response.data === 'object') {
          errorMessage = Object.entries(error.response.data)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
        }
      }
      addToast(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-red-50 text-red-800 border-red-500">
          <p>{error || 'Product not found'}</p>
        </Card>
      </div>
    );
  }

  // Convert backend product data to form data structure
  const initialData: ProductFormData = {
    name: product.name,
    category: product.category,
    price: product.price,
    quantity: product.quantity,
    description: product.description,
    image: null, // Can't pre-fill file input
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Product: {product.name}</h1>
      
      <Card>
        <ProductForm 
          onSubmit={handleSubmit}
          categories={categories}
          isSubmitting={submitting}
          initialData={initialData}
          imageUrl={product.image || undefined}
        />
      </Card>
    </div>
  );
};

export default ProductEdit;