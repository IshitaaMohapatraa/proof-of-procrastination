import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ParticleField } from "@/components/ui/ParticleField";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { ProcrastinationGauge } from "@/components/ui/ProcrastinationGauge";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { HashDisplay, generateFakeHash } from "@/components/ui/HashDisplay";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { 
  Clock, 
  Trophy, 
  Link2, 
  Timer, 
  BarChart3, 
  Award,
  Settings,
  Zap
} from "lucide-react";

// Mock data
const mockAchievements = [
  { id: 1, name: "First Delay", icon: "🐌", unlocked: true },
  { id: 2, name: "Hour Waster", icon: "⏰", unlocked: true },
  { id: 3, name: "Serial Snoozer", icon: "😴", unlocked: true },
  { id: 4, name: "Deadline Dancer", icon: "💃", unlocked: false },
  { id: 5, name: "Week Wrecker", icon: "📅", unlocked: false },
];

const roasts = [
  "You could've learned Kubernetes.",
  "That's 47 TikToks you didn't even watch.",
  "Your plants miss you. Probably.",
  "Somewhere, a deadline is crying.",
  "Productivity gurus hate this one trick.",
];

export const Dashboard = () => {
  const navigate = useNavigate();
  const [timeWasted, setTimeWasted] = useState(14523);
  const [currentRoast] = useState(roasts[Math.floor(Math.random() * roasts.length)]);
  const [latestHash] = useState(generateFakeHash());

  // Slowly increment time wasted
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeWasted(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return { hours, minutes, seconds: seconds % 60 };
  };

  const time = formatTime(timeWasted);

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
              <ProcrastinationGauge score={73} />
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

            {/* Quick Stats */}
            <div className="grid md:grid-cols-2 gap-4">
              <GlassCard hoverable glowColor="violet">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-accent/20">
                    <Link2 className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-bold">247</p>
                    <p className="text-sm text-muted-foreground">Chain Length</p>
                  </div>
                </div>
              </GlassCard>
              
              <GlassCard hoverable>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/20">
                    <Timer className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-bold">2h 34m</p>
                    <p className="text-sm text-muted-foreground">Current Session</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </motion.div>
        </div>

        {/* Latest Block Hash */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-16"
        >
          <GlassCard>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-heading font-semibold mb-1">Latest Block Hash</h3>
                <p className="text-sm text-muted-foreground">Cryptographically verified laziness</p>
              </div>
              <HashDisplay hash={latestHash} />
            </div>
            <ProgressBar 
              value={87} 
              label="Chain Integrity" 
              className="mt-4"
            />
          </GlassCard>
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
            {mockAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                style={{ 
                  y: Math.sin(index * 0.5) * 5 
                }}
              >
                <GlassCard 
                  className={`min-w-[140px] text-center ${
                    !achievement.unlocked && "opacity-50 grayscale"
                  }`}
                  hoverable={achievement.unlocked}
                  glowColor={achievement.unlocked ? "cyan" : "violet"}
                >
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  <p className="text-sm font-medium">{achievement.name}</p>
                  {!achievement.unlocked && (
                    <p className="text-xs text-muted-foreground mt-1">Locked</p>
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      {/* Bottom gradient */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-40" />
    </div>
  );
};
