import { useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { OptimizedParticleField } from "@/components/ui/OptimizedParticleField";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useAuth } from "@/hooks/useAuth";
import { useAnalytics } from "@/hooks/useAnalytics";
import { usePerformance } from "@/hooks/usePerformance";
import { ArrowLeft, TrendingUp, Clock, Calendar, Loader2 } from "lucide-react";

const activityLabels: Record<string, string> = {
  social_media: "Social Media",
  gaming: "Gaming",
  streaming: "Streaming",
  snacking: "Snacking",
  daydreaming: "Daydreaming",
  other: "Other",
};

export const Analytics = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { 
    totalMinutes, 
    totalSessions, 
    averageSessionMinutes, 
    longestSession,
    weeklyData, 
    activityBreakdown,
    isLoading,
    hasData
  } = useAnalytics();
  const { reducedMotion } = usePerformance();

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Memoize stats calculation
  const stats = useMemo(() => [
    { label: "Total Time This Week", value: `${Math.round(weeklyData.reduce((sum, d) => sum + d.minutes, 0) / 60 * 10) / 10}h`, trend: hasData ? "+Growing" : "Start logging!" },
    { label: "Average Session", value: `${averageSessionMinutes}min`, trend: hasData ? "Consistent" : "-" },
    { label: "Longest Session", value: `${longestSession}min`, trend: hasData ? "Personal Best!" : "-" },
    { label: "Total Sessions", value: `${totalSessions}`, trend: hasData ? "Active procrastinator" : "None yet" },
  ], [weeklyData, averageSessionMinutes, longestSession, totalSessions, hasData]);

  const maxHours = useMemo(() => 
    Math.max(...weeklyData.map(d => d.hours), 1),
    [weeklyData]
  );

  const handleBack = useCallback(() => {
    navigate("/dashboard", { replace: true });
  }, [navigate]);

  const handleLogFirst = useCallback(() => {
    navigate("/log");
  }, [navigate]);

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

      {/* Back button */}
      <motion.div
        className="fixed top-4 left-4 z-50"
        initial={reducedMotion ? {} : { opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <NeonButton 
          variant="ghost" 
          size="sm"
          onClick={handleBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </NeonButton>
      </motion.div>

      <main className="relative z-10 pt-20 pb-16 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-heading font-bold text-glow-cyan mb-2">
            Analytics
          </h1>
          <p className="text-muted-foreground">
            Statistically impressive avoidance
          </p>
        </motion.div>

        {!hasData ? (
          <GlassCard className="text-center py-16">
            <p className="text-muted-foreground mb-4">No data yet. Start procrastinating to see your stats!</p>
            <NeonButton onClick={handleLogFirst}>
              Log Your First Session
            </NeonButton>
          </GlassCard>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard hoverable>
                    <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                    <p className="text-3xl font-heading font-bold text-primary">
                      {stat.value}
                    </p>
                    <p className="text-sm text-neon-green mt-2 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {stat.trend}
                    </p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Weekly Bar Chart */}
              <motion.div
                initial={reducedMotion ? {} : { opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <GlassCard className="h-full">
                  <div className="flex items-center gap-2 mb-6">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-heading font-semibold">Weekly Overview</h3>
                  </div>
                  
                  <div className="flex items-end justify-between h-48 gap-2">
                    {weeklyData.map((day, index) => (
                      <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                        <motion.div
                          className="w-full bg-gradient-to-t from-primary to-accent rounded-t-lg relative group"
                          initial={reducedMotion ? {} : { height: 0 }}
                          animate={{ height: `${(day.hours / maxHours) * 100}%` }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                          style={{
                            boxShadow: "0 0 20px hsl(185 100% 50% / 0.3)",
                            minHeight: day.hours > 0 ? "8px" : "0px",
                          }}
                        >
                          <motion.div
                            className="absolute -top-8 left-1/2 -translate-x-1/2 bg-card px-2 py-1 rounded text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                          >
                            {day.hours}h
                          </motion.div>
                        </motion.div>
                        <span className="text-xs text-muted-foreground">{day.day}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-sm text-muted-foreground text-center mt-4 italic">
                    "Weekend warrior of procrastination"
                  </p>
                </GlassCard>
              </motion.div>

              {/* Activity Breakdown */}
              <motion.div
                initial={reducedMotion ? {} : { opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <GlassCard className="h-full">
                  <div className="flex items-center gap-2 mb-6">
                    <Clock className="w-5 h-5 text-accent" />
                    <h3 className="text-lg font-heading font-semibold">How You Waste Time</h3>
                  </div>

                  <div className="space-y-4">
                    {activityBreakdown.slice(0, 5).map((item, index) => (
                      <motion.div
                        key={item.activity}
                        initial={reducedMotion ? {} : { opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      >
                        <ProgressBar
                          value={item.percentage}
                          label={activityLabels[item.activity] || item.activity}
                          variant={index === 0 ? "cyan" : index === 1 ? "violet" : "gradient"}
                        />
                      </motion.div>
                    ))}
                  </div>

                  <motion.p
                    initial={reducedMotion ? {} : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="text-sm text-accent text-center mt-6 italic"
                  >
                    "Your phone is judging you"
                  </motion.p>
                </GlassCard>
              </motion.div>
            </div>

            {/* Roast Section */}
            <motion.div
              initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-8"
            >
              <GlassCard className="text-center py-8" glowColor="violet">
                <h3 className="text-xl font-heading font-semibold mb-4">
                  AI-Generated Roast 🔥
                </h3>
                <motion.p
                  className="text-lg text-muted-foreground max-w-xl mx-auto"
                  animate={reducedMotion ? {} : { opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  "Based on your data, you've spent {Math.round(totalMinutes / 60)} hours procrastinating. 
                  That's enough time to {totalMinutes > 120 ? "learn a new skill" : "take a nice nap"}. 
                  <span className="text-accent"> Priorities.</span>"
                </motion.p>
              </GlassCard>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
};
