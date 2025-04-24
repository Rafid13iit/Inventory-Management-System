export interface User {
    id: number;
    username: string;
    email: string;
    role: 'ADMIN' | 'USER';
  }
  
  export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterData {
    username: string;
    email: string;
    password: string;
    password2: string;
    role?: string;
  }
  
  export interface AuthTokens {
    access: string;
    refresh: string;
  }