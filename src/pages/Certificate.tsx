import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { OptimizedParticleField } from "@/components/ui/OptimizedParticleField";
import { NeonButton } from "@/components/ui/NeonButton";
import { useAuth } from "@/hooks/useAuth";
import { useProcrastinationChain } from "@/hooks/useProcrastinationChain";
import { useAchievements } from "@/hooks/useAchievements";
import { useTheme } from "@/hooks/useTheme";
import { usePerformance } from "@/hooks/usePerformance";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { 
  ArrowLeft, 
  Download, 
  Share2,
  Award,
  Loader2,
  Clock,
  Flame,
  Link2,
  Trophy,
  Sparkles
} from "lucide-react";
import confetti from "canvas-confetti";
import html2canvas from "html2canvas";

const sarcasmSeals = [
  "Certified Procrastinator",
  "Professional Time Waster",
  "Master of Avoidance",
  "Supreme Delay Champion",
];

const excuseEmojis = ["🛋️", "☕", "📱", "🎮", "💤", "🍕"];

export const Certificate = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { chain, validateChainIntegrity } = useProcrastinationChain();
  const { achievements, chainStats } = useAchievements();
  const { theme } = useTheme();
  const { performanceMode } = usePerformance();
  
  const [displayName, setDisplayName] = useState("");
  const [chainValid, setChainValid] = useState(true);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [slothMood, setSlothMood] = useState<"idle" | "clapping" | "winking">("idle");
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);
  const certificateRef = useRef<HTMLDivElement>(null);

  const isDark = theme === 'dark';

  // 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  // Animated counters
  const animatedHours = useAnimatedCounter(isGenerated ? Math.floor(chainStats.totalMinutes / 60) : 0, { duration: 2000, delay: 300 });
  const animatedMinutes = useAnimatedCounter(isGenerated ? chainStats.totalMinutes % 60 : 0, { duration: 2000, delay: 300 });
  const animatedSessions = useAnimatedCounter(isGenerated ? chain.length : 0, { duration: 2000, delay: 500 });
  const animatedLongest = useAnimatedCounter(isGenerated ? chainStats.longestSession : 0, { duration: 2000, delay: 700 });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      setDisplayName(user.email?.split("@")[0] || "Procrastinator");
    }
  }, [user]);

  useEffect(() => {
    validateChainIntegrity().then(result => setChainValid(result.valid));
  }, [chain, validateChainIntegrity]);

  // Auto-generate on mount with delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGenerated(true);
      setSlothMood("clapping");
      setTimeout(() => setSlothMood("idle"), 2000);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const rootHash = chain.length > 0 ? chain[chain.length - 1].current_hash : "0".repeat(64);
  const unlockedBadges = useMemo(() => achievements.filter(a => a.unlocked), [achievements]);
  
  // Get sarcasm level based on time wasted
  const sarcasmLevel = Math.min(Math.floor(chainStats.totalMinutes / 60), 3);

  // Top excuses - memoized
  const topExcuses = useMemo(() => {
    const excuseCounts = chain.reduce((acc, block) => {
      if (block.excuse && block.excuse !== "No excuse provided") {
        acc[block.excuse] = (acc[block.excuse] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(excuseCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }, [chain]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!certificateRef.current) return;
    const rect = certificateRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const handleMouseEnter = () => {
    setSlothMood("winking");
    setTimeout(() => setSlothMood("idle"), 1500);
  };

  const handleDownload = useCallback(async () => {
    if (!certificateRef.current) return;
    
    setIsDownloading(true);
    
    try {
      const canvas = await html2canvas(certificateRef.current, {
        backgroundColor: isDark ? '#0f0f1e' : '#fff0f5',
        scale: 2,
      });
      
      const link = document.createElement('a');
      link.download = `proof-of-procrastination-${displayName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      // Confetti only if not in performance mode
      if (!performanceMode) {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const colors = isDark 
          ? ['#ff6ec7', '#00fff5', '#7f5af0', '#ffd700'] 
          : ['#e91e63', '#ff7043', '#9c27b0', '#ffc107'];

        const interval = setInterval(() => {
          const timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) return clearInterval(interval);

          confetti({
            particleCount: 4,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors,
          });
          confetti({
            particleCount: 4,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors,
          });
        }, 50);
      }

      setSlothMood("clapping");
      setTimeout(() => setSlothMood("idle"), 3000);
    } catch (error) {
      console.error('Failed to generate certificate:', error);
    } finally {
      setIsDownloading(false);
    }
  }, [certificateRef, isDark, displayName, performanceMode]);

  const handleShare = useCallback(() => {
    const text = `🦥 Proof of Procrastination™ Certificate\n\n⏰ I wasted ${Math.floor(chainStats.totalMinutes / 60)}h ${chainStats.totalMinutes % 60}m provably!\n🔗 ${chain.length} blockchain blocks\n🏆 ${unlockedBadges.length} badges earned\n\nCertified by Proof of Procrastination™ #ProcrastinationChain`;
    
    if (navigator.share) {
      navigator.share({ title: 'My Procrastination Certificate', text });
    } else {
      navigator.clipboard.writeText(text);
      if (!performanceMode) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }
    }
  }, [chainStats.totalMinutes, chain.length, unlockedBadges.length, performanceMode]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center animated-gradient">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden animated-gradient">
      <OptimizedParticleField />

      {/* Back Button */}
      <motion.div
        className="fixed top-4 left-4 z-50"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <NeonButton 
          variant="ghost" 
          size="sm"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </NeonButton>
      </motion.div>

      <main className="relative z-10 pt-16 pb-16 px-4 max-w-3xl mx-auto">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className={`text-3xl sm:text-4xl font-heading font-bold mb-2 ${isDark ? 'text-glow-pink text-primary' : 'text-primary'}`}>
            Proof of Procrastination™
          </h1>
          <p className="text-muted-foreground">Your official certificate of time well wasted</p>
        </motion.div>

        {/* Certificate Card */}
        <motion.div
          ref={certificateRef}
          className="perspective-1000 mx-auto"
          style={{
            transformStyle: "preserve-3d",
            rotateX,
            rotateY,
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        >
          <div
            className={`
              relative overflow-hidden rounded-3xl p-6 sm:p-10
              ${isDark 
                ? 'bg-gradient-to-br from-[hsl(240,30%,7%)] via-[hsl(280,40%,10%)] to-[hsl(320,40%,8%)]' 
                : 'bg-gradient-to-br from-[hsl(340,30%,97%)] via-[hsl(320,40%,95%)] to-[hsl(15,40%,93%)]'
              }
              border-4 ${isDark ? 'border-primary/40' : 'border-primary/30'}
            `}
            style={{
              boxShadow: isDark
                ? `0 0 60px hsl(var(--primary) / 0.3), 0 0 100px hsl(var(--primary) / 0.15), inset 0 1px 0 hsl(var(--foreground) / 0.1)`
                : `0 20px 60px -15px hsl(var(--primary) / 0.2)`,
            }}
          >
            {/* Sparkle border animation */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(90deg, transparent, ${isDark ? 'hsl(var(--primary) / 0.3)' : 'hsl(var(--primary) / 0.2)'}, transparent)`,
                backgroundSize: '200% 100%',
              }}
              animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            {/* Decorative corners */}
            <div className={`absolute top-3 left-3 w-10 h-10 border-t-2 border-l-2 ${isDark ? 'border-primary/60' : 'border-primary/40'} rounded-tl-lg`} />
            <div className={`absolute top-3 right-3 w-10 h-10 border-t-2 border-r-2 ${isDark ? 'border-primary/60' : 'border-primary/40'} rounded-tr-lg`} />
            <div className={`absolute bottom-3 left-3 w-10 h-10 border-b-2 border-l-2 ${isDark ? 'border-primary/60' : 'border-primary/40'} rounded-bl-lg`} />
            <div className={`absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 ${isDark ? 'border-primary/60' : 'border-primary/40'} rounded-br-lg`} />

            {/* Content */}
            <div className="relative z-10 space-y-6">
              {/* Header with Avatar & Sloth */}
              <div className="flex items-start justify-between">
                {/* Avatar & Name */}
                <div className="flex items-center gap-3">
                  <motion.div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${isDark ? 'bg-muted/40' : 'bg-muted/60'} border-2 border-primary/30`}
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    🦥
                  </motion.div>
                  <div>
                    <motion.h2
                      className={`text-xl sm:text-2xl font-heading font-bold ${isDark ? 'text-glow-pink text-primary' : 'text-primary'}`}
                      animate={isDark ? {
                        textShadow: [
                          "0 0 10px hsl(var(--primary) / 0.8)",
                          "0 0 20px hsl(var(--primary) / 0.5)",
                          "0 0 10px hsl(var(--primary) / 0.8)",
                        ],
                      } : undefined}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {displayName}
                    </motion.h2>
                    <p className="text-sm text-muted-foreground">Professional Procrastinator</p>
                  </div>
                </div>

                {/* Sloth Mascot */}
                <motion.div
                  className="text-4xl cursor-pointer"
                  animate={
                    slothMood === "clapping" 
                      ? { rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }
                      : slothMood === "winking"
                      ? { scaleY: [1, 0.3, 1] }
                      : { y: [0, -5, 0] }
                  }
                  transition={{ duration: slothMood === "idle" ? 3 : 0.5, repeat: slothMood === "idle" ? Infinity : 0 }}
                >
                  {slothMood === "clapping" ? "👏" : slothMood === "winking" ? "😉" : "🦥"}
                </motion.div>
              </div>

              {/* Certificate Title */}
              <motion.div
                className="text-center py-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div
                  className="inline-block"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Award className={`w-12 h-12 mx-auto mb-2 ${isDark ? 'text-primary' : 'text-primary'}`} />
                </motion.div>
                <h3 className={`text-2xl sm:text-3xl font-heading font-bold ${isDark ? 'text-glow-violet text-accent' : 'text-accent'}`}>
                  {sarcasmSeals[sarcasmLevel]}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">This certifies expert-level time avoidance</p>
              </motion.div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <motion.div
                  className={`text-center p-4 rounded-2xl ${isDark ? 'bg-muted/20' : 'bg-muted/40'}`}
                  whileHover={{ scale: 1.05, boxShadow: isDark ? '0 0 20px hsl(var(--secondary) / 0.3)' : undefined }}
                >
                  <Clock className="w-5 h-5 text-secondary mx-auto mb-1" />
                  <p className={`text-2xl font-heading font-bold ${isDark ? 'text-secondary text-glow-cyan' : 'text-secondary'}`}>
                    {animatedHours}h {animatedMinutes}m
                  </p>
                  <p className="text-xs text-muted-foreground">Time Wasted</p>
                </motion.div>

                <motion.div
                  className={`text-center p-4 rounded-2xl ${isDark ? 'bg-muted/20' : 'bg-muted/40'}`}
                  whileHover={{ scale: 1.05, boxShadow: isDark ? '0 0 20px hsl(var(--accent) / 0.3)' : undefined }}
                >
                  <Link2 className="w-5 h-5 text-accent mx-auto mb-1" />
                  <p className={`text-2xl font-heading font-bold ${isDark ? 'text-accent text-glow-violet' : 'text-accent'}`}>
                    {animatedSessions}
                  </p>
                  <p className="text-xs text-muted-foreground">Sessions</p>
                </motion.div>

                <motion.div
                  className={`text-center p-4 rounded-2xl ${isDark ? 'bg-muted/20' : 'bg-muted/40'}`}
                  whileHover={{ scale: 1.05, boxShadow: isDark ? '0 0 20px hsl(var(--destructive) / 0.3)' : undefined }}
                >
                  <Flame className="w-5 h-5 text-destructive mx-auto mb-1" />
                  <p className={`text-2xl font-heading font-bold text-destructive`}>
                    {animatedLongest}m
                  </p>
                  <p className="text-xs text-muted-foreground">Longest</p>
                </motion.div>
              </div>

              {/* Top Excuses - Horizontal Scroll */}
              {topExcuses.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <p className="text-sm text-muted-foreground mb-2 text-center">Top Excuses</p>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    {topExcuses.map(([excuse, count], index) => (
                      <motion.div
                        key={excuse}
                        className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-full ${isDark ? 'bg-muted/30' : 'bg-muted/50'} border border-border/30`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <span>{excuseEmojis[index % excuseEmojis.length]}</span>
                        <span className="text-xs text-foreground/80 whitespace-nowrap max-w-[120px] truncate">
                          {excuse}
                        </span>
                        <span className="text-xs text-muted-foreground">×{count}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Badges Grid */}
              {unlockedBadges.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="pt-4 border-t border-border/30"
                >
                  <div className="flex items-center justify-center gap-2 text-muted-foreground mb-3">
                    <Trophy className="w-4 h-4" />
                    <span className="text-sm">Badges Earned ({unlockedBadges.length})</span>
                  </div>
                  <div className="flex justify-center gap-2 flex-wrap relative">
                    {unlockedBadges.slice(0, 8).map((badge, index) => (
                      <motion.div
                        key={badge.code}
                        className={`relative text-2xl p-2 rounded-full cursor-pointer ${isDark ? 'bg-muted/30 hover:bg-muted/50' : 'bg-muted/50 hover:bg-muted/70'} transition-colors`}
                        onMouseEnter={() => setHoveredBadge(badge.code)}
                        onMouseLeave={() => setHoveredBadge(null)}
                        whileHover={{ scale: 1.3, y: -5, boxShadow: isDark ? '0 0 15px hsl(var(--primary) / 0.4)' : undefined }}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 1.1 + index * 0.05, type: "spring" }}
                      >
                        {badge.icon}
                        
                        <AnimatePresence>
                          {hoveredBadge === badge.code && (
                            <motion.div
                              className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg ${isDark ? 'bg-card border border-primary/30' : 'bg-card shadow-lg'} whitespace-nowrap z-50`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                            >
                              <p className="text-xs font-semibold text-foreground">{badge.name}</p>
                              <p className="text-xs text-muted-foreground">{badge.description}</p>
                              {badge.unlockedAt && (
                                <p className="text-xs text-primary mt-1">
                                  🎉 {new Date(badge.unlockedAt).toLocaleDateString()}
                                </p>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Root Hash / Sarcasm Seal */}
              <motion.div
                className="flex items-end justify-between pt-4 border-t border-border/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Root Hash</p>
                  <motion.p
                    className={`font-mono text-xs ${isDark ? 'text-secondary/80' : 'text-secondary'} break-all max-w-[200px]`}
                    animate={isDark ? { opacity: [0.7, 1, 0.7] } : undefined}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {rootHash.substring(0, 16)}...{rootHash.substring(rootHash.length - 8)}
                  </motion.p>
                </div>

                {/* Validity Seal */}
                <motion.div
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full
                    ${chainValid 
                      ? isDark ? 'bg-neon-green/20 border border-neon-green/50' : 'bg-green-100 border border-green-300'
                      : isDark ? 'bg-destructive/20 border border-destructive/50' : 'bg-red-100 border border-red-300'
                    }
                  `}
                  animate={isDark ? {
                    boxShadow: chainValid 
                      ? ['0 0 10px hsl(var(--neon-green) / 0.3)', '0 0 20px hsl(var(--neon-green) / 0.5)', '0 0 10px hsl(var(--neon-green) / 0.3)']
                      : undefined,
                  } : undefined}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className={`w-4 h-4 ${chainValid ? 'text-neon-green' : 'text-destructive'}`} />
                  <span className={`text-xs font-mono ${chainValid ? 'text-neon-green' : 'text-destructive'}`}>
                    {chainValid ? "Verified ✓" : "Compromised ⚠"}
                  </span>
                </motion.div>
              </motion.div>

              {/* Date */}
              <p className="text-center text-xs text-muted-foreground/60">
                Generated on {new Date().toLocaleDateString()} • Proof of Procrastination™
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex justify-center gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <NeonButton 
            onClick={handleDownload}
            disabled={isDownloading || chain.length === 0}
            className="min-w-[140px]"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Download PNG
          </NeonButton>
          <NeonButton 
            variant="secondary"
            onClick={handleShare}
            className="min-w-[140px]"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </NeonButton>
        </motion.div>

        {/* Empty state */}
        {chain.length === 0 && (
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="text-muted-foreground mb-4">Start procrastinating to earn your certificate!</p>
            <NeonButton onClick={() => navigate("/log")}>
              Log Your First Session
            </NeonButton>
          </motion.div>
        )}
      </main>
    </div>
  );
};
