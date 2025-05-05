import axiosInstance from './axiosConfig';
import { Category, CategoryFormData } from '../types/category.types';
import { PaginatedResponse } from '../types/api.types';

export const getCategories = async (
  page = 1,
  search = '',
  ordering = ''
): Promise<PaginatedResponse<Category>> => {
  const params = { page, search, ordering };
  const response = await axiosInstance.get<PaginatedResponse<Category>>('/categories/', { params });
  return response.data;
};

export const getCategory = async (id: number): Promise<Category> => {
  const response = await axiosInstance.get<Category>(`/categories/${id}/`);
  return response.data;
};

export const createCategory = async (categoryData: CategoryFormData): Promise<Category> => {
  const response = await axiosInstance.post<Category>('/categories/', categoryData);
  return response.data;
};

export const updateCategory = async (id: number, categoryData: CategoryFormData): Promise<Category> => {
  const response = await axiosInstance.put<Category>(`/categories/${id}/`, categoryData);
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/categories/${id}/`);
};