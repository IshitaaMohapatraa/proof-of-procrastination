import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { OptimizedParticleField } from "@/components/ui/OptimizedParticleField";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { PageHeader } from "@/components/ui/PageHeader";
import { useTheme } from "@/hooks/useTheme";
import { usePerformance } from "@/hooks/usePerformance";
import { 
  Palette, 
  Volume2, 
  Sparkles, 
  Info,
  Moon,
  Sun,
  Zap,
  Gauge
} from "lucide-react";

interface ToggleProps {
  enabled: boolean;
  onToggle: () => void;
  label: string;
  description: string;
  icon?: React.ReactNode;
}

const Toggle = ({ enabled, onToggle, label, description, icon }: ToggleProps) => (
  <div className="flex items-center justify-between py-4 border-b border-border/30 last:border-0">
    <div className="flex items-center gap-3">
      {icon && <div className="text-primary">{icon}</div>}
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
    <motion.button
      onClick={onToggle}
      className={`relative w-14 h-8 rounded-full transition-colors ${
        enabled ? "bg-primary" : "bg-muted"
      }`}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute top-1 w-6 h-6 rounded-full bg-foreground dark:bg-background"
        animate={{ left: enabled ? "calc(100% - 28px)" : "4px" }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </motion.button>
  </div>
);

export const Settings = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme, chaosMode, toggleChaosMode } = useTheme();
  const { performanceMode, togglePerformanceMode } = usePerformance();
  const [activeTab, setActiveTab] = useState("ui");
  
  // UI Settings
  const [extraNeon, setExtraNeon] = useState(true);
  
  // Sound Settings
  const [soundEffects, setSoundEffects] = useState(true);
  const [sadTrombone, setSadTrombone] = useState(true);
  
  // Chaos Settings
  const [judgmentalPopups, setJudgmentalPopups] = useState(true);
  const [randomRoasts, setRandomRoasts] = useState(true);

  const tabs = [
    { id: "ui", label: "UI", icon: Palette },
    { id: "sound", label: "Sound", icon: Volume2 },
    { id: "chaos", label: "Chaos Mode", icon: Sparkles },
    { id: "about", label: "About", icon: Info },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden animated-gradient">
      <OptimizedParticleField />

      <PageHeader />

      <main className="relative z-10 pt-20 pb-16 px-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-heading font-bold text-glow-pink mb-2">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Configure your procrastination experience
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-6 overflow-x-auto pb-2"
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-primary/20 text-primary border border-primary/50"
                  : "bg-muted/30 text-muted-foreground hover:text-foreground"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "ui" && (
            <GlassCard>
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-heading font-semibold">UI Settings</h3>
              </div>
              
              {/* Theme Toggle - Main feature */}
              <div className="flex items-center justify-between py-4 border-b border-border/30">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="text-primary"
                    animate={{ rotate: theme === "dark" ? 0 : 180 }}
                    transition={{ duration: 0.5 }}
                  >
                    {theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  </motion.div>
                  <div>
                    <p className="font-medium">
                      {theme === "dark" ? "Dark Mode (Neon)" : "Light Mode (Pastel)"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {theme === "dark" 
                        ? "Cyberpunk vibes with neon glows" 
                        : "Soft dating app aesthetic"}
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={toggleTheme}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    theme === "dark" ? "bg-primary" : "bg-secondary"
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute top-1 w-6 h-6 rounded-full bg-foreground dark:bg-background flex items-center justify-center"
                    animate={{ left: theme === "dark" ? "4px" : "calc(100% - 28px)" }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {theme === "dark" ? (
                      <Moon className="w-3 h-3 text-primary" />
                    ) : (
                      <Sun className="w-3 h-3 text-secondary" />
                    )}
                  </motion.div>
                </motion.button>
              </div>

              <Toggle
                enabled={extraNeon}
                onToggle={() => setExtraNeon(!extraNeon)}
                label="Extra Neon"
                description="Maximum glow for maximum guilt"
              />
              
              {/* Performance Mode Toggle */}
              <div className="flex items-center justify-between py-4 border-b border-border/30">
                <div className="flex items-center gap-3">
                  <div className="text-accent">
                    <Gauge className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Performance Mode</p>
                    <p className="text-sm text-muted-foreground">
                      Disables heavy animations for smoother experience
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={togglePerformanceMode}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    performanceMode ? "bg-accent" : "bg-muted"
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute top-1 w-6 h-6 rounded-full bg-foreground dark:bg-background"
                    animate={{ left: performanceMode ? "calc(100% - 28px)" : "4px" }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </motion.button>
              </div>
            </GlassCard>
          )}

          {activeTab === "sound" && (
            <GlassCard>
              <div className="flex items-center gap-2 mb-4">
                <Volume2 className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-heading font-semibold">Sound Settings</h3>
              </div>
              <Toggle
                enabled={soundEffects}
                onToggle={() => setSoundEffects(!soundEffects)}
                label="Sound Effects"
                description="UI swooshes and chain clinks"
              />
              <Toggle
                enabled={sadTrombone}
                onToggle={() => setSadTrombone(!sadTrombone)}
                label="Sad Trombone on Errors"
                description="Womp womp"
              />
            </GlassCard>
          )}

          {activeTab === "chaos" && (
            <GlassCard glowColor="red">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-destructive" />
                <h3 className="text-lg font-heading font-semibold">Chaos Mode</h3>
              </div>
              
              {/* Main Chaos Toggle */}
              <div className="flex items-center justify-between py-4 border-b border-border/30">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="text-destructive"
                    animate={chaosMode ? { 
                      rotate: [0, 10, -10, 10, 0],
                      scale: [1, 1.1, 1, 1.1, 1]
                    } : {}}
                    transition={{ duration: 0.5, repeat: chaosMode ? Infinity : 0, repeatDelay: 2 }}
                  >
                    <Zap className="w-5 h-5" />
                  </motion.div>
                  <div>
                    <p className="font-medium">Enable Chaos Mode</p>
                    <p className="text-sm text-muted-foreground">
                      Randomize everything. Pure madness.
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={toggleChaosMode}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    chaosMode ? "bg-destructive" : "bg-muted"
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute top-1 w-6 h-6 rounded-full bg-foreground dark:bg-background"
                    animate={{ left: chaosMode ? "calc(100% - 28px)" : "4px" }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </motion.button>
              </div>

              <Toggle
                enabled={judgmentalPopups}
                onToggle={() => setJudgmentalPopups(!judgmentalPopups)}
                label="Judgmental Popups"
                description="Random reminders of your choices"
              />
              <Toggle
                enabled={randomRoasts}
                onToggle={() => setRandomRoasts(!randomRoasts)}
                label="Random Roasts"
                description="AI-generated shade throughout the app"
              />
              
              {chaosMode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 p-4 bg-destructive/20 rounded-xl border border-destructive/50"
                >
                  <motion.p 
                    className="text-sm text-destructive text-center font-medium"
                    animate={{ 
                      x: [0, -2, 2, -2, 0],
                    }}
                    transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 1 }}
                  >
                    ⚠️ CHAOS MODE ACTIVE ⚠️
                    <br />
                    <span className="text-muted-foreground">
                      Good luck. You'll need it.
                    </span>
                  </motion.p>
                </motion.div>
              )}
            </GlassCard>
          )}

          {activeTab === "about" && (
            <GlassCard>
              <div className="flex items-center gap-2 mb-6">
                <Info className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-heading font-semibold">About</h3>
              </div>
              
              {/* Floating Sloth */}
              <motion.div
                className="text-center mb-8"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <motion.div 
                  className="text-8xl cursor-pointer"
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                  onClick={() => {
                    const quotes = [
                      "Slow and steady wins the... eventually.",
                      "I'm not lazy, I'm energy efficient.",
                      "Why do today what you can do never?",
                      "Procrastination is just time travel to future you.",
                      "I'll finish this quote later.",
                    ];
                    alert(quotes[Math.floor(Math.random() * quotes.length)]);
                  }}
                >
                  🦥
                </motion.div>
                <p className="text-sm text-muted-foreground mt-2">
                  Click for wisdom
                </p>
              </motion.div>

              <div className="space-y-4 text-center">
                <h4 className="font-heading font-bold text-xl text-primary">
                  ProofOfProcrastination™
                </h4>
                <p className="text-muted-foreground">
                  Version 0.0.1-beta-probably-never-final
                </p>
                <p className="text-sm text-muted-foreground italic">
                  "Built in 6 hours of peak procrastination"
                </p>
                
                <div className="pt-4 border-t border-border/30">
                  <p className="text-xs text-muted-foreground">
                    No actual blockchain was harmed in the making of this app.
                    <br />
                    Your procrastination, however, is very real.
                  </p>
                </div>
              </div>
            </GlassCard>
          )}
        </motion.div>
      </main>
    </div>
  );
};