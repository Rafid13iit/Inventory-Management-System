// src/components/products/ProductItem.tsx
import React from 'react';
import { ProductListItem } from '../../types/product.types';
import Button from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';

interface ProductItemProps {
  product: ProductListItem;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, onDelete, onEdit }) => {
  const placeholderImage = '/assets/product-placeholder.png';
  
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <img 
              className="h-10 w-10 rounded-full object-cover" 
              src={product.image || placeholderImage} 
              alt={product.name} 
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{product.name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{product.category_name}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{formatCurrency(product.price)}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          product.is_low_stock 
            ? 'bg-red-100 text-red-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {product.quantity} {product.quantity === 1 ? 'unit' : 'units'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end space-x-2">
          <Button 
            variant="secondary"
            size="sm"
            onClick={() => onEdit(product.id)}
          >
            Edit
          </Button>
          <Button 
            variant="danger"
            size="sm"
            onClick={() => onDelete(product.id)}
          >
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default ProductItem;