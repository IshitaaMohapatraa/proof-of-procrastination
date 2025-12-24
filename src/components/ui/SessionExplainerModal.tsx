import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { X, Timer, Smile, MessageCircle, Activity, Zap, Eye } from 'lucide-react';
import { NeonButton } from './NeonButton';

interface SessionExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalSessions: number;
  lastSession?: {
    activity: string;
    duration: number;
    mood: string;
    excuse: string;
  } | null;
  onLogNew?: () => void;
  onViewLast?: () => void;
}

const activityEmojis: Record<string, string> = {
  social_media: "📱",
  gaming: "🎮",
  streaming: "📺",
  snacking: "🍿",
  daydreaming: "💭",
  other: "🎯",
};

const moodEmojis: Record<string, string> = {
  guilty: "😬",
  relaxed: "😌",
  stressed: "😰",
  bored: "😐",
  motivated_to_stop: "💪",
  in_denial: "🙈",
};

export function SessionExplainerModal({
  isOpen,
  onClose,
  totalSessions,
  lastSession,
  onLogNew,
  onViewLast,
}: SessionExplainerModalProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
          />

          {/* Modal Content */}
          <motion.div
            className="relative w-full max-w-md"
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

            <div
              className={`
                relative overflow-hidden rounded-3xl p-6
                ${isDark 
                  ? 'bg-gradient-to-br from-[hsl(320,30%,10%)] via-[hsl(340,40%,12%)] to-[hsl(350,35%,10%)]' 
                  : 'bg-gradient-to-br from-[hsl(340,30%,97%)] via-[hsl(350,40%,96%)] to-[hsl(360,35%,95%)]'
                }
                border-2 ${isDark ? 'border-primary/30' : 'border-primary/20'}
              `}
            >
              {/* Header */}
              <div className="text-center mb-6">
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-4"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Timer className={`w-8 h-8 ${isDark ? 'text-primary text-glow-pink' : 'text-primary'}`} />
                </motion.div>
                <h2 className={`text-2xl font-heading font-bold ${isDark ? 'text-primary text-glow-pink' : 'text-primary'}`}>
                  What's in a Session?
                </h2>
                <p className="text-muted-foreground mt-1">
                  You've logged <span className="font-bold text-foreground">{totalSessions}</span> sessions
                </p>
              </div>

              {/* Session Components Animation */}
              <motion.div
                className={`p-4 rounded-2xl mb-6 ${isDark ? 'bg-muted/30' : 'bg-muted/50'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-center text-sm text-muted-foreground mb-4">Each session captures:</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Activity, label: "Activity Type", color: "text-secondary", delay: 0.3 },
                    { icon: Timer, label: "Duration", color: "text-primary", delay: 0.4 },
                    { icon: Smile, label: "Mood", color: "text-accent", delay: 0.5 },
                    { icon: MessageCircle, label: "Excuse", color: "text-neon-green", delay: 0.6 },
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      className={`flex items-center gap-2 p-2 rounded-lg ${isDark ? 'bg-card/50' : 'bg-card'}`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: item.delay, type: "spring" }}
                    >
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                      <span className="text-xs text-foreground">{item.label}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Last Session Preview */}
              {lastSession && (
                <motion.div
                  className={`p-4 rounded-2xl mb-6 ${isDark ? 'bg-secondary/10 border border-secondary/30' : 'bg-secondary/5 border border-secondary/20'}`}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <p className="text-xs text-muted-foreground mb-3 text-center">Your Last Session</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Activity</span>
                      <span className="text-sm font-medium">
                        {activityEmojis[lastSession.activity] || "🎯"} {lastSession.activity.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Duration</span>
                      <span className="text-sm font-medium">{lastSession.duration}m</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Mood</span>
                      <span className="text-sm font-medium">
                        {moodEmojis[lastSession.mood] || "😐"} {lastSession.mood.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-border/30">
                      <span className="text-xs text-muted-foreground">Excuse:</span>
                      <p className="text-sm italic text-foreground/80 mt-1">"{lastSession.excuse}"</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* CTA Buttons */}
              <motion.div
                className="flex gap-3"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {lastSession && (
                  <NeonButton 
                    variant="secondary"
                    className="flex-1" 
                    onClick={() => {
                      onClose();
                      onViewLast?.();
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Last
                  </NeonButton>
                )}
                <NeonButton 
                  className="flex-1" 
                  onClick={() => {
                    onClose();
                    onLogNew?.();
                  }}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Log New
                </NeonButton>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
