import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../../types/category.types';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface CategoryItemProps {
  category: Category;
  onDelete?: () => void;
  isDeleting?: boolean;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  onDelete,
  isDeleting = false,
}) => {
  // Format created_at date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Card>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
          <p className="mt-1 text-sm text-gray-600">
            {category.description || 'No description provided'}
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Created: {formatDate(category.created_at)}
          </p>
        </div>
        <div className="flex space-x-2">
          <Link to={`/categories/edit/${category.id}`}>
            <Button variant="secondary" size="sm">
              Edit
            </Button>
          </Link>
          {onDelete && (
            <Button
              variant="danger"
              size="sm"
              onClick={onDelete}
              isLoading={isDeleting}
              disabled={isDeleting}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CategoryItem;