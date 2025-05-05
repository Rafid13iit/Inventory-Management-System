// src/pages/categories/CategoryEdit.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CategoryForm from '../../components/categories/CategoryForm';
import Card from '../../components/ui/Card';
import { Category, CategoryFormData } from '../../types/category.types';
import { getCategory, updateCategory } from '../../api/categoryApi';
import Toast from '../../components/ui/Toast';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const CategoryEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) return;
      
      try {
        const data = await getCategory(parseInt(id));
        setCategory(data);
      } catch (err) {
        setError('Failed to fetch category details');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const handleSubmit = async (data: CategoryFormData) => {
    if (!id) return;
    
    setSubmitting(true);
    setError(null);
    
    try {
      await updateCategory(parseInt(id), data);
      navigate('/categories');
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to update category';
      setError(errorMessage);
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

  if (!category && !loading) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 text-xl">Category not found</p>
      </div>
    );
  }

  // Extract initialData from the category object
  const initialData: CategoryFormData | undefined = category ? {
    name: category.name,
    description: category.description
  } : undefined;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Edit Category</h1>
      </div>

      {error && (
        <Toast 
          message={error} 
          type="error" 
          onClose={() => setError(null)} 
        />
      )}

      <Card>
        {category && (
          <CategoryForm 
            initialData={initialData} 
            onSubmit={handleSubmit} 
            isLoading={submitting} 
          />
        )}
      </Card>
    </div>
  );
};

export default CategoryEdit;