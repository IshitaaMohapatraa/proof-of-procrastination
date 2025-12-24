import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ParticleField } from "@/components/ui/ParticleField";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { useAuth } from "@/hooks/useAuth";
import { useAchievements } from "@/hooks/useAchievements";
import { ArrowLeft, Lock, Sparkles, Loader2 } from "lucide-react";

const rarityColors: Record<string, string> = {
  Common: "text-muted-foreground",
  Uncommon: "text-neon-green",
  Rare: "text-primary",
  Epic: "text-accent",
  Legendary: "text-yellow-500",
  Mythic: "text-destructive",
  Secret: "text-foreground",
};

export const Achievements = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { achievements, isLoading } = useAchievements();
  
  const [selectedAchievement, setSelectedAchievement] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;

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
            Badges of dishonor for your laziness
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
              <motion.div
                whileHover={achievement.unlocked ? { 
                  scale: 1.05, 
                  rotateY: 15,
                  rotateX: -5 
                } : undefined}
                transition={{ type: "spring", stiffness: 300 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <GlassCard 
                  className={`text-center cursor-pointer h-full ${
                    !achievement.unlocked && "opacity-40 grayscale"
                  }`}
                  hoverable={achievement.unlocked}
                  onClick={() => setSelectedAchievement(
                    selectedAchievement === achievement.code ? null : achievement.code
                  )}
                >
                  <motion.div 
                    className="text-5xl mb-3"
                    animate={achievement.unlocked ? {
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    } : {}}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      repeatDelay: index * 0.5 
                    }}
                  >
                    {achievement.unlocked ? achievement.icon : (
                      <Lock className="w-12 h-12 mx-auto text-muted-foreground" />
                    )}
                  </motion.div>
                  <h3 className="font-heading font-semibold text-sm mb-1">
                    {achievement.name}
                  </h3>
                  <p className={`text-xs ${rarityColors[achievement.rarity]}`}>
                    {achievement.rarity}
                  </p>
                  
                  {selectedAchievement === achievement.code && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/30"
                    >
                      {achievement.description}
                    </motion.p>
                  )}
                </GlassCard>
              </motion.div>
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
    </div>
  );
};
