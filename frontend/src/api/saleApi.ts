import axiosInstance from './axiosConfig';
import { Sale, SaleFormData } from '../types/sale.types';
import { PaginatedResponse } from '../types/api.types';

export const getSales = async (
  page = 1,
  ordering = '',
  product = '',
  createdBy = ''
): Promise<PaginatedResponse<Sale>> => {
  const params = { page, ordering, product, created_by: createdBy };
  const response = await axiosInstance.get<PaginatedResponse<Sale>>('/sales/', { params });
  return response.data;
};

export const getSale = async (id: number): Promise<Sale> => {
  const response = await axiosInstance.get<Sale>(`/sales/${id}/`);
  return response.data;
};

export const createSale = async (saleData: SaleFormData): Promise<Sale> => {
  const response = await axiosInstance.post<Sale>('/sales/', saleData);
  return response.data;
};