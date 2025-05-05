// src/pages/products/ProductCreate.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import ProductForm from '../../components/products/ProductForm';
import { ProductFormData } from '../../types/product.types';
import { createProduct } from '../../api/productApi';
import { getCategories } from '../../api/categoryApi';
import { Category } from '../../types/category.types';
import { useToast } from '../../components/layouts/MainLayout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ProductCreate: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await getCategories();
      setCategories(response.results);
    } catch (err) {
      addToast('Failed to load categories.', 'error');
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      await createProduct(data);
      addToast('Product created successfully!', 'success');
      navigate('/products');
    } catch (error: any) {
      let errorMessage = 'Failed to create product.';
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
      setLoading(false);
    }
  };

  if (loadingCategories) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Product</h1>
      
      <Card>
        <ProductForm 
          onSubmit={handleSubmit}
          categories={categories}
          isSubmitting={loading}
        />
      </Card>
    </div>
  );
};

export default ProductCreate;