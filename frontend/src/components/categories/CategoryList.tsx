import React, { useState } from 'react';
import { Category } from '../../types/category.types';
import CategoryItem from './CategoryItem';
import Pagination from '../ui/Pagination';
import Card from '../ui/Card';
import Input from '../ui/Input';

interface CategoryListProps {
  categories: Category[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSearch: (query: string) => void;
  onDelete: (id: number) => Promise<void>;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  loading,
  error,
  currentPage,
  totalPages,
  onPageChange,
  onSearch,
  onDelete,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleDelete = async (id: number) => {
    setDeletingIds((prev) => [...prev, id]);
    try {
      await onDelete(id);
    } finally {
      setDeletingIds((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  if (error) {
    return (
      <Card className="p-4 bg-red-50 border border-red-200">
        <p className="text-red-800">{error}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch}>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </form>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : categories.length > 0 ? (
        <div className="space-y-4">
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              onDelete={handleDelete}
              isDeleting={deletingIds.includes(category.id)}
            />
          ))}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      ) : (
        <Card>
          <p className="text-gray-600 text-center py-4">No categories found</p>
        </Card>
      )}
    </div>
  );
};

export default CategoryList;