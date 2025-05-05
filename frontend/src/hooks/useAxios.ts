import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';
import { useAuth } from './useAuth';
import { AxiosRequestConfig, AxiosError } from 'axios';

interface UseAxiosState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export const useAxios = <T>() => {
  const [state, setState] = useState<UseAxiosState<T>>({
    data: null,
    error: null,
    loading: false,
  });
  const { logout } = useAuth();

  const handleError = (error: AxiosError) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      logout();
    }
    
    const errorMessage = (error.response?.data as { detail?: string })?.detail || error.message;
    setState(prevState => ({
      ...prevState,
      error: errorMessage,
      loading: false,
    }));
    
    return Promise.reject(error);
  };

  const fetchData = async (
    url: string,
    options?: AxiosRequestConfig
  ): Promise<T> => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));
    
    try {
      const response = await axiosInstance({
        url,
        ...options,
      });
      
      setState({
        data: response.data,
        error: null,
        loading: false,
      });
      
      return response.data;
    } catch (error) {
      return handleError(error as AxiosError);
    }
  };

  return {
    ...state,
    fetchData,
  };
};