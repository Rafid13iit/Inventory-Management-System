import axiosInstance from './axiosConfig';
import { Product, ProductFormData, ProductListItem } from '../types/product.types';
import { PaginatedResponse } from '../types/api.types';

export const getProducts = async (
  page = 1,
  search = '',
  ordering = '',
  category = '',
  isLowStock = ''
): Promise<PaginatedResponse<ProductListItem>> => {
  const params = { page, search, ordering, category, is_low_stock: isLowStock };
  const response = await axiosInstance.get<PaginatedResponse<ProductListItem>>('/products/', { params });
  return response.data;
};

export const getProduct = async (id: number): Promise<Product> => {
  const response = await axiosInstance.get<Product>(`/products/${id}/`);
  return response.data;
};

export const createProduct = async (productData: ProductFormData): Promise<Product> => {
  // Create FormData for file upload
  const formData = new FormData();
  Object.entries(productData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === 'image' && value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    }
  });
  
  const response = await axiosInstance.post<Product>('/products/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateProduct = async (id: number, productData: ProductFormData): Promise<Product> => {
  // Create FormData for file upload
  const formData = new FormData();
  Object.entries(productData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === 'image' && value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    }
  });
  
  const response = await axiosInstance.put<Product>(`/products/${id}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/products/${id}/`);
};

export const updateStock = async (id: number, quantity: number): Promise<Product> => {
  const response = await axiosInstance.post<Product>(`/products/${id}/update_stock/`, { quantity });
  return response.data;
};

export const getLowStockProducts = async (): Promise<PaginatedResponse<ProductListItem>> => {
  const response = await axiosInstance.get<PaginatedResponse<ProductListItem>>('/products/low_stock/');
  return response.data;
};