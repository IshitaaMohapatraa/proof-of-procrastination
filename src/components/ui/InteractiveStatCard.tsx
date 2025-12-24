import { useState, useRef, useCallback, memo } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { usePerformance } from '@/hooks/usePerformance';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';

interface InteractiveStatCardProps {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: string;
  tooltip: string;
  glowColor?: 'pink' | 'cyan' | 'violet' | 'green';
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const glowColors = {
  pink: 'hsl(var(--primary))',
  cyan: 'hsl(var(--secondary))',
  violet: 'hsl(var(--accent))',
  green: 'hsl(var(--neon-green))',
};

/**
 * Optimized InteractiveStatCard - No framer-motion, pure CSS
 * Removed 3D tilt effect and complex animations for performance
 */
export const InteractiveStatCard = memo(function InteractiveStatCard({
  icon,
  value,
  label,
  tooltip,
  glowColor = 'cyan',
  onClick,
  className,
  children,
}: InteractiveStatCardProps) {
  const { theme } = useTheme();
  const { reducedMotion } = usePerformance();
  const [showTooltip, setShowTooltip] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isDark = theme === 'dark';

  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  const toggleTooltip = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTooltip(prev => !prev);
  }, []);

  return (
    <div
      className={cn(
        "relative cursor-pointer",
        !reducedMotion && "transition-transform duration-150",
        !reducedMotion && "hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowTooltip(false);
      }}
      onClick={handleClick}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl p-5 backdrop-blur-xl",
          isDark ? "bg-card/80" : "bg-card/90",
          "border border-border/50",
          !reducedMotion && "transition-shadow duration-200"
        )}
        style={{
          boxShadow: isHovered && !reducedMotion
            ? isDark
              ? `0 20px 40px -10px ${glowColors[glowColor]}40, 0 0 30px ${glowColors[glowColor]}20`
              : `0 20px 40px -10px ${glowColors[glowColor]}20, 0 8px 20px hsl(0 0% 0% / 0.1)`
            : isDark
              ? `0 4px 20px -5px hsl(var(--primary) / 0.1)`
              : `0 4px 15px -5px hsl(0 0% 0% / 0.08)`,
        }}
      >
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-4 flex-1">
              <div
                className={cn(
                  "p-3 rounded-xl transition-transform duration-150",
                  glowColor === 'pink' && "bg-primary/20",
                  glowColor === 'cyan' && "bg-secondary/20",
                  glowColor === 'violet' && "bg-accent/20",
                  glowColor === 'green' && "bg-neon-green/20",
                  isHovered && !reducedMotion && "scale-110 rotate-3"
                )}
              >
                {icon}
              </div>
              <div>
                <div className={cn(
                  "text-2xl font-heading font-bold",
                  !reducedMotion && "transition-transform duration-150",
                  isHovered && !reducedMotion && "scale-105"
                )}>
                  {value}
                </div>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            </div>

            {/* Info button */}
            <button
              className={cn(
                "p-1.5 rounded-full transition-colors",
                isDark ? "hover:bg-muted/50" : "hover:bg-muted/70",
                "text-muted-foreground hover:text-foreground",
                !reducedMotion && "hover:scale-110 active:scale-95"
              )}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={toggleTooltip}
            >
              <Info className="w-4 h-4" />
            </button>
          </div>

          {/* Additional content */}
          {children}
        </div>

        {/* Tooltip - simple CSS visibility */}
        {showTooltip && (
          <div
            className={cn(
              "absolute left-0 right-0 top-full mt-2 z-50 p-4 rounded-xl",
              isDark ? "bg-card border border-primary/30" : "bg-card shadow-xl border border-border",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm text-foreground/90 leading-relaxed">{tooltip}</p>
            <div className="mt-2 flex items-center gap-2 text-xs text-primary">
              <span>Click to explore</span>
              <span>→</span>
            </div>
            {/* Arrow pointing up */}
            <div 
              className={cn(
                "absolute -top-2 left-6 w-4 h-4 rotate-45",
                isDark ? "bg-card border-l border-t border-primary/30" : "bg-card border-l border-t border-border"
              )} 
            />
          </div>
        )}
      </div>
    </div>
  );
});
