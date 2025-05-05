// src/components/auth/RegisterForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '../../utils/validators';
import { RegisterData } from '../../types/auth.types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const RegisterForm: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterData>({
    resolver: yupResolver(registerSchema),
  });
  
  const onSubmit = async (data: RegisterData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      await registerUser(data);
      navigate('/'); // Redirect to dashboard on successful registration
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
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
          label="Username"
          error={errors.username?.message}
          {...register('username')}
          placeholder="johndoe"
          className="focus:ring-green-500 focus:border-green-500"
          icon={
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        />
        
        <Input
          label="Email Address"
          type="email"
          error={errors.email?.message}
          {...register('email')}
          placeholder="your@email.com"
          className="focus:ring-green-500 focus:border-green-500"
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
          helperText="Must contain at least 8 characters, including uppercase, lowercase and numbers"
          {...register('password')}
          placeholder="••••••••"
          className="focus:ring-green-500 focus:border-green-500"
          icon={
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          }
        />
        
        <Input
          label="Confirm Password"
          type="password"
          error={errors.password2?.message}
          {...register('password2')}
          placeholder="••••••••"
          className="focus:ring-green-500 focus:border-green-500"
          icon={
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          }
        />
        
        <div className="pt-3">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;