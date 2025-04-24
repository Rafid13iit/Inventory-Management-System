import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSales } from '../../api/saleApi';
import { Sale } from '../../types/sale.types';
import Pagination from '../ui/Pagination';
import LoadingSpinner from '../ui/LoadingSpinner';
import SaleItem from './SaleItem';
import Button from '../ui/Button';
import { formatDate, formatCurrency } from '../../utils/formatters';

interface SaleListProps {
  filterProduct?: number;
  filterUser?: number;
}

const SaleList: React.FC<SaleListProps> = ({ filterProduct, filterUser }) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [ordering, setOrdering] = useState<string>('-sale_date');

  const fetchSales = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getSales(
        currentPage,
        ordering,
        filterProduct ? String(filterProduct) : '',
        filterUser ? String(filterUser) : ''
      );
      
      setSales(response.results);
      setTotalPages(Math.ceil(response.count / 10)); // Assuming page size of 10
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch sales');
      setLoading(false);
    }
  };

  // Fetch sales on initial load and when dependencies change
  useEffect(() => {
    fetchSales();
  }, [currentPage, ordering, filterProduct, filterUser]);

  const handleSort = (field: string) => {
    // Toggle sorting direction if same field is clicked
    if (ordering === field) {
      setOrdering(`-${field}`);
    } else if (ordering === `-${field}`) {
      setOrdering(field);
    } else {
      setOrdering(field);
    }
    
    // Reset to page 1 when sorting changes
    setCurrentPage(1);
  };

  const getSortIndicator = (field: string) => {
    if (ordering === field) return '↑';
    if (ordering === `-${field}`) return '↓';
    return null;
  };

  // Calculate total sales amount
  const totalSalesAmount = sales.reduce((total, sale) => total + sale.total_price, 0);

  if (loading && sales.length === 0) {
    return (
      <div className="flex justify-center p-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <p className="text-red-700">{error}</p>
        <Button
          variant="secondary"
          className="mt-2"
          onClick={fetchSales}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold">Sales List</h2>
          <p className="text-sm text-gray-600">Total: {sales.length} sales ({formatCurrency(totalSalesAmount)})</p>
        </div>
        <Link to="/sales/create">
          <Button variant="primary">
            Add New Sale
          </Button>
        </Link>
      </div>

      {sales.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No sales found</p>
          <Link to="/sales/create" className="text-blue-500 hover:underline mt-2 inline-block">
            Create your first sale
          </Link>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('product_name')}
                  >
                    Product {getSortIndicator('product_name')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('quantity')}
                  >
                    Quantity {getSortIndicator('quantity')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('unit_price')}
                  >
                    Unit Price {getSortIndicator('unit_price')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('total_price')}
                  >
                    Total {getSortIndicator('total_price')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('sale_date')}
                  >
                    Date {getSortIndicator('sale_date')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('created_by_username')}
                  >
                    Created By {getSortIndicator('created_by_username')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sales.map((sale) => (
                  <SaleItem key={sale.id} sale={sale} />
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SaleList;