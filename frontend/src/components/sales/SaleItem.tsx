import React from 'react';
import { Sale } from '../../types/sale.types';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface SaleItemProps {
  sale: Sale;
}

const SaleItem: React.FC<SaleItemProps> = ({ sale }) => {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{sale.product_name}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{sale.quantity}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{formatCurrency(sale.unit_price)}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{formatCurrency(sale.total_price)}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{formatDate(sale.sale_date)}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{sale.created_by_username}</div>
      </td>
    </tr>
  );
};

export default SaleItem;