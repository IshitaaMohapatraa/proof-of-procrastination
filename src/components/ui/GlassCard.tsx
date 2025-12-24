import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  glowColor?: "pink" | "cyan" | "violet" | "red";
  hoverable?: boolean;
}

export const GlassCard = ({
  children,
  className,
  glowColor = "pink",
  hoverable = true,
  ...props
}: GlassCardProps) => {
  const glowClasses = {
    pink: "hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)]",
    cyan: "hover:shadow-[0_0_30px_hsl(var(--secondary)/0.3)]",
    violet: "hover:shadow-[0_0_30px_hsl(var(--accent)/0.3)]",
    red: "hover:shadow-[0_0_30px_hsl(var(--destructive)/0.3)]",
  };

  return (
    <motion.div
      className={cn(
        "glass-panel p-6 transition-all duration-300 theme-transition",
        hoverable && glowClasses[glowColor],
        className
      )}
      whileHover={hoverable ? { scale: 1.02, y: -4 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
