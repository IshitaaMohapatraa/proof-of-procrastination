import { cn } from "@/lib/utils";
import { ReactNode, ButtonHTMLAttributes, memo } from "react";
import { usePerformance } from "@/hooks/usePerformance";

interface NeonButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
  glowing?: boolean;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

/**
 * Optimized NeonButton - No framer-motion, pure CSS transitions
 * Click/hover effects are CSS-only for instant response
 */
export const NeonButton = memo(({
  children,
  className,
  variant = "primary",
  size = "md",
  glowing = true,
  disabled,
  onClick,
}: NeonButtonProps) => {
  const { reducedMotion } = usePerformance();
  
  // Disable glow effects in performance mode
  const showGlow = glowing && !reducedMotion;

  const variants = {
    primary: cn(
      "bg-primary/20 text-primary border-primary/50",
      "hover:bg-primary/30 hover:border-primary",
      showGlow && "glow-pink"
    ),
    secondary: cn(
      "bg-accent/20 text-accent border-accent/50",
      "hover:bg-accent/30 hover:border-accent",
      showGlow && "glow-violet"
    ),
    danger: cn(
      "bg-destructive/20 text-destructive border-destructive/50",
      "hover:bg-destructive/30 hover:border-destructive",
      showGlow && "glow-red"
    ),
    ghost: cn(
      "bg-transparent text-foreground/70 border-border",
      "hover:bg-muted/30 hover:text-foreground hover:border-muted-foreground/30"
    ),
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-12 py-6 text-xl",
  };

  return (
    <button
      className={cn(
        "relative font-heading font-semibold border-2 rounded-xl",
        "transition-all duration-150 cursor-pointer",
        // CSS-only hover/active effects - no framer-motion
        !reducedMotion && "hover:scale-105 active:scale-[0.98]",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      onClick={onClick}
    >
      <span className="relative z-10 flex items-center justify-center">{children}</span>
    </button>
  );
});

NeonButton.displayName = "NeonButton";
