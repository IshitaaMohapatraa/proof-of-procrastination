import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ParticleField } from "@/components/ui/ParticleField";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { ProgressBar } from "@/components/ui/ProgressBar";
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
  Share2,
  Loader2
} from "lucide-react";
import confetti from "canvas-confetti";

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
  
  const [showWrapped, setShowWrapped] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Calculate wrapped stats
  const totalHours = Math.floor(chainStats.totalMinutes / 60);
  const totalMinutes = chainStats.totalMinutes % 60;
  const longestSession = chainStats.longestSession;
  
  // Most common activity
  const activityCounts = chain.reduce((acc, block) => {
    acc[block.activity_type] = (acc[block.activity_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostCommonActivity = Object.entries(activityCounts)
    .sort(([, a], [, b]) => b - a)[0];

  // Mood breakdown
  const moodCounts = chain.reduce((acc, block) => {
    acc[block.mood] = (acc[block.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Top excuses
  const excuseCounts = chain.reduce((acc, block) => {
    if (block.excuse && block.excuse !== "No excuse provided") {
      acc[block.excuse] = (acc[block.excuse] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  const topExcuses = Object.entries(excuseCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const equippedBadges = achievements.filter(a => a.unlocked).slice(0, 3);

  const handleShare = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#00f5ff', '#7f5af0'],
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center animated-gradient">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden animated-gradient">
      <ParticleField />

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
              <Trophy className="w-6 h-6 text-yellow-500 mb-2" />
              <p className="text-3xl font-heading font-bold text-yellow-500">
                {achievements.filter(a => a.unlocked).length}
              </p>
              <p className="text-sm text-muted-foreground">Achievements</p>
            </GlassCard>
          </motion.div>
        </div>

        {/* Procrastination Wrapped */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <GlassCard glowColor="violet" className="relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            
            <div className="relative z-10">
              <h3 className="text-2xl font-heading font-bold text-center mb-6 text-glow-violet">
                🎁 Your Procrastination Wrapped
              </h3>

              {chain.length > 0 ? (
                <div className="space-y-6">
                  {/* Most Common Activity */}
                  {mostCommonActivity && (
                    <div className="text-center p-4 bg-muted/30 rounded-xl">
                      <p className="text-sm text-muted-foreground mb-2">Your go-to distraction</p>
                      <p className="text-3xl font-heading font-bold text-primary">
                        {activityLabels[mostCommonActivity[0]] || mostCommonActivity[0]}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {mostCommonActivity[1]} times
                      </p>
                    </div>
                  )}

                  {/* Mood Breakdown */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-3 text-center">How you felt while procrastinating</p>
                    <div className="space-y-2">
                      {Object.entries(moodCounts).slice(0, 4).map(([mood, count]) => (
                        <ProgressBar
                          key={mood}
                          value={(count / chain.length) * 100}
                          label={mood}
                          variant="gradient"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Top Excuses */}
                  {topExcuses.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-3 text-center">Top excuses used</p>
                      <div className="space-y-2">
                        {topExcuses.map(([excuse, count], index) => (
                          <div key={excuse} className="flex items-center gap-3 p-2 bg-muted/20 rounded-lg">
                            <span className="text-lg">{index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}</span>
                            <p className="text-sm flex-1 italic">"{excuse}"</p>
                            <span className="text-xs text-muted-foreground">{count}x</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Share Button */}
                  <div className="text-center pt-4">
                    <NeonButton variant="secondary" onClick={handleShare}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Your Wrapped
                    </NeonButton>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Start procrastinating to see your wrapped!</p>
                  <NeonButton className="mt-4" onClick={() => navigate("/log")}>
                    Log Your First Session
                  </NeonButton>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </main>
    </div>
  );
};
