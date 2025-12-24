import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  chaosMode: boolean;
  setChaosMode: (enabled: boolean) => void;
  toggleChaosMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("pop-theme") as Theme) || "dark";
    }
    return "dark";
  });

  const [chaosMode, setChaosModeState] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("pop-chaos-mode") === "true";
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove both classes first
    root.classList.remove("dark", "light");
    
    // Add current theme class
    root.classList.add(theme);
    
    // Store preference
    localStorage.setItem("pop-theme", theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    
    if (chaosMode) {
      root.classList.add("chaos-mode");
    } else {
      root.classList.remove("chaos-mode");
    }
    
    localStorage.setItem("pop-chaos-mode", String(chaosMode));
  }, [chaosMode]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const setChaosMode = (enabled: boolean) => {
    setChaosModeState(enabled);
  };

  const toggleChaosMode = () => {
    setChaosModeState((prev) => !prev);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        chaosMode,
        setChaosMode,
        toggleChaosMode,
      }}
    >
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
