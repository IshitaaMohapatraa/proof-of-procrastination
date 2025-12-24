import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { OptimizedParticleField } from "@/components/ui/OptimizedParticleField";
import { PageHeader } from "@/components/ui/PageHeader";
import { AchievementWrappedCard } from "@/components/ui/AchievementWrappedCard";
import { WrappedModal } from "@/components/ui/WrappedModal";
import { useAuth } from "@/hooks/useAuth";
import { useAchievements } from "@/hooks/useAchievements";
import { useProcrastinationChain } from "@/hooks/useProcrastinationChain";
import { usePerformance } from "@/hooks/usePerformance";
import { Sparkles, Loader2 } from "lucide-react";

export const Achievements = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { achievements, chainStats, isLoading } = useAchievements();
  const { chain } = useProcrastinationChain();
  const { reducedMotion } = usePerformance();
  
  const [selectedAchievement, setSelectedAchievement] = useState<{
    code: string;
    name: string;
    icon: string;
    unlockedAt?: string;
  } | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, authLoading, navigate]);

  const unlockedCount = useMemo(() => 
    achievements.filter(a => a.unlocked).length,
    [achievements]
  );

  // Calculate top excuses from chain
  const topExcuses = useMemo(() => {
    const excuseCounts = chain.reduce((acc, block) => {
      acc[block.excuse] = (acc[block.excuse] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(excuseCounts)
      .map(([excuse, count]) => ({ excuse, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [chain]);

  // Calculate mood stats from chain
  const moodStats = useMemo(() => {
    if (chain.length === 0) return [];
    
    const moodCounts = chain.reduce((acc, block) => {
      acc[block.mood] = (acc[block.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = chain.length;
    return Object.entries(moodCounts)
      .map(([mood, count]) => ({
        mood,
        count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, [chain]);

  // Get top activity
  const topActivity = useMemo(() => {
    const entries = Object.entries(chainStats.activityCounts);
    if (entries.length === 0) return null;
    const sorted = entries.sort((a, b) => b[1] - a[1]);
    return { name: sorted[0][0], count: sorted[0][1] };
  }, [chainStats.activityCounts]);

  // Get badges for modal
  const unlockedBadges = useMemo(() => {
    return achievements
      .filter(a => a.unlocked)
      .map(a => ({
        code: a.code,
        name: a.name,
        icon: a.icon,
        unlockedAt: a.unlockedAt,
      }));
  }, [achievements]);

  const handleSelectAchievement = useCallback((achievement: {
    code: string;
    name: string;
    icon: string;
    unlockedAt?: string;
  }) => {
    setSelectedAchievement(achievement);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedAchievement(null);
  }, []);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center animated-gradient">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden animated-gradient">
      <OptimizedParticleField />

      <PageHeader />

      <main className="relative z-10 pt-20 pb-16 px-4 max-w-4xl mx-auto">
        {/* Header - Static, no animations */}
        <div className="text-center mb-10">
          <h1 className={`text-4xl font-heading font-bold mb-2 ${!reducedMotion ? 'text-glow-cyan' : ''}`}>
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
        </div>

        {/* Achievement Grid - Static, no animations */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {achievements.map((achievement) => (
            <div key={achievement.code}>
              <AchievementWrappedCard
                code={achievement.code}
                name={achievement.name}
                description={achievement.description}
                icon={achievement.icon}
                rarity={achievement.rarity}
                unlocked={achievement.unlocked}
                unlockedAt={achievement.unlockedAt}
                onClick={() => handleSelectAchievement({
                  code: achievement.code,
                  name: achievement.name,
                  icon: achievement.icon,
                  unlockedAt: achievement.unlockedAt,
                })}
              />
            </div>
          ))}
        </div>

        {/* Secret hint - Static */}
        <p className="text-center text-sm text-muted-foreground mt-8 italic">
          Psst... there might be a secret achievement. Keep procrastinating to find it.
        </p>
      </main>

      {/* Wrapped Modal - Only renders when open */}
      <WrappedModal
        isOpen={!!selectedAchievement}
        onClose={handleCloseModal}
        achievementName={selectedAchievement?.name || ""}
        achievementIcon={selectedAchievement?.icon || "🏆"}
        totalMinutes={chainStats.totalMinutes}
        topActivity={topActivity}
        topExcuses={topExcuses}
        badges={unlockedBadges}
        longestSession={chainStats.longestSession}
        totalSessions={chainStats.totalSessions}
        unlockedAt={selectedAchievement?.unlockedAt}
        moodStats={moodStats}
      />
    </div>
  );
};
