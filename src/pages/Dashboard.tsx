import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ParticleField } from "@/components/ui/ParticleField";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { ProcrastinationGauge } from "@/components/ui/ProcrastinationGauge";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { InteractiveStatCard } from "@/components/ui/InteractiveStatCard";
import { ChainExplainerModal } from "@/components/ui/ChainExplainerModal";
import { SessionExplainerModal } from "@/components/ui/SessionExplainerModal";
import { useAuth } from "@/hooks/useAuth";
import { useProcrastinationChain } from "@/hooks/useProcrastinationChain";
import { useAchievements } from "@/hooks/useAchievements";
import { useTheme } from "@/hooks/useTheme";
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
  
  const [currentRoast] = useState(roasts[Math.floor(Math.random() * roasts.length)]);
  const [chainIntegrity, setChainIntegrity] = useState<{ valid: boolean; broken_at: number | null }>({ valid: true, broken_at: null });
  const [timeWasted, setTimeWasted] = useState(0);
  const [hashCopied, setHashCopied] = useState(false);
  const [showChainModal, setShowChainModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const isDark = theme === 'dark';

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Calculate time wasted from chain
  useEffect(() => {
    const totalSeconds = chainStats.totalMinutes * 60;
    setTimeWasted(totalSeconds);
  }, [chainStats.totalMinutes]);

  // Slowly increment time wasted for effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeWasted((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Validate chain integrity
  useEffect(() => {
    if (chain.length > 0) {
      validateChainIntegrity().then(setChainIntegrity);
    }
  }, [chain, validateChainIntegrity]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return { hours, minutes, seconds: seconds % 60 };
  };

  const time = formatTime(timeWasted);
  const latestHash = chain.length > 0 ? chain[chain.length - 1].current_hash : "0".repeat(64);
  const shortHash = `0x${latestHash.substring(0, 6)}...${latestHash.substring(latestHash.length - 4)}`;
  const unlockedAchievements = achievements.filter((a) => a.unlocked).slice(0, 5);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleCopyHash = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(latestHash);
    setHashCopied(true);
    setTimeout(() => setHashCopied(false), 2000);
  };

  const handleHashClick = () => {
    // Navigate to chain viewer with highlight on latest block
    navigate("/chain", { state: { highlightLatest: true } });
  };

  const handleChainLengthClick = () => {
    setShowChainModal(true);
  };

  const handleSessionsClick = () => {
    setShowSessionModal(true);
  };

  // Get last session for modal
  const lastSession = chain.length > 0 ? {
    activity: chain[chain.length - 1].activity_type,
    duration: chain[chain.length - 1].duration_minutes,
    mood: chain[chain.length - 1].mood,
    excuse: chain[chain.length - 1].excuse,
  } : null;

  if (authLoading || chainLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center animated-gradient">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden animated-gradient">
      <ParticleField />
      
      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 p-4"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.h2 
            className="font-heading font-bold text-xl text-primary cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/")}
          >
            PoP™
          </motion.h2>
          <div className="flex gap-4">
            <NeonButton 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/analytics")}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </NeonButton>
            <NeonButton 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/settings")}
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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 text-muted-foreground mb-4"
            animate={{ opacity: [0.7, 1, 0.7] }}
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
            initial={{ opacity: 0 }}
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
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-1"
          >
            <GlassCard className="h-full flex items-center justify-center">
              <ProcrastinationGauge score={Math.min(100, Math.floor(chainStats.totalMinutes / 10))} />
            </GlassCard>
          </motion.div>

          {/* Main CTA and Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Log Procrastination CTA */}
            <GlassCard className="text-center py-10">
              <motion.div
                animate={{ 
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
                  onClick={() => navigate("/log")}
                  className="group"
                >
                  <Zap className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                  Log Procrastination
                  <motion.span
                    className="ml-3 opacity-50"
                    animate={{ x: [0, 5, 0] }}
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
          initial={{ opacity: 0, y: 30 }}
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
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <AnimatePresence mode="wait">
                    {hashCopied ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Check className="w-4 h-4 text-neon-green" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
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
                      animate={{ scale: [1, 1.2, 1] }}
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
                initial={{ opacity: 0, height: 0 }}
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
          initial={{ opacity: 0, y: 30 }}
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
              onClick={() => navigate("/achievements")}
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
                  initial={{ opacity: 0, y: 20 }}
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
              <GlassCard className="min-w-[200px] text-center opacity-50">
                <p className="text-sm text-muted-foreground">
                  No achievements yet. Start procrastinating!
                </p>
              </GlassCard>
            )}
          </div>
        </motion.section>
      </main>

      {/* Bottom gradient */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-40" />

      {/* Modals */}
      <ChainExplainerModal
        isOpen={showChainModal}
        onClose={() => setShowChainModal(false)}
        chainLength={chain.length}
        onViewChain={() => navigate("/chain", { state: { scrollToTop: true } })}
      />

      <SessionExplainerModal
        isOpen={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        totalSessions={chainStats.totalSessions}
        lastSession={lastSession}
        onLogNew={() => navigate("/log")}
        onViewLast={() => navigate("/log", { state: { showLastSession: true } })}
      />
    </div>
  );
};
