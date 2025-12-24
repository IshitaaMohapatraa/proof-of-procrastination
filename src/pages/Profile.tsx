import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { OptimizedParticleField } from "@/components/ui/OptimizedParticleField";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { WrappedCard } from "@/components/ui/WrappedCard";
import { WrappedModal } from "@/components/ui/WrappedModal";
import { SlothMascot } from "@/components/ui/SlothMascot";
import { useAuth } from "@/hooks/useAuth";
import { useAchievements } from "@/hooks/useAchievements";
import { useProcrastinationChain } from "@/hooks/useProcrastinationChain";
import { 
  ArrowLeft, 
  Clock, 
  Link2, 
  Trophy, 
  Flame,
  Loader2
} from "lucide-react";

const activityLabels: Record<string, string> = {
  social_media: "Social Media",
  gaming: "Gaming",
  streaming: "Streaming",
  snacking: "Snacking",
  daydreaming: "Daydreaming",
  other: "Other",
};

export const Profile = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { achievements, chainStats } = useAchievements();
  const { chain } = useProcrastinationChain();
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Memoized calculations
  const { totalHours, totalMinutes, longestSession } = useMemo(() => ({
    totalHours: Math.floor(chainStats.totalMinutes / 60),
    totalMinutes: chainStats.totalMinutes % 60,
    longestSession: chainStats.longestSession,
  }), [chainStats.totalMinutes, chainStats.longestSession]);
  
  const mostCommonActivity = useMemo(() => {
    const activityCounts = chain.reduce((acc, block) => {
      acc[block.activity_type] = (acc[block.activity_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(activityCounts).sort(([, a], [, b]) => b - a)[0];
  }, [chain]);

  const topExcuses = useMemo(() => {
    const excuseCounts = chain.reduce((acc, block) => {
      if (block.excuse && block.excuse !== "No excuse provided") {
        acc[block.excuse] = (acc[block.excuse] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(excuseCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([excuse, count]) => ({ excuse, count }));
  }, [chain]);

  const { equippedBadges, unlockedBadges, topAchievement } = useMemo(() => ({
    equippedBadges: achievements.filter(a => a.unlocked).slice(0, 3),
    unlockedBadges: achievements
      .filter(a => a.unlocked)
      .map(a => ({
        code: a.code,
        name: a.name,
        icon: a.icon,
        unlockedAt: a.unlockedAt,
      })),
    topAchievement: achievements.find(a => a.unlocked) || {
      name: "Procrastinator",
      icon: "🦥",
    },
  }), [achievements]);

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

      <main className="relative z-10 pt-20 pb-16 px-4 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <SlothMascot size="xl" className="mb-4" />
          <h1 className="text-4xl font-heading font-bold text-glow-cyan mb-2">
            {user?.email?.split("@")[0] || "Procrastinator"}
          </h1>
          <p className="text-muted-foreground">Professional Time Waster</p>
        </motion.div>

        {/* Equipped Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h3 className="text-lg font-heading font-semibold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Equipped Badges
          </h3>
          <div className="flex gap-4 justify-center">
            {equippedBadges.length > 0 ? equippedBadges.map((badge) => (
              <motion.div
                key={badge.code}
                className="text-center"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: Math.random() }}
              >
                <GlassCard className="p-4" hoverable glowColor="cyan">
                  <span className="text-4xl">{badge.icon}</span>
                  <p className="text-xs text-muted-foreground mt-2">{badge.name}</p>
                </GlassCard>
              </motion.div>
            )) : (
              <p className="text-muted-foreground">No badges unlocked yet</p>
            )}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard hoverable>
              <Clock className="w-6 h-6 text-primary mb-2" />
              <p className="text-3xl font-heading font-bold text-primary">
                {totalHours}h {totalMinutes}m
              </p>
              <p className="text-sm text-muted-foreground">Total Time Wasted</p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard hoverable>
              <Link2 className="w-6 h-6 text-accent mb-2" />
              <p className="text-3xl font-heading font-bold text-accent">
                {chain.length}
              </p>
              <p className="text-sm text-muted-foreground">Chain Blocks</p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard hoverable>
              <Flame className="w-6 h-6 text-destructive mb-2" />
              <p className="text-3xl font-heading font-bold text-destructive">
                {longestSession}m
              </p>
              <p className="text-sm text-muted-foreground">Longest Session</p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GlassCard hoverable>
              <Trophy className="w-6 h-6 text-accent mb-2" />
              <p className="text-3xl font-heading font-bold text-accent">
                {achievements.filter(a => a.unlocked).length}
              </p>
              <p className="text-sm text-muted-foreground">Achievements</p>
            </GlassCard>
          </motion.div>
        </div>

        {/* Procrastination Wrapped Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-2xl font-heading font-bold text-center mb-6 text-glow-violet">
            🎁 Your Procrastination Wrapped
          </h3>

          {chain.length > 0 ? (
            <WrappedCard
              achievementName={topAchievement.name}
              achievementIcon={topAchievement.icon}
              totalMinutes={chainStats.totalMinutes}
              topActivity={mostCommonActivity ? {
                name: mostCommonActivity[0],
                count: mostCommonActivity[1],
              } : null}
              topExcuses={topExcuses}
              badges={unlockedBadges}
              onCardClick={() => setIsModalOpen(true)}
              className="max-w-md mx-auto"
            />
          ) : (
            <GlassCard glowColor="violet" className="text-center py-8 max-w-md mx-auto">
              <p className="text-muted-foreground">Start procrastinating to see your wrapped!</p>
              <NeonButton className="mt-4" onClick={() => navigate("/log")}>
                Log Your First Session
              </NeonButton>
            </GlassCard>
          )}
        </motion.div>

        {/* Wrapped Modal */}
        <WrappedModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          achievementName={topAchievement.name}
          achievementIcon={topAchievement.icon}
          totalMinutes={chainStats.totalMinutes}
          topActivity={mostCommonActivity ? {
            name: mostCommonActivity[0],
            count: mostCommonActivity[1],
          } : null}
          topExcuses={topExcuses}
          badges={unlockedBadges}
          longestSession={longestSession}
          totalSessions={chain.length}
        />
      </main>
    </div>
  );
};
