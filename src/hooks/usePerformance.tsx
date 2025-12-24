import { createContext, useContext, useState, ReactNode, useCallback } from "react";

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
  // PERFORMANCE MODE ON BY DEFAULT
  const [performanceMode, setPerformanceModeState] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("pop-performance-mode");
      // Default to TRUE (performance mode ON) unless explicitly set to false
      if (stored === null) return true;
      return stored !== "false";
    }
    return true; // Default ON
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
        // ALWAYS reduce motion when performance mode is on
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
