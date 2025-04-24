import React from 'react';
import { Category } from '../../types/category.types';
import CategoryItem from './CategoryItem';

interface CategoryListProps {
  categories: Category[];
  onDelete?: (id: number) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, onDelete }) => {
  if (categories.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 text-xl">No categories found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          onDelete={onDelete ? () => onDelete(category.id) : undefined}
        />
      ))}
    </div>
  );
};

export default CategoryList;