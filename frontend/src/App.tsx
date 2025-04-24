import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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

const App: React.FC = () => {
  const { state } = useAuth();
  const { user } = state;

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="products/create" element={<ProductCreate />} />
        <Route path="products/:id/edit" element={<ProductEdit />} />
        <Route path="categories" element={<Categories />} />
        <Route path="categories/create" element={<CategoryCreate />} />
        <Route path="categories/:id/edit" element={<CategoryEdit />} />
        
        {/* Admin only routes */}
        {user?.role === 'ADMIN' && (
          <>
            <Route path="sales" element={<Sales />} />
            <Route path="sales/create" element={<SaleCreate />} />
          </>
        )}
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;