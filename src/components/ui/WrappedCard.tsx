import { useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';
import { Trophy, Clock, Sparkles, MessageCircle } from 'lucide-react';

interface ExcuseItem {
  excuse: string;
  count: number;
}

interface BadgeItem {
  code: string;
  name: string;
  icon: string;
  unlockedAt?: string;
}

interface WrappedCardProps {
  achievementName: string;
  achievementIcon: string;
  totalMinutes: number;
  topActivity: { name: string; count: number } | null;
  topExcuses: ExcuseItem[];
  badges: BadgeItem[];
  onCardClick?: () => void;
  className?: string;
}

const activityEmojis: Record<string, string> = {
  social_media: "📱",
  gaming: "🎮",
  streaming: "📺",
  snacking: "🍿",
  daydreaming: "💭",
  other: "🎯",
};

const excuseIcons = ["🥇", "🥈", "🥉"];

export function WrappedCard({
  achievementName,
  achievementIcon,
  totalMinutes,
  topActivity,
  topExcuses,
  badges,
  onCardClick,
  className = "",
}: WrappedCardProps) {
  const { theme } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredBadge, setHoveredBadge] = useState<BadgeItem | null>(null);

  // 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  // Animated counter for total time
  const animatedMinutes = useAnimatedCounter(totalMinutes, { duration: 2500, delay: 500 });
  const hours = Math.floor(animatedMinutes / 60);
  const minutes = animatedMinutes % 60;

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  }, [x, y]);

  const isDark = theme === 'dark';

  return (
    <motion.div
      ref={cardRef}
      className={`relative cursor-pointer perspective-1000 ${className}`}
      style={{
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onCardClick}
      whileHover={{ scale: 1.02, z: 50 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Card Container */}
      <div
        className={`
          relative overflow-hidden rounded-3xl p-6 sm:p-8
          ${isDark 
            ? 'bg-gradient-to-br from-[hsl(240,30%,12%)] via-[hsl(280,40%,15%)] to-[hsl(320,40%,12%)]' 
            : 'bg-gradient-to-br from-[hsl(340,30%,97%)] via-[hsl(320,40%,95%)] to-[hsl(15,40%,95%)]'
          }
          border-2 ${isDark ? 'border-primary/30' : 'border-primary/20'}
          transition-all duration-300
        `}
        style={{
          boxShadow: isHovered
            ? isDark
              ? `0 25px 50px -12px hsl(var(--primary) / 0.4), 0 0 60px hsl(var(--primary) / 0.2), inset 0 1px 0 hsl(var(--foreground) / 0.1)`
              : `0 25px 50px -12px hsl(var(--primary) / 0.2), 0 10px 30px hsl(var(--primary) / 0.1)`
            : isDark
              ? `0 10px 30px -10px hsl(var(--primary) / 0.2)`
              : `0 10px 30px -10px hsl(var(--primary) / 0.1)`,
        }}
      >
        {/* Sparkle overlay on hover */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-1 h-1 rounded-full ${isDark ? 'bg-primary' : 'bg-primary/60'}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 2,
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Animated shine effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(105deg, transparent 40%, ${isDark ? 'hsl(var(--primary) / 0.1)' : 'hsl(0 0% 100% / 0.4)'} 45%, ${isDark ? 'hsl(var(--primary) / 0.2)' : 'hsl(0 0% 100% / 0.6)'} 50%, ${isDark ? 'hsl(var(--primary) / 0.1)' : 'hsl(0 0% 100% / 0.4)'} 55%, transparent 60%)`,
          }}
          animate={{
            x: ["-200%", "200%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut",
          }}
        />

        {/* Content */}
        <div className="relative z-10 space-y-6">
          {/* Achievement Header */}
          <div className="text-center">
            <motion.div
              className="text-6xl mb-3"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              {achievementIcon}
            </motion.div>
            <motion.h2
              className={`text-2xl sm:text-3xl font-heading font-bold ${isDark ? 'text-glow-pink text-primary' : 'text-primary'}`}
              animate={{
                textShadow: isDark ? [
                  "0 0 10px hsl(var(--primary) / 0.8)",
                  "0 0 20px hsl(var(--primary) / 0.6)",
                  "0 0 10px hsl(var(--primary) / 0.8)",
                ] : undefined,
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {achievementName}
            </motion.h2>
          </div>

          {/* Total Time Wasted */}
          <div className="text-center py-4 rounded-2xl bg-muted/30 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Total Time Wasted</span>
            </div>
            <motion.div
              className={`text-4xl sm:text-5xl font-heading font-bold ${isDark ? 'text-secondary text-glow-cyan' : 'text-secondary'}`}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              {hours}h {minutes}m
            </motion.div>
          </div>

          {/* Top Activity */}
          {topActivity && (
            <motion.div
              className="text-center py-3 rounded-xl bg-accent/10"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-sm text-muted-foreground mb-1">Go-to Distraction</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">{activityEmojis[topActivity.name] || "🎯"}</span>
                <span className="text-lg font-heading font-semibold text-foreground">
                  {topActivity.name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{topActivity.count} times</p>
            </motion.div>
          )}

          {/* Excuse Leaderboard */}
          {topExcuses.length > 0 && (
            <motion.div
              className="space-y-2"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Top Excuses</span>
              </div>
              {topExcuses.slice(0, 3).map((item, index) => (
                <motion.div
                  key={item.excuse}
                  className={`flex items-center gap-3 p-2 rounded-lg ${isDark ? 'bg-muted/20' : 'bg-muted/40'}`}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <span className="text-lg">{excuseIcons[index]}</span>
                  <p className="text-sm flex-1 italic text-foreground/80 truncate">"{item.excuse}"</p>
                  <span className="text-xs text-muted-foreground">{item.count}x</span>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Badges */}
          {badges.length > 0 && (
            <motion.div
              className="pt-4 border-t border-border/30"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-3">
                <Trophy className="w-4 h-4" />
                <span className="text-sm font-medium">Badges Earned</span>
              </div>
              <div className="flex justify-center gap-2 flex-wrap relative">
                {badges.slice(0, 6).map((badge, index) => (
                  <motion.div
                    key={badge.code}
                    className={`
                      relative text-2xl p-2 rounded-full cursor-pointer
                      ${isDark ? 'bg-muted/30 hover:bg-muted/50' : 'bg-muted/50 hover:bg-muted/70'}
                      transition-colors
                    `}
                    onMouseEnter={() => setHoveredBadge(badge)}
                    onMouseLeave={() => setHoveredBadge(null)}
                    whileHover={{ scale: 1.2, y: -5 }}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 1.1 + index * 0.1, type: "spring" }}
                  >
                    {badge.icon}
                    
                    {/* Badge Tooltip */}
                    {hoveredBadge?.code === badge.code && (
                      <motion.div
                        className={`
                          absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg
                          ${isDark ? 'bg-card border border-primary/30' : 'bg-card shadow-lg'}
                          whitespace-nowrap z-50
                        `}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <p className="text-xs font-semibold text-foreground">{badge.name}</p>
                        {badge.unlockedAt && (
                          <p className="text-xs text-muted-foreground">
                            Unlocked: {new Date(badge.unlockedAt).toLocaleDateString()}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Click hint */}
          <motion.div
            className="flex items-center justify-center gap-2 text-muted-foreground text-xs pt-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-3 h-3" />
            <span>Click to expand</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
