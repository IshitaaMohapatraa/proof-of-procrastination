import { cn } from "@/lib/utils";
import { memo, useMemo } from "react";
import { usePerformance } from "@/hooks/usePerformance";

interface ProcrastinationGaugeProps {
  score: number; // 0-100
  label?: string;
  className?: string;
}

/**
 * Optimized ProcrastinationGauge - Static SVG, no framer-motion animations
 * Renders once and stays static for performance
 */
export const ProcrastinationGauge = memo(({
  score,
  label = "Procrastination Score™",
  className,
}: ProcrastinationGaugeProps) => {
  const { reducedMotion } = usePerformance();
  
  // Memoize calculations
  const { circumference, strokeDashoffset, scoreColor, roast, needleRotation } = useMemo(() => {
    const circ = 2 * Math.PI * 120;
    const offset = circ - (score / 100) * circ * 0.75;
    
    let color = "stroke-neon-green";
    if (score >= 30 && score < 60) color = "stroke-primary";
    else if (score >= 60 && score < 80) color = "stroke-accent";
    else if (score >= 80) color = "stroke-destructive";
    
    let roastText = "Suspiciously productive...";
    if (score >= 30 && score < 50) roastText = "Amateur hour";
    else if (score >= 50 && score < 70) roastText = "Now we're talking";
    else if (score >= 70 && score < 85) roastText = "Professional procrastinator";
    else if (score >= 85) roastText = "Legendary avoidance";
    
    return {
      circumference: circ,
      strokeDashoffset: offset,
      scoreColor: color,
      roast: roastText,
      needleRotation: score * 2.7 - 135,
    };
  }, [score]);

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
        
        {/* Static progress arc - no animation */}
        <circle
          cx="130"
          cy="130"
          r="120"
          fill="none"
          strokeWidth="12"
          className={cn(scoreColor, "drop-shadow-lg")}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            filter: reducedMotion ? undefined : "drop-shadow(0 0 10px currentColor)",
            transition: reducedMotion ? undefined : "stroke-dashoffset 0.3s ease-out",
          }}
        />

        {/* Static Needle */}
        <g
          style={{ 
            transform: `rotate(${needleRotation}deg)`,
            transformOrigin: "130px 130px",
            transition: reducedMotion ? undefined : "transform 0.3s ease-out",
          }}
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
        </g>
      </svg>

      {/* Score display - static */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 text-center">
        <div className={cn(
          "text-5xl font-heading font-bold",
          !reducedMotion && "text-glow-cyan"
        )}>
          {score}
        </div>
        <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
          {label}
        </div>
      </div>

      {/* Roast tooltip - static */}
      <div className="mt-4 text-sm text-accent font-medium">
        "{roast}"
      </div>
    </div>
  );
});

ProcrastinationGauge.displayName = "ProcrastinationGauge";
