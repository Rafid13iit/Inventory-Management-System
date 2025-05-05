// src/pages/auth/Login.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import Card from '../../components/ui/Card';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Inventory Manager</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>
        
        <Card className="shadow-xl border-t-4 border-blue-500 overflow-hidden">
          <div className="px-6 py-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Welcome Back</h2>
              <p className="text-sm text-gray-600 mt-1">Please sign in to continue</p>
            </div>
            
            <LoginForm />
            
          </div>
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
              Create one now
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;