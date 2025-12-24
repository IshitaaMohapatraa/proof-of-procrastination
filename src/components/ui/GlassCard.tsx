import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  glowColor?: "cyan" | "violet" | "red";
  hoverable?: boolean;
}

export const GlassCard = ({
  children,
  className,
  glowColor = "cyan",
  hoverable = true,
  ...props
}: GlassCardProps) => {
  const glowClasses = {
    cyan: "hover:shadow-[0_0_30px_hsl(185_100%_50%/0.3)]",
    violet: "hover:shadow-[0_0_30px_hsl(260_70%_60%/0.3)]",
    red: "hover:shadow-[0_0_30px_hsl(345_100%_50%/0.3)]",
  };

  return (
    <motion.div
      className={cn(
        "glass-panel p-6 transition-all duration-300",
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
