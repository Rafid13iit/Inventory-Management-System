// src/pages/categories/CategoryCreate.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryForm from '../../components/categories/CategoryForm';
import Card from '../../components/ui/Card';
import { CategoryFormData } from '../../types/category.types';
import { createCategory } from '../../api/categoryApi';
import Toast from '../../components/ui/Toast';

const CategoryCreate: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CategoryFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      await createCategory(data);
      navigate('/categories');
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to create category';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Create Category</h1>
      </div>

      {error && (
        <Toast 
          message={error} 
          type="error" 
          onClose={() => setError(null)} 
        />
      )}

      <Card>
        <CategoryForm onSubmit={handleSubmit} isLoading={loading} />
      </Card>
    </div>
  );
};

export default CategoryCreate;