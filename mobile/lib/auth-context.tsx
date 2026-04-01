import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { login as apiLogin, removeToken } from "./api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    (async () => {
      try {
        const storedUser = await SecureStore.getItemAsync("auth_user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch {
        // No stored user
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiLogin(email, password);
    if (data.success && data.user) {
      setUser(data.user);
      await SecureStore.setItemAsync("auth_user", JSON.stringify(data.user));
    } else {
      throw new Error("Login failed");
    }
  };

  const logout = async () => {
    setUser(null);
    await removeToken();
    await SecureStore.deleteItemAsync("auth_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
