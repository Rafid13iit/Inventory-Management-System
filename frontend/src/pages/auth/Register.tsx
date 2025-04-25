// src/pages/auth/Register.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';
import Card from '../../components/ui/Card';

const Register: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
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
            
            <div className="mt-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-3 gap-3">
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.475 0 0 4.475 0 10c0 4.396 2.844 8.105 6.804 9.392.499.097.679-.221.679-.487 0-.244-.008-.891-.013-1.747-2.767.603-3.35-1.332-3.35-1.332-.454-1.148-1.105-1.455-1.105-1.455-.901-.614.069-.605.069-.605.996.07 1.521 1.024 1.521 1.024.885 1.517 2.325 1.08 2.891.825.089-.643.31-1.08.561-1.328-2.208-.251-4.531-1.104-4.531-4.917 0-1.088.39-1.979 1.029-2.675-.104-.253-.448-1.268.096-2.643 0 0 .84-.269 2.75 1.022A9.578 9.578 0 0110 4.836c.85.004 1.705.114 2.504.336 1.909-1.291 2.747-1.022 2.747-1.022.546 1.375.202 2.39.1 2.643.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.666-4.566 4.917.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.732 0 .267.18.577.688.48C17.157 18.105 20 14.395 20 10c0-5.525-4.475-10-10-10z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
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