import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme as RNuseColorScheme, ColorSchemeName } from "react-native";
import * as SecureStore from "expo-secure-store";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => Promise<void>;
  colorScheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "user-theme-preference";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = RNuseColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>("system");

  useEffect(() => {
    // Load persisted theme on mount
    const loadTheme = async () => {
      try {
        const savedTheme = await SecureStore.getItemAsync(THEME_STORAGE_KEY);
        if (savedTheme) {
          setThemeState(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.error("Failed to load theme:", error);
      }
    };
    loadTheme();
  }, []);

  const setTheme = async (mode: ThemeMode) => {
    try {
      await SecureStore.setItemAsync(THEME_STORAGE_KEY, mode);
      setThemeState(mode);
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  };

  const activeColorScheme = theme === "system" 
    ? (systemColorScheme ?? "dark") 
    : theme;

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      colorScheme: activeColorScheme as "light" | "dark" 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
