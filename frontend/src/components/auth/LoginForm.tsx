// src/components/auth/LoginForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../../utils/validators';
import { LoginCredentials } from '../../types/auth.types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import useAuth from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get the redirect path from location state, or default to '/'
  const from = location.state?.from?.pathname || '/';
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });
  
  const onSubmit = async (data: LoginCredentials) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      await login(data);
      navigate(from, { replace: true }); // Redirect to the page they tried to access
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="w-full mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded-lg border-l-4 border-red-500 animate-pulse">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <Input
          label="Email Address"
          type="email"
          error={errors.email?.message}
          {...register('email')}
          placeholder="your@email.com"
          autoComplete="email"
          className="focus:ring-blue-500 focus:border-blue-500"
          icon={
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          }
        />
        
        <Input
          label="Password"
          type="password"
          error={errors.password?.message}
          {...register('password')}
          placeholder="••••••••"
          autoComplete="current-password"
          className="focus:ring-blue-500 focus:border-blue-500"
          icon={
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          }
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          
          <div className="text-sm">
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Forgot password?
            </a>
          </div>
        </div>
        
        <div className="pt-3">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="w-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
          >
            {isSubmitting ? 'Logging in...' : 'Sign In'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;