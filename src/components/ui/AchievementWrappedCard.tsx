import { useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { Lock, Sparkles } from 'lucide-react';

interface AchievementWrappedCardProps {
  code: string;
  name: string;
  description: string;
  icon: string;
  rarity: string;
  unlocked: boolean;
  unlockedAt?: string;
  onClick?: () => void;
}

const rarityGlows: Record<string, { dark: string; light: string }> = {
  Common: { dark: 'hsl(var(--muted-foreground))', light: 'hsl(var(--muted-foreground))' },
  Uncommon: { dark: 'hsl(var(--neon-green))', light: 'hsl(120 60% 40%)' },
  Rare: { dark: 'hsl(var(--primary))', light: 'hsl(var(--primary))' },
  Epic: { dark: 'hsl(var(--accent))', light: 'hsl(var(--accent))' },
  Legendary: { dark: 'hsl(45 100% 50%)', light: 'hsl(45 100% 40%)' },
  Mythic: { dark: 'hsl(var(--destructive))', light: 'hsl(var(--destructive))' },
  Secret: { dark: 'hsl(var(--foreground))', light: 'hsl(var(--foreground))' },
};

const rarityColors: Record<string, string> = {
  Common: "text-muted-foreground",
  Uncommon: "text-neon-green",
  Rare: "text-primary",
  Epic: "text-accent",
  Legendary: "text-yellow-500",
  Mythic: "text-destructive",
  Secret: "text-foreground",
};

export function AchievementWrappedCard({
  code,
  name,
  description,
  icon,
  rarity,
  unlocked,
  unlockedAt,
  onClick,
}: AchievementWrappedCardProps) {
  const { theme } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isDark = theme === 'dark';

  // 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 50 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 50 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current || !unlocked) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }, [x, y, unlocked]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  }, [x, y]);

  const glowColor = rarityGlows[rarity] || rarityGlows.Common;

  return (
    <motion.div
      ref={cardRef}
      className={`relative cursor-pointer perspective-1000 ${!unlocked && 'opacity-40 grayscale pointer-events-none'}`}
      style={{
        transformStyle: "preserve-3d",
        rotateX: unlocked ? rotateX : 0,
        rotateY: unlocked ? rotateY : 0,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => unlocked && setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => unlocked && onClick?.()}
      whileHover={unlocked ? { scale: 1.05, z: 30 } : undefined}
      whileTap={unlocked ? { scale: 0.95 } : undefined}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: unlocked ? 1 : 0.4, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`
          relative overflow-hidden rounded-2xl p-4 h-full
          ${isDark ? 'bg-card/80' : 'bg-card/90'}
          border ${isDark ? 'border-border/50' : 'border-border/30'}
          transition-all duration-300
        `}
        style={{
          boxShadow: isHovered && unlocked
            ? `0 20px 40px -10px ${isDark ? glowColor.dark : glowColor.light}40, 0 0 30px ${isDark ? glowColor.dark : glowColor.light}20`
            : isDark
              ? '0 4px 15px -5px hsl(var(--primary) / 0.1)'
              : '0 4px 15px -5px hsl(0 0% 0% / 0.08)',
        }}
      >
        {/* Sparkle overlay on hover */}
        {isHovered && unlocked && (
          <motion.div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-primary"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 1.5,
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Content */}
        <div className="relative z-10 text-center">
          <motion.div
            className="text-5xl mb-3"
            animate={unlocked && isHovered ? {
              scale: [1, 1.15, 1],
              rotate: [0, 8, -8, 0],
            } : {}}
            transition={{ duration: 0.6 }}
          >
            {unlocked ? icon : <Lock className="w-10 h-10 mx-auto text-muted-foreground" />}
          </motion.div>
          
          <h3 className="font-heading font-semibold text-sm mb-1 text-foreground">
            {name}
          </h3>
          
          <p className={`text-xs mb-2 ${rarityColors[rarity]}`}>
            {rarity}
          </p>

          {unlocked && (
            <motion.div
              className="flex items-center justify-center gap-1 text-xs text-primary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-3 h-3" />
              <span>Click for Wrapped</span>
            </motion.div>
          )}

          {unlocked && unlockedAt && (
            <p className="text-xs text-muted-foreground mt-2">
              {new Date(unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Rarity glow border */}
        {unlocked && isHovered && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              border: `2px solid ${isDark ? glowColor.dark : glowColor.light}`,
              boxShadow: `inset 0 0 20px ${isDark ? glowColor.dark : glowColor.light}30`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </div>
    </motion.div>
  );
}
