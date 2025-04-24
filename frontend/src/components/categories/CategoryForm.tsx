import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CategoryFormData } from '../../types/category.types';
import Button from '../ui/Button';
import Input from '../ui/Input';

// Define the schema using yup
const categorySchema = yup.object().shape({
  name: yup.string().required('Category name is required'),
  description: yup.string().required('Description is required'),
});

interface CategoryFormProps {
  initialData?: CategoryFormData;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  isLoading?: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData = { name: '', description: '' },
  onSubmit,
  isLoading = false,
}) => {
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<CategoryFormData>({
    resolver: yupResolver(categorySchema),
    defaultValues: initialData,
  });
  
  const handleFormSubmit = async (data: CategoryFormData) => {
    setError(null);
    try {
      await onSubmit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save category. Please try again.');
    }
  };
  
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-800 p-3 rounded border border-red-200">
          {error}
        </div>
      )}
      
      <Input
        label="Category Name"
        error={errors.name?.message}
        {...register('name')}
      />
      
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            errors.description ? 'border-red-300' : ''
          }`}
          {...register('description')}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>
      
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          {initialData.name ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;