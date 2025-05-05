import * as yup from 'yup';

// Login form validation schema
export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

// Registration form validation schema
export const registerSchema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  password2: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

// Category form validation schema
export const categorySchema = yup.object({
  name: yup
    .string()
    .required('Category name is required')
    .max(100, 'Category name must be at most 100 characters'),
  description: yup
    .string(),
});

// Product form validation schema
export const productSchema = yup.object({
  name: yup
    .string()
    .required('Product name is required')
    .max(255, 'Product name must be at most 255 characters'),
  category: yup
    .number()
    .required('Category is required')
    .positive('Invalid category'),
  price: yup
    .number()
    .required('Price is required')
    .positive('Price must be positive'),
  quantity: yup
    .number()
    .required('Quantity is required')
    .integer('Quantity must be an integer')
    .min(0, 'Quantity cannot be negative'),
  description: yup
    .string(),
  image: yup
    .mixed(),
});

// Sale form validation schema
export const saleSchema = yup.object({
  product: yup
    .number()
    .required('Product is required')
    .positive('Invalid product'),
  quantity: yup
    .number()
    .required('Quantity is required')
    .integer('Quantity must be an integer')
    .positive('Quantity must be positive'),
  unit_price: yup
    .number()
    .required('Unit price is required')
    .positive('Unit price must be positive'),
});