import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { saleSchema } from '../../utils/validators';
import { SaleFormData } from '../../types/sale.types';
import { Product } from '../../types/product.types';
import { getProducts } from '../../api/productApi';
import { createSale } from '../../api/saleApi';
import Button from '../ui/Button';
import Input from '../ui/Input';
import SelectInput from '../ui/SelectInput';
import Card from '../ui/Card';
import { formatCurrency } from '../../utils/formatters';

const SaleForm: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<SaleFormData>({
    resolver: yupResolver(saleSchema),
  });

  const productId = watch('product');
  const quantity = watch('quantity');

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.results);
        setLoading(false);
      } catch (error) {
        setError('Failed to load products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Update selected product and unit price when product changes
  useEffect(() => {
    if (productId && products.length > 0) {
      const product = products.find(p => p.id === Number(productId));
      if (product) {
        setSelectedProduct(product);
        setValue('unit_price', product.price);
      }
    }
  }, [productId, products, setValue]);

  // Calculate total amount
  const calculateTotal = () => {
    if (selectedProduct && quantity) {
      return selectedProduct.price * Number(quantity);
    }
    return 0;
  };

  const onSubmit = async (data: SaleFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await createSale(data);
      navigate('/sales');
    } catch (err: any) {
      setError(err.message || 'Failed to create sale');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card title="Create Sale">
        <div className="flex justify-center">
          <p>Loading products...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Create Sale">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <SelectInput
            label="Product"
            {...register('product')}
            options={products.map(product => ({
              value: product.id,
              label: `${product.name} - ${formatCurrency(product.price)} (${product.quantity} in stock)`
            }))}
            error={errors.product?.message}
          />
        </div>

        <div className="mb-4">
          <Input
            label="Quantity"
            type="number"
            {...register('quantity')}
            error={errors.quantity?.message}
            min={1}
            max={selectedProduct?.quantity || 1}
          />
          {selectedProduct && (
            <p className="text-sm text-gray-500 mt-1">
              Available: {selectedProduct.quantity} units
            </p>
          )}
        </div>

        <div className="mb-4">
          <Input
            label="Unit Price"
            type="number"
            step="0.01"
            {...register('unit_price')}
            error={errors.unit_price?.message}
            readOnly
          />
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded">
          <p className="text-gray-700">
            <span className="font-medium">Total Amount: </span>
            {formatCurrency(calculateTotal())}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Create Sale
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/sales')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default SaleForm;