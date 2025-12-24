import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface PerformanceContextType {
  performanceMode: boolean;
  setPerformanceMode: (enabled: boolean) => void;
  togglePerformanceMode: () => void;
  reducedMotion: boolean;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

export function PerformanceProvider({ children }: { children: ReactNode }) {
  const [performanceMode, setPerformanceModeState] = useState(() => {
    if (typeof window !== "undefined") {
      // Also check for user's reduced motion preference
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const stored = localStorage.getItem("pop-performance-mode");
      return stored === "true" || prefersReducedMotion;
    }
    return false;
  });

  const reducedMotion = typeof window !== "undefined" 
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches 
    : false;

  const setPerformanceMode = useCallback((enabled: boolean) => {
    setPerformanceModeState(enabled);
    localStorage.setItem("pop-performance-mode", String(enabled));
  }, []);

  const togglePerformanceMode = useCallback(() => {
    setPerformanceModeState(prev => {
      const newValue = !prev;
      localStorage.setItem("pop-performance-mode", String(newValue));
      return newValue;
    });
  }, []);

  return (
    <PerformanceContext.Provider
      value={{
        performanceMode,
        setPerformanceMode,
        togglePerformanceMode,
        reducedMotion: reducedMotion || performanceMode,
      }}
    >
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformance() {
  const context = useContext(PerformanceContext);
  if (context === undefined) {
    throw new Error("usePerformance must be used within a PerformanceProvider");
  }
  return context;
}
