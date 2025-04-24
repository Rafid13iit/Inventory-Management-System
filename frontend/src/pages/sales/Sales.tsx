import React, { useState, useEffect } from 'react';
import SaleList from '../../components/sales/SaleList';
import Card from '../../components/ui/Card';
import { getProducts } from '../../api/productApi';
import { Product } from '../../types/product.types';
import SelectInput from '../../components/ui/SelectInput';

const Sales: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fix: Add required parameters to getProducts call
        const response = await getProducts(1, '', 'name', '', '');
        setProducts(response.results);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch products', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProduct(e.target.value);
  };

  const productOptions = [
    { value: '', label: 'All Products' },
    ...products.map(product => ({
      value: product.id.toString(),
      label: product.name
    }))
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Sales Management</h1>
      
      <Card className="mb-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Filter Sales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <SelectInput
                label="Filter by Product"
                options={productOptions}
                value={selectedProduct}
                onChange={handleProductFilterChange}
                disabled={loading}
              />
            </div>
          </div>
        </div>
      </Card>
      
      <Card>
        <SaleList filterProduct={selectedProduct ? parseInt(selectedProduct) : undefined} />
      </Card>
    </div>
  );
};

export default Sales;