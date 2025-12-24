import { useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
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

export function InteractiveStatCard({
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
  const cardRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isDark = theme === 'dark';

  // 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 50 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 50 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);
  const translateZ = useTransform(mouseXSpring, [-0.5, 0.5], ["0px", "10px"]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
    setShowTooltip(false);
  }, [x, y]);

  const handleClick = () => {
    onClick?.();
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "relative cursor-pointer perspective-1000",
        className
      )}
      style={{
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      whileHover={{ scale: 1.02, z: 20 }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl p-5 backdrop-blur-xl transition-all duration-300",
          isDark ? "bg-card/80" : "bg-card/90",
          "border border-border/50"
        )}
        style={{
          boxShadow: isHovered
            ? isDark
              ? `0 20px 40px -10px ${glowColors[glowColor]}40, 0 0 30px ${glowColors[glowColor]}20, inset 0 1px 0 hsl(var(--foreground) / 0.05)`
              : `0 20px 40px -10px ${glowColors[glowColor]}20, 0 8px 20px hsl(0 0% 0% / 0.1)`
            : isDark
              ? `0 4px 20px -5px hsl(var(--primary) / 0.1)`
              : `0 4px 15px -5px hsl(0 0% 0% / 0.08)`,
        }}
      >
        {/* Glow overlay on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                background: `radial-gradient(circle at 50% 50%, ${glowColors[glowColor]}10 0%, transparent 70%)`,
              }}
            />
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-4 flex-1">
              <motion.div
                className={cn(
                  "p-3 rounded-xl transition-colors",
                  glowColor === 'pink' && "bg-primary/20",
                  glowColor === 'cyan' && "bg-secondary/20",
                  glowColor === 'violet' && "bg-accent/20",
                  glowColor === 'green' && "bg-neon-green/20",
                )}
                animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
              >
                {icon}
              </motion.div>
              <div>
                <motion.div
                  className="text-2xl font-heading font-bold"
                  animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
                >
                  {value}
                </motion.div>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            </div>

            {/* Info button */}
            <motion.button
              className={cn(
                "p-1.5 rounded-full transition-colors",
                isDark ? "hover:bg-muted/50" : "hover:bg-muted/70",
                "text-muted-foreground hover:text-foreground"
              )}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(!showTooltip);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Info className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Additional content */}
          {children}
        </div>

        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              className={cn(
                "absolute left-0 right-0 top-full mt-2 z-50 p-4 rounded-xl",
                isDark ? "bg-card border border-primary/30" : "bg-card shadow-xl border border-border",
              )}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-sm text-foreground/90 leading-relaxed">{tooltip}</p>
              <motion.div
                className="mt-2 flex items-center gap-2 text-xs text-primary"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span>Click to explore</span>
                <span>→</span>
              </motion.div>
              {/* Arrow pointing up */}
              <div 
                className={cn(
                  "absolute -top-2 left-6 w-4 h-4 rotate-45",
                  isDark ? "bg-card border-l border-t border-primary/30" : "bg-card border-l border-t border-border"
                )} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Click ripple effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={false}
        />
      </div>
    </motion.div>
  );
}
