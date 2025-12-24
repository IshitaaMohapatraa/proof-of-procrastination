import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  variant?: "cyan" | "violet" | "gradient";
  className?: string;
}

export const ProgressBar = ({
  value,
  max = 100,
  label,
  showValue = true,
  variant = "gradient",
  className,
}: ProgressBarProps) => {
  const percentage = Math.min((value / max) * 100, 100);

  const barVariants = {
    cyan: "bg-primary",
    violet: "bg-accent",
    gradient: "bg-gradient-to-r from-primary via-accent to-primary",
  };

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm text-muted-foreground">{label}</span>
          )}
          {showValue && (
            <span className="text-sm font-mono text-primary">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
        <motion.div
          className={cn(
            "h-full rounded-full",
            barVariants[variant]
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            boxShadow: "0 0 20px currentColor",
          }}
        />
      </div>
    </div>
  );
};
