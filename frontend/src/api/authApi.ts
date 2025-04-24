import axiosInstance from './axiosConfig';
import { LoginCredentials, RegisterData, User, AuthTokens } from '../types/auth.types';

export const login = async (credentials: LoginCredentials): Promise<AuthTokens> => {
  const response = await axiosInstance.post<AuthTokens>('/users/token/', credentials);
  return response.data;
};

export const register = async (userData: RegisterData): Promise<User> => {
  const response = await axiosInstance.post<User>('/users/register/', userData);
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await axiosInstance.get<User>('/users/me/');
  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
};