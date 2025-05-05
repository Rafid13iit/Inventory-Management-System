export interface Product {
    id: number;
    name: string;
    category: number;
    category_name: string;
    price: number;
    quantity: number;
    description: string;
    image: string | null;
    is_low_stock: boolean;
    created_at: string;
    updated_at: string;
  }
  
  export interface ProductListItem {
    id: number;
    name: string;
    category_name: string;
    price: number;
    quantity: number;
    is_low_stock: boolean;
    image: string | null;
  }
  
  export interface ProductFormData {
    name: string;
    category: number;
    price: number;
    quantity: number;
    description: string;
    image?: File | null;
  }