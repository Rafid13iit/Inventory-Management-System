import React, { createContext, useReducer, useEffect } from 'react';
import { AuthState, User, LoginCredentials, RegisterData } from '../types/auth.types';
import { login, register, getCurrentUser, logout } from '../api/authApi';

// Define the shape of the context
interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
}

// Create context with a default value
export const AuthContext = createContext<AuthContextType>({
  state: {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  },
  login: async () => {},
  register: async () => {},
  logout: () => {},
  checkAuthStatus: async () => {},
});

// Action types
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

// Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isLoading: true,
    error: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is authenticated on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check authentication status
  const checkAuthStatus = async (): Promise<void> => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      dispatch({ type: 'LOGOUT' });
      return;
    }

    dispatch({ type: 'AUTH_START' });
    
    try {
      const user = await getCurrentUser();
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token },
      });
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      dispatch({
        type: 'AUTH_FAILURE',
        payload: 'Authentication failed. Please login again.',
      });
    }
  };

  // Login user
  const loginUser = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const { access, refresh } = await login(credentials);
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      
      const user = await getCurrentUser();
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token: access },
      });
    } catch (error: any) {
      let errorMessage = 'Login failed. Please check your credentials.';
      if (error.response && error.response.data) {
        errorMessage = error.response.data.detail || errorMessage;
      }
      
      dispatch({
        type: 'AUTH_FAILURE',
        payload: errorMessage,
      });
      throw new Error(errorMessage);
    }
  };

  // Register user
  const registerUser = async (userData: RegisterData): Promise<void> => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      await register(userData);
      
      // After successful registration, log the user in
      await loginUser({
        email: userData.email,
        password: userData.password,
      });
    } catch (error: any) {
      let errorMessage = 'Registration failed. Please try again.';
      if (error.response && error.response.data) {
        // Format validation errors
        const errors = error.response.data;
        if (typeof errors === 'object') {
          errorMessage = Object.entries(errors)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
        } else if (errors.detail) {
          errorMessage = errors.detail;
        }
      }
      
      dispatch({
        type: 'AUTH_FAILURE',
        payload: errorMessage,
      });
      throw new Error(errorMessage);
    }
  };

  // Logout user
  const logoutUser = (): void => {
    logout();
    dispatch({ type: 'LOGOUT' });
  };

  const contextValue: AuthContextType = {
    state,
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};