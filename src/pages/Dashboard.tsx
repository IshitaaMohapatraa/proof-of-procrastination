import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { OptimizedParticleField } from "@/components/ui/OptimizedParticleField";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { ProcrastinationGauge } from "@/components/ui/ProcrastinationGauge";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { InteractiveStatCard } from "@/components/ui/InteractiveStatCard";
import { useAuth } from "@/hooks/useAuth";
import { useProcrastinationChain } from "@/hooks/useProcrastinationChain";
import { useAchievements } from "@/hooks/useAchievements";
import { useTheme } from "@/hooks/useTheme";
import { usePerformance } from "@/hooks/usePerformance";
import { 
  Clock, 
  Trophy, 
  Link2, 
  Timer, 
  BarChart3, 
  Award,
  Settings,
  Zap,
  LogOut,
  Loader2,
  Hash,
  Copy,
  Check,
  AlertTriangle
} from "lucide-react";

// Lazy load modals
const ChainExplainerModal = lazy(() => import("@/components/ui/ChainExplainerModal").then(m => ({ default: m.ChainExplainerModal })));
const SessionExplainerModal = lazy(() => import("@/components/ui/SessionExplainerModal").then(m => ({ default: m.SessionExplainerModal })));

const roasts = [
  "You could've learned Kubernetes.",
  "That's 47 TikToks you didn't even watch.",
  "Your plants miss you. Probably.",
  "Somewhere, a deadline is crying.",
  "Productivity gurus hate this one trick.",
];

const TOOLTIPS = {
  latestHash: "This is a SHA-256 hash of your latest procrastination session. It's a cryptographic fingerprint that ensures your procrastination history is immutable and tamper-proof. Each block links to the previous one!",
  chainLength: "This is the total number of procrastination blocks you've created. Each block represents a logged session, linked cryptographically to form an unbreakable chain of avoidance.",
  totalSessions: "Total sessions logged. Each session contains your activity type, mood, duration, and excuse - all linked together cryptographically to prove your procrastination prowess!",
};

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { chain, isLoading: chainLoading, validateChainIntegrity } = useProcrastinationChain();
  const { achievements, chainStats } = useAchievements();
  const { theme } = useTheme();
  const { reducedMotion } = usePerformance();
  
  // Memoize static values
  const currentRoast = useMemo(() => roasts[Math.floor(Math.random() * roasts.length)], []);
  
  const [chainIntegrity, setChainIntegrity] = useState<{ valid: boolean; broken_at: number | null }>({ valid: true, broken_at: null });
  const [timeWasted, setTimeWasted] = useState(0);
  const [hashCopied, setHashCopied] = useState(false);
  const [showChainModal, setShowChainModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const isDark = theme === 'dark';

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Memoize time calculation
  const baseTimeSeconds = useMemo(() => chainStats.totalMinutes * 60, [chainStats.totalMinutes]);

  // Initialize time wasted
  useEffect(() => {
    setTimeWasted(baseTimeSeconds);
  }, [baseTimeSeconds]);

  // Slowly increment time wasted for effect - only when not in reduced motion
  useEffect(() => {
    if (reducedMotion) return;
    
    const interval = setInterval(() => {
      setTimeWasted((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [reducedMotion]);

  // Validate chain integrity - memoize the validation call
  useEffect(() => {
    if (chain.length > 0) {
      validateChainIntegrity().then(setChainIntegrity);
    }
  }, [chain.length, validateChainIntegrity]);

  // Memoize computed values
  const time = useMemo(() => {
    const hours = Math.floor(timeWasted / 3600);
    const minutes = Math.floor((timeWasted % 3600) / 60);
    return { hours, minutes, seconds: timeWasted % 60 };
  }, [timeWasted]);

  const { latestHash, shortHash } = useMemo(() => {
    const hash = chain.length > 0 ? chain[chain.length - 1].current_hash : "0".repeat(64);
    return {
      latestHash: hash,
      shortHash: `0x${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`,
    };
  }, [chain]);

  const unlockedAchievements = useMemo(
    () => achievements.filter((a) => a.unlocked).slice(0, 5),
    [achievements]
  );

  const procrastinationScore = useMemo(
    () => Math.min(100, Math.floor(chainStats.totalMinutes / 10)),
    [chainStats.totalMinutes]
  );

  const lastSession = useMemo(() => {
    if (chain.length === 0) return null;
    const last = chain[chain.length - 1];
    return {
      activity: last.activity_type,
      duration: last.duration_minutes,
      mood: last.mood,
      excuse: last.excuse,
    };
  }, [chain]);

  // Memoize callbacks
  const handleSignOut = useCallback(async () => {
    await signOut();
    navigate("/", { replace: true });
  }, [signOut, navigate]);

  const handleCopyHash = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(latestHash);
    setHashCopied(true);
    setTimeout(() => setHashCopied(false), 2000);
  }, [latestHash]);

  const handleHashClick = useCallback(() => {
    navigate("/chain", { state: { highlightLatest: true } });
  }, [navigate]);

  const handleChainLengthClick = useCallback(() => {
    setShowChainModal(true);
  }, []);

  const handleSessionsClick = useCallback(() => {
    setShowSessionModal(true);
  }, []);

  const handleLogClick = useCallback(() => {
    navigate("/log");
  }, [navigate]);

  const handleAnalyticsClick = useCallback(() => {
    navigate("/analytics");
  }, [navigate]);

  const handleSettingsClick = useCallback(() => {
    navigate("/settings");
  }, [navigate]);

  const handleAchievementsClick = useCallback(() => {
    navigate("/achievements");
  }, [navigate]);

  if (authLoading || chainLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center animated-gradient">
        <motion.div
          animate={reducedMotion ? {} : { rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden animated-gradient">
      <OptimizedParticleField />
      
      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 p-4"
        initial={reducedMotion ? {} : { y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.h2 
            className="font-heading font-bold text-xl text-primary cursor-pointer"
            whileHover={reducedMotion ? {} : { scale: 1.05 }}
            onClick={() => navigate("/")}
          >
            PoP™
          </motion.h2>
          <div className="flex gap-4">
            <NeonButton 
              variant="ghost" 
              size="sm"
              onClick={handleAnalyticsClick}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </NeonButton>
            <NeonButton 
              variant="ghost" 
              size="sm"
              onClick={handleSettingsClick}
            >
              <Settings className="w-4 h-4" />
            </NeonButton>
            <NeonButton 
              variant="ghost" 
              size="sm"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4" />
            </NeonButton>
          </div>
        </div>
      </motion.nav>

      {/* Main content */}
      <main className="relative z-10 pt-24 pb-16 px-4 max-w-7xl mx-auto">
        {/* Hero - Time Wasted Counter */}
        <motion.section 
          className="text-center mb-16"
          initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 text-muted-foreground mb-4"
            animate={reducedMotion ? {} : { opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Clock className="w-5 h-5" />
            <span className="uppercase tracking-widest text-sm">Total Time Wasted</span>
          </motion.div>

          <div className="flex justify-center items-baseline gap-2 mb-4">
            <div className="flex items-baseline gap-1">
              <AnimatedCounter 
                value={time.hours} 
                className="text-7xl md:text-9xl font-heading font-bold text-primary text-glow-cyan"
              />
              <span className="text-2xl text-muted-foreground">h</span>
            </div>
            <div className="flex items-baseline gap-1">
              <AnimatedCounter 
                value={time.minutes} 
                className="text-7xl md:text-9xl font-heading font-bold text-accent text-glow-violet"
              />
              <span className="text-2xl text-muted-foreground">m</span>
            </div>
            <div className="flex items-baseline gap-1">
              <AnimatedCounter 
                value={time.seconds} 
                className="text-7xl md:text-9xl font-heading font-bold text-foreground/80"
              />
              <span className="text-2xl text-muted-foreground">s</span>
            </div>
          </div>

          <motion.p 
            className="text-lg text-muted-foreground italic"
            initial={reducedMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            "{currentRoast}"
          </motion.p>
        </motion.section>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-16">
          {/* Procrastination Gauge */}
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-1"
          >
            <GlassCard className="h-full flex items-center justify-center">
              <ProcrastinationGauge score={procrastinationScore} />
            </GlassCard>
          </motion.div>

          {/* Main CTA and Stats */}
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Log Procrastination CTA */}
            <GlassCard className="text-center py-10">
              <motion.div
                animate={reducedMotion ? {} : { 
                  boxShadow: [
                    "0 0 20px hsl(185 100% 50% / 0.3)",
                    "0 0 40px hsl(185 100% 50% / 0.4)",
                    "0 0 20px hsl(185 100% 50% / 0.3)",
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block rounded-2xl"
              >
                <NeonButton 
                  size="xl" 
                  onClick={handleLogClick}
                  className="group"
                >
                  <Zap className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                  Log Procrastination
                  <motion.span
                    className="ml-3 opacity-50"
                    animate={reducedMotion ? {} : { x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </NeonButton>
              </motion.div>
              <p className="text-sm text-muted-foreground mt-4">
                Add your latest avoidance to the immutable chain
              </p>
            </GlassCard>

            {/* Interactive Quick Stats */}
            <div className="grid md:grid-cols-2 gap-4">
              <InteractiveStatCard
                icon={<Link2 className="w-6 h-6 text-accent" />}
                value={chain.length}
                label="Chain Length"
                tooltip={TOOLTIPS.chainLength}
                glowColor="violet"
                onClick={handleChainLengthClick}
              />
              
              <InteractiveStatCard
                icon={<Timer className="w-6 h-6 text-primary" />}
                value={chainStats.totalSessions}
                label="Total Sessions"
                tooltip={TOOLTIPS.totalSessions}
                glowColor="pink"
                onClick={handleSessionsClick}
              />
            </div>
          </motion.div>
        </div>

        {/* Latest Block Hash - Interactive */}
        <motion.section
          initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-16"
        >
          <InteractiveStatCard
            icon={<Hash className={`w-6 h-6 ${isDark ? 'text-secondary' : 'text-secondary'}`} />}
            value={
              <span className={`font-mono text-lg ${isDark ? 'text-glow-pink text-primary' : 'text-primary'}`}>
                {shortHash}
              </span>
            }
            label="Latest Block Hash"
            tooltip={TOOLTIPS.latestHash}
            glowColor="cyan"
            onClick={handleHashClick}
          >
            <div className="mt-4 space-y-3">
              {/* Full hash display */}
              <div className={`p-3 rounded-xl ${isDark ? 'bg-muted/20' : 'bg-muted/40'} flex items-center justify-between gap-3`}>
                <code className="text-xs font-mono text-muted-foreground truncate flex-1">
                  {latestHash}
                </code>
                <motion.button
                  onClick={handleCopyHash}
                  className={`p-2 rounded-lg ${isDark ? 'hover:bg-muted/50' : 'hover:bg-muted/70'} transition-colors`}
                  whileHover={reducedMotion ? {} : { scale: 1.1 }}
                  whileTap={reducedMotion ? {} : { scale: 0.9 }}
                >
                  <AnimatePresence mode="wait">
                    {hashCopied ? (
                      <motion.div
                        key="check"
                        initial={reducedMotion ? {} : { scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={reducedMotion ? {} : { scale: 0 }}
                      >
                        <Check className="w-4 h-4 text-neon-green" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={reducedMotion ? {} : { scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={reducedMotion ? {} : { scale: 0 }}
                      >
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>

              {/* Chain integrity */}
              <div className={`flex items-center gap-3 p-3 rounded-xl ${
                chainIntegrity.valid 
                  ? isDark ? 'bg-neon-green/10 border border-neon-green/30' : 'bg-green-50 border border-green-200'
                  : isDark ? 'bg-destructive/10 border border-destructive/30' : 'bg-red-50 border border-red-200'
              }`}>
                {chainIntegrity.valid ? (
                  <>
                    <motion.div
                      animate={reducedMotion ? {} : { scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Check className="w-5 h-5 text-neon-green" />
                    </motion.div>
                    <span className={`text-sm ${isDark ? 'text-neon-green' : 'text-green-700'}`}>
                      Chain Verified • All {chain.length} blocks intact
                    </span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    <span className={`text-sm ${isDark ? 'text-destructive' : 'text-red-700'}`}>
                      Chain Broken at Block #{chainIntegrity.broken_at}
                    </span>
                  </>
                )}
              </div>

              {/* Explanation panel */}
              <motion.div
                className={`p-3 rounded-xl ${isDark ? 'bg-primary/5 border border-primary/20' : 'bg-primary/5 border border-primary/10'}`}
                initial={reducedMotion ? {} : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">SHA-256 Hash:</span> A cryptographic fingerprint of your session data.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="font-semibold text-foreground">Prev Hash:</span> Links to the previous session, ensuring chain integrity.
                </p>
              </motion.div>
            </div>
          </InteractiveStatCard>
        </motion.section>

        {/* Achievements */}
        <motion.section
          initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-heading font-semibold">Achievements</h3>
            </div>
            <NeonButton 
              variant="ghost" 
              size="sm"
              onClick={handleAchievementsClick}
            >
              View All
              <Award className="w-4 h-4 ml-2" />
            </NeonButton>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {unlockedAchievements.length > 0 ? (
              unlockedAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.code}
                  initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                >
                  <GlassCard 
                    className="min-w-[140px] text-center"
                    hoverable
                    glowColor="cyan"
                  >
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <p className="text-sm font-medium">{achievement.name}</p>
                  </GlassCard>
                </motion.div>
              ))
            ) : (
              <GlassCard className="w-full text-center py-8">
                <Trophy className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No achievements yet. Start procrastinating!</p>
              </GlassCard>
            )}
          </div>
        </motion.section>
      </main>

      {/* Lazy-loaded Modals */}
      <Suspense fallback={null}>
        {showChainModal && (
          <ChainExplainerModal
            isOpen={showChainModal}
            onClose={() => setShowChainModal(false)}
            chainLength={chain.length}
            onViewChain={() => {
              setShowChainModal(false);
              navigate("/chain");
            }}
          />
        )}
      </Suspense>

      <Suspense fallback={null}>
        {showSessionModal && (
          <SessionExplainerModal
            isOpen={showSessionModal}
            onClose={() => setShowSessionModal(false)}
            totalSessions={chainStats.totalSessions}
            lastSession={lastSession}
            onViewLast={() => {
              setShowSessionModal(false);
              navigate("/chain");
            }}
            onLogNew={() => {
              setShowSessionModal(false);
              navigate("/log");
            }}
          />
        )}
      </Suspense>
    </div>
  );
};
