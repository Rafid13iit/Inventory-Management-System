import React from 'react';
import SaleForm from '../../components/sales/SaleForm';
import Card from '../../components/ui/Card';

const SaleCreate: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Sale</h1>
      
      <Card>
        <SaleForm />
      </Card>
    </div>
  );
};

export default SaleCreate;