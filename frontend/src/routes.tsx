import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './components/layouts/MainLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';

// Product Pages
import Products from './pages/products/Products';
import ProductCreate from './pages/products/ProductCreate';
import ProductEdit from './pages/products/ProductEdit';

// Category Pages
import Categories from './pages/categories/Categories';
import CategoryCreate from './pages/categories/CategoryCreate';
import CategoryEdit from './pages/categories/CategoryEdit';

// Sales Pages
import Sales from './pages/sales/Sales';
import SaleCreate from './pages/sales/SaleCreate';

// Protected route component
interface ProtectedRouteProps {
  element: React.ReactNode;
  requiredRole?: 'ADMIN' | 'USER';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  element, 
  requiredRole 
}) => {
  const { state } = useAuth();
  const { isAuthenticated, user, isLoading } = state;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{element}</>;
};

// Define routes
export const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <Dashboard /> },
      { path: '/products', element: <Products /> },
      { path: '/products/create', element: <ProductCreate /> },
      { path: '/products/:id/edit', element: <ProductEdit /> },
      { path: '/categories', element: <Categories /> },
      { path: '/categories/create', element: <CategoryCreate /> },
      { path: '/categories/:id/edit', element: <CategoryEdit /> },
      { path: '/sales', element: <Sales />, requiredRole: 'ADMIN' },
      { path: '/sales/create', element: <SaleCreate />, requiredRole: 'ADMIN' },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];