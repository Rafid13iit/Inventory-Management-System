// src/pages/categories/Categories.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../../types/category.types';
import { getCategories, deleteCategory } from '../../api/categoryApi';
import CategoryList from '../../components/categories/CategoryList';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Pagination from '../../components/ui/Pagination';
import { useAuth } from '../../hooks/useAuth';
import Toast from '../../components/ui/Toast';
import { PaginatedResponse } from '../../types/api.types';

const Categories: React.FC = () => {
  const { state } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [ordering, setOrdering] = useState('name');
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'warning' | 'info'} | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response: PaginatedResponse<Category> = await getCategories(currentPage, searchTerm, ordering);
      setCategories(response.results);
      setTotalPages(Math.ceil(response.count / 10));
    } catch (error) {
      setToast({ message: 'Failed to fetch categories', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [currentPage, searchTerm, ordering]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrdering(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id);
      setToast({ message: 'Category deleted successfully', type: 'success' });
      fetchCategories();
    } catch (error) {
      setToast({ message: 'Failed to delete category', type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Categories</h1>
        {state.user?.role === 'ADMIN' && (
          <Link to="/categories/create">
            <Button variant="primary">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Category
            </Button>
          </Link>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0">
          <form onSubmit={handleSearch} className="flex space-x-2">
            <input
              type="text"
              placeholder="Search categories..."
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit" variant="primary" size="md">
              Search
            </Button>
          </form>

          <div className="flex items-center space-x-2">
            <label htmlFor="sort" className="text-sm font-medium text-gray-700">
              Sort by:
            </label>
            <select
              id="sort"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={ordering}
              onChange={handleSortChange}
            >
              <option value="name">Name (A-Z)</option>
              <option value="-name">Name (Z-A)</option>
              <option value="created_at">Oldest</option>
              <option value="-created_at">Newest</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-xl">No categories found</p>
            {state.user?.role === 'ADMIN' && (
              <Link to="/categories/create" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
                Create your first category
              </Link>
            )}
          </div>
        ) : (
          <CategoryList
            categories={categories}
            onDelete={state.user?.role === 'ADMIN' ? handleDelete : undefined}
          />
        )}

        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Categories;