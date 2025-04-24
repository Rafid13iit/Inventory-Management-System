import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { productSchema } from '../../utils/validators';
import { ProductFormData } from '../../types/product.types';
import { Category } from '../../types/category.types';
import { getCategories } from '../../api/categoryApi';
import Button from '../ui/Button';
import Input from '../ui/Input';
import SelectInput from '../ui/SelectInput';
import LoadingSpinner from '../ui/LoadingSpinner';

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  isLoading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData = { name: '', category: 0, price: 0, quantity: 0, description: '' },
  onSubmit,
  isLoading = false,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<ProductFormData>({
    resolver: yupResolver(productSchema),
    defaultValues: initialData,
  });
  
  const watchImage = watch('image');
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.results);
      } catch (err) {
        setError('Failed to load categories');
      } finally {
        setLoadingCategories(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  useEffect(() => {
    if (watchImage && watchImage[0]) {
      const file = watchImage[0];
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      setValue('image', file);
      
      return () => {
        URL.revokeObjectURL(fileUrl);
      };
    }
  }, [watchImage, setValue]);
  
  const handleFormSubmit = async (data: ProductFormData) => {
    setError(null);
    try {
      await onSubmit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product. Please try again.');
    }
  };
  
  if (loadingCategories) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-800 p-3 rounded border border-red-200">
          {error}
        </div>
      )}
      
      <Input
        label="Product Name"
        error={errors.name?.message}
        {...register('name')}
      />
      
      <SelectInput
        label="Category"
        options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
        error={errors.category?.message}
        {...register('category')}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Price"
          type="number"
          step="0.01"
          error={errors.price?.message}
          {...register('price')}
        />
        
        <Input
          label="Quantity"
          type="number"
          error={errors.quantity?.message}
          {...register('quantity')}
        />
      </div>
      
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
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Product Image
        </label>
        <input
          type="file"
          accept="image/*"
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          {...register('image')}
        />
        {errors.image && (
          <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
        )}
        
        {previewUrl && (
          <div className="mt-2">
            <img
              src={previewUrl}
              alt="Product preview"
              className="h-32 w-32 object-cover rounded border border-gray-200"
            />
          </div>
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
          {initialData.name ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;