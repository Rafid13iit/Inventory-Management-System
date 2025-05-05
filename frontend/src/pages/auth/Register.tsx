// src/pages/auth/Register.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';
import Card from '../../components/ui/Card';

const Register: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Inventory Manager</h1>
          <p className="text-gray-600">Create your account</p>
        </div>
        
        <Card className="shadow-xl border-t-4 border-green-500 overflow-hidden">
          <div className="px-6 py-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Join Our Platform</h2>
              <p className="text-sm text-gray-600 mt-1">Register to start managing your inventory</p>
            </div>
            
            <RegisterForm />
          </div>
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 hover:text-green-800 font-medium transition-colors">
              Sign in instead
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;