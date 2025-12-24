import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';
import { X, Download, Share2, Trophy, Clock, Flame, MessageCircle } from 'lucide-react';
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
}

const activityEmojis: Record<string, string> = {
  social_media: "📱",
  gaming: "🎮",
  streaming: "📺",
  snacking: "🍿",
  daydreaming: "💭",
  other: "🎯",
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
}: WrappedModalProps) {
  const { theme } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';

  // Animated counters
  const animatedMinutes = useAnimatedCounter(isOpen ? totalMinutes : 0, { duration: 2500, delay: 500 });
  const animatedSessions = useAnimatedCounter(isOpen ? totalSessions : 0, { duration: 2000, delay: 700 });
  const animatedLongest = useAnimatedCounter(isOpen ? longestSession : 0, { duration: 2000, delay: 900 });

  const hours = Math.floor(animatedMinutes / 60);
  const minutes = animatedMinutes % 60;

  // Trigger confetti on open
  useEffect(() => {
    if (isOpen) {
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const colors = isDark 
        ? ['#ff6ec7', '#00fff5', '#7f5af0'] 
        : ['#e91e63', '#ff7043', '#9c27b0'];

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

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
      link.download = 'procrastination-wrapped.png';
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
    const text = `🦥 My Procrastination Wrapped\n\n⏰ ${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m wasted\n🏆 ${badges.length} badges earned\n🔥 ${longestSession}m longest session\n\n#ProcrastinationChain`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Procrastination Wrapped',
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

          {/* Modal Content */}
          <motion.div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto"
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
                  ? 'bg-gradient-to-br from-[hsl(240,30%,7%)] via-[hsl(280,40%,12%)] to-[hsl(320,40%,10%)]' 
                  : 'bg-gradient-to-br from-[hsl(340,30%,97%)] via-[hsl(320,40%,95%)] to-[hsl(15,40%,95%)]'
                }
                border-2 ${isDark ? 'border-primary/30' : 'border-primary/20'}
              `}
            >
              {/* Animated background particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute w-1 h-1 rounded-full ${isDark ? 'bg-primary/40' : 'bg-primary/20'}`}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [-20, 20],
                      x: [-10, 10],
                      opacity: [0.2, 0.8, 0.2],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="relative z-10 space-y-6">
                {/* Header */}
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
                    className={`text-3xl font-heading font-bold mb-2 ${isDark ? 'text-primary text-glow-pink' : 'text-primary'}`}
                    animate={{
                      textShadow: isDark ? [
                        "0 0 20px hsl(var(--primary) / 0.8)",
                        "0 0 40px hsl(var(--primary) / 0.5)",
                        "0 0 20px hsl(var(--primary) / 0.8)",
                      ] : undefined,
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {achievementName}
                  </motion.h1>
                  <p className="text-muted-foreground">Your 2024 Wrapped</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <motion.div
                    className={`text-center p-4 rounded-xl ${isDark ? 'bg-muted/30' : 'bg-muted/50'}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    <Clock className="w-5 h-5 text-secondary mx-auto mb-1" />
                    <p className={`text-2xl font-heading font-bold ${isDark ? 'text-secondary text-glow-cyan' : 'text-secondary'}`}>
                      {hours}h {minutes}m
                    </p>
                    <p className="text-xs text-muted-foreground">Total Time</p>
                  </motion.div>

                  <motion.div
                    className={`text-center p-4 rounded-xl ${isDark ? 'bg-muted/30' : 'bg-muted/50'}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                  >
                    <Flame className="w-5 h-5 text-destructive mx-auto mb-1" />
                    <p className={`text-2xl font-heading font-bold ${isDark ? 'text-destructive' : 'text-destructive'}`}>
                      {animatedLongest}m
                    </p>
                    <p className="text-xs text-muted-foreground">Longest</p>
                  </motion.div>

                  <motion.div
                    className={`text-center p-4 rounded-xl ${isDark ? 'bg-muted/30' : 'bg-muted/50'}`}
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
                    className={`text-center p-4 rounded-xl ${isDark ? 'bg-accent/10' : 'bg-accent/5'}`}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <p className="text-sm text-muted-foreground mb-2">Your #1 Distraction</p>
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-4xl">{activityEmojis[topActivity.name] || "🎯"}</span>
                      <div className="text-left">
                        <p className="text-xl font-heading font-bold text-foreground">
                          {topActivity.name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </p>
                        <p className="text-sm text-muted-foreground">{topActivity.count} times this year</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Top Excuses */}
                {topExcuses.length > 0 && (
                  <motion.div
                    className="space-y-2"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Your Greatest Excuses</span>
                    </div>
                    {topExcuses.slice(0, 3).map((item, index) => (
                      <motion.div
                        key={item.excuse}
                        className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-muted/20' : 'bg-muted/40'}`}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                      >
                        <span className="text-xl">{["🥇", "🥈", "🥉"][index]}</span>
                        <p className="text-sm flex-1 italic text-foreground/80">"{item.excuse}"</p>
                        <span className="text-xs text-muted-foreground font-medium">{item.count}x</span>
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
                    transition={{ delay: 1.2 }}
                  >
                    <p className="text-center text-sm text-muted-foreground mb-3">Badges Earned</p>
                    <div className="flex justify-center gap-2 flex-wrap">
                      {badges.map((badge, index) => (
                        <motion.div
                          key={badge.code}
                          className={`text-2xl p-2 rounded-full ${isDark ? 'bg-muted/30' : 'bg-muted/50'}`}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 1.3 + index * 0.05, type: "spring" }}
                          title={badge.name}
                        >
                          {badge.icon}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Watermark */}
                <div className="text-center pt-4">
                  <p className="text-xs text-muted-foreground/50">🦥 Procrastination Chain</p>
                </div>
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
