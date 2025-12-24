import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';
import { X, Download, Share2, Trophy, Clock, Flame, MessageCircle, Calendar, BarChart3 } from 'lucide-react';
import { NeonButton } from './NeonButton';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';

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

interface MoodStat {
  mood: string;
  count: number;
  percentage: number;
}

interface WrappedModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievementName: string;
  achievementIcon: string;
  totalMinutes: number;
  topActivity: { name: string; count: number } | null;
  topExcuses: ExcuseItem[];
  badges: BadgeItem[];
  longestSession: number;
  totalSessions: number;
  unlockedAt?: string;
  moodStats?: MoodStat[];
}

const activityEmojis: Record<string, string> = {
  social_media: "📱",
  gaming: "🎮",
  streaming: "📺",
  snacking: "🍿",
  daydreaming: "💭",
  other: "🎯",
};

const activityLabels: Record<string, string> = {
  social_media: "Doomscrolling",
  gaming: "Gaming Marathon",
  streaming: "Binge Watching",
  snacking: "Snack Attack",
  daydreaming: "Space Cadet Mode",
  other: "Mysterious Distraction",
};

const moodEmojis: Record<string, string> = {
  guilty: "😬",
  relaxed: "😌",
  stressed: "😰",
  bored: "😐",
  motivated_to_stop: "💪",
  in_denial: "🙈",
};

const moodColors: Record<string, string> = {
  guilty: "bg-yellow-500",
  relaxed: "bg-neon-green",
  stressed: "bg-destructive",
  bored: "bg-muted-foreground",
  motivated_to_stop: "bg-primary",
  in_denial: "bg-accent",
};

export function WrappedModal({
  isOpen,
  onClose,
  achievementName,
  achievementIcon,
  totalMinutes,
  topActivity,
  topExcuses,
  badges,
  longestSession,
  totalSessions,
  unlockedAt,
  moodStats = [],
}: WrappedModalProps) {
  const { theme } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';
  const [slothReaction, setSlothReaction] = useState<'idle' | 'dance' | 'cheer'>('idle');

  // 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!modalRef.current) return;
    const rect = modalRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  // Animated counters
  const animatedMinutes = useAnimatedCounter(isOpen ? totalMinutes : 0, { duration: 2500, delay: 500 });
  const animatedSessions = useAnimatedCounter(isOpen ? totalSessions : 0, { duration: 2000, delay: 700 });
  const animatedLongest = useAnimatedCounter(isOpen ? longestSession : 0, { duration: 2000, delay: 900 });

  const hours = Math.floor(animatedMinutes / 60);
  const minutes = animatedMinutes % 60;

  // Trigger confetti and sloth reaction on open
  useEffect(() => {
    if (isOpen) {
      // Sloth dance reaction
      setSlothReaction('cheer');
      setTimeout(() => setSlothReaction('dance'), 1500);
      setTimeout(() => setSlothReaction('idle'), 4000);

      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const colors = isDark 
        ? ['#ff6ec7', '#00fff5', '#7f5af0'] 
        : ['#e91e63', '#ff7043', '#9c27b0'];

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isOpen, isDark]);

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: isDark ? '#0f0f1e' : '#fff0f5',
        scale: 2,
      });
      
      const link = document.createElement('a');
      link.download = `${achievementName.toLowerCase().replace(/\s+/g, '-')}-wrapped.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (error) {
      console.error('Failed to generate image:', error);
    }
  };

  const handleShare = () => {
    const activityText = topActivity 
      ? `${activityEmojis[topActivity.name] || "🎯"} ${activityLabels[topActivity.name] || topActivity.name.replace(/_/g, ' ')}`
      : "procrastinating";
    
    const text = `🏆 I earned the "${achievementName}" badge, wasting ${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m on ${activityText} — certified by Proof of Procrastination™\n\n#ProcrastinationChain #ProofOfProcrastination`;
    
    if (navigator.share) {
      navigator.share({
        title: `${achievementName} - Proof of Procrastination`,
        text,
      });
    } else {
      navigator.clipboard.writeText(text);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  const formatUnlockDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Content with 3D tilt */}
          <motion.div
            ref={modalRef}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto perspective-1000"
            style={{
              transformStyle: "preserve-3d",
              rotateX,
              rotateY,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className={`
                absolute -top-2 -right-2 z-10 p-2 rounded-full
                ${isDark ? 'bg-muted hover:bg-muted/80' : 'bg-card shadow-lg hover:bg-muted'}
                transition-colors
              `}
            >
              <X className="w-5 h-5 text-foreground" />
            </button>

            {/* Card for screenshot */}
            <div
              ref={cardRef}
              className={`
                relative overflow-hidden rounded-3xl p-8
                ${isDark 
                  ? 'bg-gradient-to-br from-[#0f0f1e] via-[#1a1a2e] to-[#16213e]' 
                  : 'bg-gradient-to-br from-[#fff0f5] via-[#ffe4e1] to-[#fce4ec]'
                }
                border-2 ${isDark ? 'border-[#ff6ec7]/40' : 'border-primary/30'}
              `}
              style={{
                boxShadow: isDark 
                  ? '0 25px 50px -12px rgba(255, 110, 199, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  : '0 25px 50px -12px rgba(233, 30, 99, 0.15)',
              }}
            >
              {/* Animated background particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(25)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute rounded-full ${isDark ? 'bg-[#ff6ec7]' : 'bg-primary/40'}`}
                    style={{
                      width: Math.random() * 4 + 2,
                      height: Math.random() * 4 + 2,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [-20, 20],
                      x: [-10, 10],
                      opacity: [0.2, 0.8, 0.2],
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>

              {/* Sparkle edge effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none rounded-3xl"
                style={{
                  background: `linear-gradient(90deg, transparent, ${isDark ? 'rgba(255,110,199,0.3)' : 'rgba(233,30,99,0.2)'}, transparent)`,
                  backgroundSize: '200% 100%',
                }}
                animate={{
                  backgroundPosition: ['200% 0', '-200% 0'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />

              {/* Content */}
              <div className="relative z-10 space-y-6">
                {/* Sloth Mascot Reaction */}
                <motion.div
                  className="absolute -top-2 -right-2 text-4xl"
                  animate={
                    slothReaction === 'cheer' 
                      ? { scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] }
                      : slothReaction === 'dance'
                      ? { y: [0, -10, 0], rotate: [0, 10, -10, 0] }
                      : { y: [0, -3, 0] }
                  }
                  transition={{ 
                    duration: slothReaction === 'idle' ? 2 : 0.5, 
                    repeat: Infinity 
                  }}
                >
                  🦥
                </motion.div>

                {/* Header with Badge */}
                <div className="text-center">
                  <motion.div
                    className="text-7xl mb-4"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {achievementIcon}
                  </motion.div>
                  <motion.h1
                    className={`text-3xl font-heading font-bold mb-2`}
                    style={{
                      color: isDark ? '#ff6ec7' : 'hsl(var(--primary))',
                      textShadow: isDark 
                        ? '0 0 30px rgba(255, 110, 199, 0.8), 0 0 60px rgba(255, 110, 199, 0.4)'
                        : '0 2px 10px rgba(233, 30, 99, 0.3)',
                    }}
                  >
                    {achievementName}
                  </motion.h1>
                  <p className="text-muted-foreground text-sm">Your Procrastination Wrapped</p>
                </div>

                {/* Total Time Wasted - Hero Stat */}
                <motion.div
                  className={`text-center p-6 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-black/5'}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  <Clock className={`w-6 h-6 mx-auto mb-2 ${isDark ? 'text-[#ff6ec7]' : 'text-primary'}`} />
                  <motion.p 
                    className={`text-5xl font-heading font-bold mb-1`}
                    style={{
                      color: isDark ? '#00fff5' : 'hsl(var(--secondary))',
                      textShadow: isDark ? '0 0 20px rgba(0, 255, 245, 0.6)' : undefined,
                    }}
                  >
                    {hours}h {minutes}m
                  </motion.p>
                  <p className="text-sm text-muted-foreground">Total Time Wasted</p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.div
                    className={`text-center p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-black/5'}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                  >
                    <Flame className="w-5 h-5 text-destructive mx-auto mb-1" />
                    <p className="text-2xl font-heading font-bold text-destructive">
                      {animatedLongest}m
                    </p>
                    <p className="text-xs text-muted-foreground">Longest Session</p>
                  </motion.div>

                  <motion.div
                    className={`text-center p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-black/5'}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    <Trophy className="w-5 h-5 text-accent mx-auto mb-1" />
                    <p className={`text-2xl font-heading font-bold ${isDark ? 'text-accent text-glow-violet' : 'text-accent'}`}>
                      {animatedSessions}
                    </p>
                    <p className="text-xs text-muted-foreground">Sessions</p>
                  </motion.div>
                </div>

                {/* Top Activity */}
                {topActivity && (
                  <motion.div
                    className={`text-center p-4 rounded-xl ${isDark ? 'bg-[#ff6ec7]/10 border border-[#ff6ec7]/30' : 'bg-primary/5 border border-primary/20'}`}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <p className="text-sm text-muted-foreground mb-2">Your #1 Distraction</p>
                    <div className="flex items-center justify-center gap-3">
                      <motion.span 
                        className="text-5xl"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      >
                        {activityEmojis[topActivity.name] || "🎯"}
                      </motion.span>
                      <div className="text-left">
                        <p className={`text-xl font-heading font-bold ${isDark ? 'text-[#ff6ec7]' : 'text-primary'}`}>
                          {activityLabels[topActivity.name] || topActivity.name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </p>
                        <p className="text-sm text-muted-foreground">{topActivity.count} times</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Mood Distribution */}
                {moodStats && moodStats.length > 0 && (
                  <motion.div
                    className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-black/5'}`}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="flex items-center justify-center gap-2 text-muted-foreground mb-3">
                      <BarChart3 className="w-4 h-4" />
                      <span className="text-sm font-medium">Mood Distribution</span>
                    </div>
                    <div className="flex gap-1 h-4 rounded-full overflow-hidden mb-2">
                      {moodStats.map((stat, index) => (
                        <motion.div
                          key={stat.mood}
                          className={`${moodColors[stat.mood] || 'bg-muted'}`}
                          style={{ width: `${stat.percentage}%` }}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                        />
                      ))}
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {moodStats.slice(0, 3).map((stat) => (
                        <span key={stat.mood} className="text-xs text-muted-foreground flex items-center gap-1">
                          {moodEmojis[stat.mood] || "😐"} {stat.percentage}%
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Top Excuses */}
                {topExcuses.length > 0 && (
                  <motion.div
                    className="space-y-2"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Your Greatest Excuses</span>
                    </div>
                    {topExcuses.slice(0, 3).map((item, index) => (
                      <motion.div
                        key={item.excuse}
                        className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-black/5'}`}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1 + index * 0.1 }}
                      >
                        <span className="text-xl">{["🥇", "🥈", "🥉"][index]}</span>
                        <p className="text-sm flex-1 italic text-foreground/80 truncate">"{item.excuse}"</p>
                        <span className="text-xs text-muted-foreground font-medium">{item.count}x</span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Badges */}
                {badges.length > 0 && (
                  <motion.div
                    className={`pt-4 border-t ${isDark ? 'border-[#ff6ec7]/20' : 'border-primary/20'}`}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.3 }}
                  >
                    <p className="text-center text-sm text-muted-foreground mb-3">Badges Earned</p>
                    <div className="flex justify-center gap-2 flex-wrap">
                      {badges.slice(0, 8).map((badge, index) => (
                        <motion.div
                          key={badge.code}
                          className={`text-2xl p-2 rounded-full ${isDark ? 'bg-white/10' : 'bg-black/5'}`}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 1.4 + index * 0.05, type: "spring" }}
                          whileHover={{ scale: 1.2, y: -3 }}
                          title={badge.name}
                        >
                          {badge.icon}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Unlock Date & Watermark */}
                <motion.div 
                  className="text-center pt-4 space-y-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  {unlockedAt && (
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>Unlocked {formatUnlockDate(unlockedAt)}</span>
                    </div>
                  )}
                  <p className={`text-xs ${isDark ? 'text-[#ff6ec7]/50' : 'text-primary/50'}`}>
                    🦥 Proof of Procrastination™
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Action Buttons */}
            <motion.div
              className="flex justify-center gap-3 mt-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <NeonButton variant="secondary" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </NeonButton>
              <NeonButton size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </NeonButton>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
