import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: User['role']) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('gourmet-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: User['role']): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - accept any email/password combination
    const mockUser: User = {
      id: Date.now().toString(),
      name: email.split('@')[0].replace(/[^a-zA-Z ]/g, '').replace(/\b\w/g, l => l.toUpperCase()),
      email,
      role,
      avatar: `https://images.unsplash.com/photo-${
        role === 'admin' ? '1494790108755-2616b612b47c' :
        role === 'chef' ? '1507003211169-0a1dd7228f2d' :
        '1438761681033-6461ffad8d80'
      }?w=100&h=100&fit=crop&crop=face`
    };

    setUser(mockUser);
    localStorage.setItem('gourmet-user', JSON.stringify(mockUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gourmet-user');
  };

  const value = {
    user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}