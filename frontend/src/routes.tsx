// routes.tsx
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

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  element, 
  requiredRole 
}) => {
  const { state } = useAuth();
  const { isAuthenticated, user, isLoading } = state;

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRole && user?.role !== requiredRole) return <Navigate to="/" replace />;

  return <>{element}</>;
};

export const getRoutes = () => [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <ProtectedRoute element={<Dashboard />} /> },
      { path: 'products', element: <ProtectedRoute element={<Products />} /> },
      { path: 'products/create', element: <ProtectedRoute element={<ProductCreate />} /> },
      { path: 'products/:id/edit', element: <ProtectedRoute element={<ProductEdit />} /> },
      { path: 'categories', element: <ProtectedRoute element={<Categories />} /> },
      { path: 'categories/create', element: <ProtectedRoute element={<CategoryCreate />} /> },
      { path: 'categories/:id/edit', element: <ProtectedRoute element={<CategoryEdit />} /> },
      { path: 'sales', element: <ProtectedRoute element={<Sales />} requiredRole="ADMIN" /> },
      { path: 'sales/create', element: <ProtectedRoute element={<SaleCreate />} requiredRole="ADMIN" /> },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '*', element: <Navigate to="/" replace /> },
];
