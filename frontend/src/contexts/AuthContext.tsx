/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  email: string;
  name: string;
  role: "Restaurant Manager" | "Kitchen Staff" | "Inventory Manager" | "Server";
}

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string,
    name: string,
    role: string
  ) => Promise<boolean>;
  register: (
    email: string,
    password: string,
    name: string,
    role: string
  ) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("restaurant_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string,
    name: string,
    role: string
  ): Promise<boolean> => {
    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok && data.token) {
        const userData = data.user;
        setUser(userData);
        localStorage.setItem("restaurant_user", JSON.stringify(userData));
        localStorage.setItem("restaurant_token", data.token);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role: string
  ): Promise<boolean> => {
    try {
      const response = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok && data.user) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("restaurant_user");
    localStorage.removeItem("restaurant_token");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
