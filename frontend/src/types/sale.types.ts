export interface Sale {
    id: number;
    product: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    sale_date: string;
    created_by: number;
    created_by_username: string;
  }
  
export interface SaleFormData {
    product: number;
    quantity: number;
    unit_price: number;
  }