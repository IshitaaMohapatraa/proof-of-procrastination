import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ParticleField } from "@/components/ui/ParticleField";
import { NeonButton } from "@/components/ui/NeonButton";
import { AchievementWrappedCard } from "@/components/ui/AchievementWrappedCard";
import { WrappedModal } from "@/components/ui/WrappedModal";
import { useAuth } from "@/hooks/useAuth";
import { useAchievements } from "@/hooks/useAchievements";
import { useProcrastinationChain } from "@/hooks/useProcrastinationChain";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";

export const Achievements = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { achievements, chainStats, isLoading } = useAchievements();
  const { chain } = useProcrastinationChain();
  
  const [selectedAchievement, setSelectedAchievement] = useState<{
    code: string;
    name: string;
    icon: string;
  } | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  // Calculate top excuses from chain
  const excuseCounts = chain.reduce((acc, block) => {
    acc[block.excuse] = (acc[block.excuse] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topExcuses = Object.entries(excuseCounts)
    .map(([excuse, count]) => ({ excuse, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  // Get top activity
  const topActivity = Object.entries(chainStats.activityCounts)
    .sort((a, b) => b[1] - a[1])[0];

  // Get badges for modal
  const unlockedBadges = achievements
    .filter(a => a.unlocked)
    .map(a => ({
      code: a.code,
      name: a.name,
      icon: a.icon,
      unlockedAt: a.unlockedAt,
    }));

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center animated-gradient">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden animated-gradient">
      <ParticleField />

      {/* Back button */}
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-heading font-bold text-glow-cyan mb-2">
            Achievements
          </h1>
          <p className="text-muted-foreground">
            Click any badge for your personal Wrapped card
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/50">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-mono text-sm">
              {unlockedCount} / {achievements.length} Unlocked
            </span>
          </div>
        </motion.div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.code}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <AchievementWrappedCard
                code={achievement.code}
                name={achievement.name}
                description={achievement.description}
                icon={achievement.icon}
                rarity={achievement.rarity}
                unlocked={achievement.unlocked}
                unlockedAt={achievement.unlockedAt}
                onClick={() => setSelectedAchievement({
                  code: achievement.code,
                  name: achievement.name,
                  icon: achievement.icon,
                })}
              />
            </motion.div>
          ))}
        </div>

        {/* Secret hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-sm text-muted-foreground mt-8 italic"
        >
          Psst... there might be a secret achievement. Keep procrastinating to find it.
        </motion.p>
      </main>

      {/* Wrapped Modal */}
      <WrappedModal
        isOpen={!!selectedAchievement}
        onClose={() => setSelectedAchievement(null)}
        achievementName={selectedAchievement?.name || ""}
        achievementIcon={selectedAchievement?.icon || "🏆"}
        totalMinutes={chainStats.totalMinutes}
        topActivity={topActivity ? { name: topActivity[0], count: topActivity[1] } : null}
        topExcuses={topExcuses}
        badges={unlockedBadges}
        longestSession={chainStats.longestSession}
        totalSessions={chainStats.totalSessions}
      />
    </div>
  );
};
