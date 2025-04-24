import React from 'react';
import { Link } from 'react-router-dom';
import { ProductListItem } from '../../types/product.types';
import Card from '../ui/Card';
import { formatCurrency } from '../../utils/formatters';
import Button from '../ui/Button';

interface ProductItemProps {
  product: ProductListItem;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
}

const ProductItem: React.FC<ProductItemProps> = ({
  product,
  onDelete,
  isDeleting = false,
}) => {
  const placeholderImage = 'https://via.placeholder.com/100';
  
  return (
    <Card>
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <img
            src={product.image || placeholderImage}
            alt={product.name}
            className="h-16 w-16 object-cover rounded"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 truncate">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500">
            Category: {product.category_name}
          </p>
          <div className="mt-1 flex items-center">
            <span className="text-lg font-semibold text-gray-900">
              {formatCurrency(product.price)}
            </span>
            <span className="ml-4 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Stock: {product.quantity}
            </span>
            {product.is_low_stock && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Low Stock
              </span>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <Link to={`/products/edit/${product.id}`}>
            <Button variant="secondary" size="sm">
              Edit
            </Button>
          </Link>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(product.id)}
            isLoading={isDeleting}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductItem;