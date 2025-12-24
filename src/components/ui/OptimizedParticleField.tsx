import { memo } from "react";
import { useTheme } from "@/hooks/useTheme";
import { usePerformance } from "@/hooks/usePerformance";

/**
 * Optimized ParticleField - Static gradient background only
 * No canvas, no animation loop, no requestAnimationFrame
 * Just a simple CSS gradient for visual depth
 */
export const OptimizedParticleField = memo(() => {
  const { theme } = useTheme();
  const { performanceMode, reducedMotion } = usePerformance();

  // Always return static gradient - no animations ever
  // This eliminates the entire canvas animation loop
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: theme === "dark" 
          ? "radial-gradient(ellipse at center, hsl(270 50% 15% / 0.3) 0%, transparent 70%)"
          : "radial-gradient(ellipse at center, hsl(330 50% 95% / 0.5) 0%, transparent 70%)",
      }}
    />
  );
});

OptimizedParticleField.displayName = "OptimizedParticleField";
