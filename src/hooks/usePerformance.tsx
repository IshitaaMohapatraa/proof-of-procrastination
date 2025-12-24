import { createContext, useContext, useState, ReactNode, useCallback, useRef, useEffect } from "react";

interface PerformanceContextType {
  performanceMode: boolean;
  setPerformanceMode: (enabled: boolean) => void;
  togglePerformanceMode: () => void;
  reducedMotion: boolean;
  // Animation freeze tracking
  hasPageAnimated: (pageKey: string) => boolean;
  markPageAnimated: (pageKey: string) => void;
}

// Global set to track animated pages - persists across navigation
const animatedPagesSet = new Set<string>();

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

  // Animation freeze tracking
  const hasPageAnimated = useCallback((pageKey: string) => {
    return animatedPagesSet.has(pageKey);
  }, []);

  const markPageAnimated = useCallback((pageKey: string) => {
    animatedPagesSet.add(pageKey);
  }, []);

  return (
    <PerformanceContext.Provider
      value={{
        performanceMode,
        setPerformanceMode,
        togglePerformanceMode,
        reducedMotion: reducedMotion || performanceMode,
        hasPageAnimated,
        markPageAnimated,
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
