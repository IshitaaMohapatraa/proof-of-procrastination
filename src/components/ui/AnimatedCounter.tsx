import { memo } from "react";
import { cn } from "@/lib/utils";
import { usePerformance } from "@/hooks/usePerformance";

interface AnimatedCounterProps {
  value: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

/**
 * Optimized AnimatedCounter - Static display, no animation
 * Just shows the current value without requestAnimationFrame loops
 */
export const AnimatedCounter = memo(({
  value,
  className,
  prefix = "",
  suffix = "",
}: AnimatedCounterProps) => {
  const { reducedMotion } = usePerformance();
  
  // Format the value - no animation, just display
  const displayValue = value.toString().padStart(2, "0");

  return (
    <div className={cn("flex items-center font-mono", className)}>
      {prefix && <span className="text-muted-foreground mr-2">{prefix}</span>}
      <span>{displayValue}</span>
      {suffix && <span className="text-muted-foreground ml-2">{suffix}</span>}
    </div>
  );
});

AnimatedCounter.displayName = "AnimatedCounter";
