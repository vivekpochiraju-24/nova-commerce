import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

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

const mapSupabaseUser = async (supabaseUser: SupabaseUser): Promise<User> => {
  // Check if user has admin role
  const { data: roles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', supabaseUser.id);

  const isAdmin = roles?.some(r => r.role === 'admin') ?? false;

  // Get profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', supabaseUser.id)
    .single();

  return {
    id: supabaseUser.id,
    name: profile?.full_name || supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || '',
    email: supabaseUser.email || '',
    isAdmin,
    createdAt: supabaseUser.created_at,
  };
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setToken(session.access_token);
          // Use setTimeout to avoid Supabase client deadlock
          setTimeout(async () => {
            const mappedUser = await mapSupabaseUser(session.user);
            setUser(mappedUser);
          }, 0);
        } else {
          setUser(null);
          setToken(null);
        }
      }
    );

    // THEN check current session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setToken(session.access_token);
        const mappedUser = await mapSupabaseUser(session.user);
        setUser(mappedUser);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.name,
          },
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        toast.success('Registration successful! Please check your email to verify your account.');
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error('Registration failed');
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        const mappedUser = await mapSupabaseUser(data.user);
        setUser(mappedUser);
        setToken(data.session?.access_token || null);
        toast.success(`Welcome back, ${mappedUser.name}!`);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Login failed');
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setToken(null);
    toast.success('Logged out successfully');
  };

  // Fetch all users when admin logs in
  useEffect(() => {
    if (user?.isAdmin) {
      const fetchAllUsers = async () => {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('*');
        if (profiles) {
          setAllUsers(profiles.map(p => ({
            id: p.user_id,
            name: p.full_name || p.email,
            email: p.email,
            createdAt: p.created_at,
          })));
        }
      };
      fetchAllUsers();
    }
  }, [user]);

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
