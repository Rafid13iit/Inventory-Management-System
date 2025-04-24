import React, { useState, useEffect } from 'react';
import { ProductListItem } from '../../types/product.types';
import { Category } from '../../types/category.types';
import { getCategories } from '../../api/categoryApi';
import ProductItem from './ProductItem';
import Pagination from '../ui/Pagination';
import Card from '../ui/Card';
import Input from '../ui/Input';
import SelectInput from '../ui/SelectInput';

interface ProductListProps {
    products: ProductListItem[];
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onSearch: (query: string) => void;
    onFilterChange: (filters: { category?: string; isLowStock?: string }) => void;
    onDelete: (id: number) => Promise<void>;
}

const ProductList: React.FC<ProductListProps> = ({
    products,
    loading,
    error,
    currentPage,
    totalPages,
    onPageChange,
    onSearch,
    onFilterChange,
    onDelete,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [lowStockFilter, setLowStockFilter] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [deletingIds, setDeletingIds] = useState<number[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const fetchedCategories = await getCategories();
                setCategories(fetchedCategories);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        onSearch(value);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setCategoryFilter(value);
        onFilterChange({ category: value, isLowStock: lowStockFilter });
    };

    const handleLowStockChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setLowStockFilter(value);
        onFilterChange({ category: categoryFilter, isLowStock: value });
    };

    const handleDelete = async (id: number) => {
        setDeletingIds((prev) => [...prev, id]);
        try {
            await onDelete(id);
        } catch (error) {
            console.error('Failed to delete product:', error);
        } finally {
            setDeletingIds((prev) => prev.filter((deletingId) => deletingId !== id));
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <Card>
            <div className="filters">
                <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <SelectInput
                    value={categoryFilter}
                    onChange={handleCategoryChange}
                    options={[
                        { value: '', label: 'All Categories' },
                        ...categories.map((category) => ({
                            value: category.id.toString(),
                            label: category.name,
                        })),
                    ]}
                />
                <SelectInput
                    value={lowStockFilter}
                    onChange={handleLowStockChange}
                    options={[
                        { value: '', label: 'All Stock Levels' },
                        { value: 'true', label: 'Low Stock' },
                        { value: 'false', label: 'Sufficient Stock' },
                    ]}
                />
            </div>
            <div className="product-list">
                {products.map((product) => (
                    <ProductItem
                        key={product.id}
                        product={product}
                        onDelete={handleDelete}
                        isDeleting={deletingIds.includes(product.id)}
                    />
                ))}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
        </Card>
    );
};

export default ProductList;