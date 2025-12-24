import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProcrastinationGaugeProps {
  score: number; // 0-100
  label?: string;
  className?: string;
}

export const ProcrastinationGauge = ({
  score,
  label = "Procrastination Score™",
  className,
}: ProcrastinationGaugeProps) => {
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (score / 100) * circumference * 0.75;

  const getScoreColor = () => {
    if (score < 30) return "stroke-neon-green";
    if (score < 60) return "stroke-primary";
    if (score < 80) return "stroke-accent";
    return "stroke-destructive";
  };

  const getRoast = () => {
    if (score < 30) return "Suspiciously productive...";
    if (score < 50) return "Amateur hour";
    if (score < 70) return "Now we're talking";
    if (score < 85) return "Professional procrastinator";
    return "Legendary avoidance";
  };

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <svg
        className="w-64 h-64 transform -rotate-[135deg]"
        viewBox="0 0 260 260"
      >
        {/* Background arc */}
        <circle
          cx="130"
          cy="130"
          r="120"
          fill="none"
          strokeWidth="12"
          stroke="hsl(var(--muted))"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
        />
        
        {/* Animated progress arc */}
        <motion.circle
          cx="130"
          cy="130"
          r="120"
          fill="none"
          strokeWidth="12"
          className={cn(getScoreColor(), "drop-shadow-lg")}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 2, ease: "easeOut" }}
          strokeLinecap="round"
          style={{
            filter: "drop-shadow(0 0 10px currentColor)",
          }}
        />

        {/* Needle */}
        <motion.g
          initial={{ rotate: 0 }}
          animate={{ rotate: score * 2.7 - 135 }}
          transition={{ 
            duration: 2, 
            ease: "easeOut",
            type: "spring",
            stiffness: 60,
            damping: 15
          }}
          style={{ transformOrigin: "130px 130px" }}
        >
          <line
            x1="130"
            y1="130"
            x2="130"
            y2="40"
            stroke="hsl(var(--foreground))"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle
            cx="130"
            cy="130"
            r="8"
            fill="hsl(var(--foreground))"
          />
        </motion.g>
      </svg>

      {/* Score display */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 text-center">
        <motion.div
          className="text-5xl font-heading font-bold text-glow-cyan"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
        >
          {score}
        </motion.div>
        <motion.div
          className="text-xs text-muted-foreground uppercase tracking-widest mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          {label}
        </motion.div>
      </div>

      {/* Roast tooltip */}
      <motion.div
        className="mt-4 text-sm text-accent font-medium"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5 }}
      >
        "{getRoast()}"
      </motion.div>
    </div>
  );
};
