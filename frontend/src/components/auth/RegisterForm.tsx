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
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-800 p-3 rounded border border-red-200">
            {error}
          </div>
        )}
        
        <Input
          label="Username"
          error={errors.username?.message}
          {...register('username')}
        />
        
        <Input
          label="Email Address"
          type="email"
          error={errors.email?.message}
          {...register('email')}
        />
        
        <Input
          label="Password"
          type="password"
          error={errors.password?.message}
          helperText="Must contain at least 8 characters, including uppercase, lowercase and numbers"
          {...register('password')}
        />
        
        <Input
          label="Confirm Password"
          type="password"
          error={errors.password2?.message}
          {...register('password2')}
        />
        
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="w-full"
          >
            Register
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;