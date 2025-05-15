
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define user type for our custom auth
interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Try to get stored user from localStorage
const getStoredUser = (): User | null => {
  const storedUser = localStorage.getItem('phoneMetricsUser');
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (e) {
      localStorage.removeItem('phoneMetricsUser');
    }
  }
  return null;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getStoredUser());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already stored in localStorage
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('auth', {
        body: {
          action: 'signup',
          email,
          password,
          fullName
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to sign up');
      }
      
      // Set the user in state and localStorage
      setUser(data.user);
      localStorage.setItem('phoneMetricsUser', JSON.stringify(data.user));
      
      // Show success toast
      toast({
        title: "Account created successfully",
        description: "Welcome to PhoneMetrics!",
      });
      
      return { error: null };
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('auth', {
        body: {
          action: 'signin',
          email,
          password
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to sign in');
      }
      
      // Set the user in state and localStorage
      setUser(data.user);
      localStorage.setItem('phoneMetricsUser', JSON.stringify(data.user));
      
      // Show success toast
      toast({
        title: "Signed in successfully",
        description: "Welcome back to PhoneMetrics!",
      });
      
      return { error: null };
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      // Since we're using our custom auth, just clear the user from state and localStorage
      setUser(null);
      localStorage.removeItem('phoneMetricsUser');
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out.",
      });
    } catch (error) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
