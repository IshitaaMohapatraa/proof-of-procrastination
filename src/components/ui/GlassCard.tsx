import { cn } from "@/lib/utils";
import { ReactNode, memo } from "react";
import { usePerformance } from "@/hooks/usePerformance";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "pink" | "cyan" | "violet" | "red";
  hoverable?: boolean;
  onClick?: () => void;
}

/**
 * Optimized GlassCard - No framer-motion, pure CSS transitions
 * Hover effects are CSS-only for instant response
 */
export const GlassCard = memo(({
  children,
  className,
  glowColor = "pink",
  hoverable = true,
  onClick,
}: GlassCardProps) => {
  const { reducedMotion } = usePerformance();

  const glowClasses = {
    pink: "hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)]",
    cyan: "hover:shadow-[0_0_30px_hsl(var(--secondary)/0.3)]",
    violet: "hover:shadow-[0_0_30px_hsl(var(--accent)/0.3)]",
    red: "hover:shadow-[0_0_30px_hsl(var(--destructive)/0.3)]",
  };

  return (
    <div
      className={cn(
        "glass-panel p-6 theme-transition",
        // Only add hover effects if not in reduced motion mode
        !reducedMotion && hoverable && "transition-all duration-200",
        !reducedMotion && hoverable && "hover:scale-[1.02] hover:-translate-y-1",
        !reducedMotion && hoverable && glowClasses[glowColor],
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
});

GlassCard.displayName = "GlassCard";
