import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  isAdmin?: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  allUsers: User[];
  token: string | null;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('vebstore_token');
    const storedUser = localStorage.getItem('vebstore_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever user/token changes
  useEffect(() => {
    if (user && token) {
      localStorage.setItem('vebstore_token', token);
      localStorage.setItem('vebstore_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('vebstore_token');
      localStorage.removeItem('vebstore_user');
    }
  }, [user, token]);

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      const response = await axios.post('http://localhost:3001/api/auth/register', userData);
      
      if (response.data.user && response.data.token) {
        setUser(response.data.user);
        setToken(response.data.token);
        toast.success('Registration successful!');
        return true;
      }
      return false;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', { email, password });
      
      if (response.data.user && response.data.token) {
        setUser(response.data.user);
        setToken(response.data.token);
        toast.success(`Welcome back, ${response.data.user.name}!`);
        return true;
      }
      return false;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    delete axios.defaults.headers.common['Authorization'];
    
    // Clear all localStorage data
    localStorage.removeItem('vebstore_token');
    localStorage.removeItem('vebstore_user');
    localStorage.removeItem('vebstore_orders');
    
    toast.success('Logged out successfully');
  };

  const fetchAllUsers = async () => {
    try {
      if (user?.isAdmin && token) {
        const response = await axios.get('http://localhost:3001/api/users');
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  // Fetch all users when admin logs in
  useEffect(() => {
    if (user?.isAdmin) {
      fetchAllUsers();
    }
  }, [user, token]);

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading,
    allUsers,
    token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
