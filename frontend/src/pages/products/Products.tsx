// src/pages/products/Products.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductList from '../../components/products/ProductList';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getProducts, deleteProduct } from '../../api/productApi';
import { ProductListItem } from '../../types/product.types';
import { PaginatedResponse } from '../../types/api.types';
import Pagination from '../../components/ui/Pagination';
import { useToast } from '../../components/layouts/MainLayout';
import SelectInput from '../../components/ui/SelectInput';
import Input from '../../components/ui/Input';
import { getCategories } from '../../api/categoryApi';
import { Category } from '../../types/category.types';

const Products: React.FC = () => {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [ordering, setOrdering] = useState<string>('name');
  const [category, setCategory] = useState<string>('');
  const [isLowStock, setIsLowStock] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [currentPage, search, ordering, category, isLowStock]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getProducts(
        currentPage,
        search,
        ordering,
        category,
        isLowStock
      );
      setProducts(response.results);
      setTotalPages(Math.ceil(response.count / 10));
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
      addToast('Failed to load products.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await getCategories();
      setCategories(response.results);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        addToast('Product deleted successfully!', 'success');
        fetchProducts();
      } catch (err: any) {
        addToast(err.message || 'Failed to delete product.', 'error');
      }
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/products/${id}/edit`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleOrderingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrdering(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleLowStockChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsLowStock(e.target.value);
    setCurrentPage(1);
  };

  const orderingOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: '-name', label: 'Name (Z-A)' },
    { value: 'price', label: 'Price (Low to High)' },
    { value: '-price', label: 'Price (High to Low)' },
    { value: 'quantity', label: 'Quantity (Low to High)' },
    { value: '-quantity', label: 'Quantity (High to Low)' },
  ];

  const lowStockOptions = [
    { value: '', label: 'All Products' },
    { value: 'true', label: 'Low Stock Only' },
    { value: 'false', label: 'Normal Stock Only' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button
          variant="primary"
          onClick={() => navigate('/products/create')}
        >
          Add New Product
        </Button>
      </div>

      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Input
            label="Search"
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search products..."
          />
          
          <SelectInput
            label="Sort by"
            options={orderingOptions}
            value={ordering}
            onChange={handleOrderingChange}
          />
          
          <SelectInput
            label="Category"
            options={[
              { value: '', label: 'All Categories' },
              ...categories.map(cat => ({ value: cat.id.toString(), label: cat.name }))
            ]}
            value={category}
            onChange={handleCategoryChange}
            disabled={loadingCategories}
          />
          
          <SelectInput
            label="Stock Status"
            options={lowStockOptions}
            value={isLowStock}
            onChange={handleLowStockChange}
          />
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center my-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <Card className="bg-red-50 text-red-800 border-red-500">
          <p>{error}</p>
        </Card>
      ) : products.length === 0 ? (
        <Card className="text-center p-8">
          <p className="text-gray-500">No products found. Try changing your filters or create a new product.</p>
        </Card>
      ) : (
        <>
          <ProductList 
            products={products} 
            onDelete={handleDelete} 
            onEdit={handleEdit} 
          />
          
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Products;