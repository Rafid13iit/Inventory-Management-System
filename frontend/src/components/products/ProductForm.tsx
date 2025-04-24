import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ProductFormData } from '../../types/product.types';
import { Category } from '../../types/category.types';
import Input from '../ui/Input';
import Button from '../ui/Button';
import SelectInput from '../ui/SelectInput';
import { Link } from 'react-router-dom';

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => void;
  categories: Category[];
  isSubmitting: boolean;
  initialData?: ProductFormData;
  imageUrl?: string;
}

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  category: yup.number().required('Category is required'),
  price: yup.number().positive('Price must be positive').required('Price is required'),
  quantity: yup.number().integer('Quantity must be an integer').min(0, 'Quantity cannot be negative').required('Quantity is required'),
  description: yup.string().required('Description is required'),
  image: yup.mixed().notRequired(),
});

const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  categories,
  isSubmitting,
  initialData,
  imageUrl,
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(imageUrl || null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: initialData || {
      name: '',
      category: categories.length > 0 ? categories[0].id : 0,
      price: 0,
      quantity: 0,
      description: '',
      image: null,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(imageUrl || null);
    }
  };

  const submitForm = (data: ProductFormData) => {
    // Handle file from input
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput?.files?.length) {
      data.image = fileInput.files[0];
    }
    
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submitForm as SubmitHandler<ProductFormData>)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Input
            label="Product Name"
            {...register('name')}
            error={errors.name?.message}
            placeholder="Enter product name"
          />
        </div>
        
        <div>
          <SelectInput
            label="Category"
            {...register('category')}
            options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
            error={errors.category?.message}
          />
        </div>
        
        <div>
          <Input
            label="Price"
            type="number"
            step="0.01"
            {...register('price')}
            error={errors.price?.message}
            placeholder="0.00"
          />
        </div>
        
        <div>
          <Input
            label="Quantity"
            type="number"
            {...register('quantity')}
            error={errors.quantity?.message}
            placeholder="0"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={4}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter product description"
        ></textarea>
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product Image
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          onChange={handleImageChange}
        />
        {errors.image && (
          <p className="mt-1 text-sm text-red-600">{errors.image.message as string}</p>
        )}
        
        {previewImage && (
          <div className="mt-2">
            <img 
              src={previewImage} 
              alt="Product preview" 
              className="h-32 w-auto object-contain border rounded"
            />
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-3">
        <Link to="/products">
          <Button variant="secondary" type="button">
            Cancel
          </Button>
        </Link>
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;