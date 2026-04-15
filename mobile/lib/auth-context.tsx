import React, { createContext, useContext, useEffect, useState } from "react";
import { storage } from "./storage";
import { login as apiLogin, removeToken } from "./api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = async () => {
    if (!user) return;
    try {
      // Import fetchUserProfile inside or rely on the api module
      const { fetchUserProfile } = require("./api");
      const profileInfo = await fetchUserProfile();
      if (profileInfo) {
        const updatedUser = { ...user, ...profileInfo };
        setUser(updatedUser);
        await storage.setItem("auth_user", JSON.stringify(updatedUser));
      }
    } catch (e: any) {
      console.warn("Failed to refresh profile on startup:", e);
      // Only logout if the token is confirmed missing (not just a transient server error)
      const errorMsg = e.message || "";
      if (errorMsg.includes("Not authenticated") || errorMsg.includes("please log in")) {
        // Token is definitely missing from storage — must re-login
        setUser(null);
        storage.removeItem("auth_user").catch(() => {});
        removeToken().catch(() => {});
      }
      // For server 401s or network errors, keep the user logged in
      // — the token may still be valid and the server might recover
    }
  };

  // Restore session on mount
  useEffect(() => {
    (async () => {
      try {
        const storedUser = await storage.getItem("auth_user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.warn("Storage error on web session restoration:", e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Sync profile when user is loaded from storage
  useEffect(() => {
    if (user && !isLoading) {
      refreshProfile();
    }
  }, [isLoading]);

  const login = async (email: string, password: string) => {
    const data = await apiLogin(email, password);
    if (data.success && data.user) {
      setUser(data.user);
      await storage.setItem("auth_user", JSON.stringify(data.user));
    } else {
      throw new Error("Login failed");
    }
  };

  const logout = async () => {
    setUser(null);
    await removeToken();
    await storage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
