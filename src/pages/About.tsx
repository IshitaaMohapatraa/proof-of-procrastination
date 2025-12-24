import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { OptimizedParticleField } from "@/components/ui/OptimizedParticleField";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { SlothMascot } from "@/components/ui/SlothMascot";
import { 
  ArrowLeft,
  Github,
  Twitter,
  Heart,
  Sparkles
} from "lucide-react";

const slothFacts = [
  "Sloths can hold their breath for up to 40 minutes. That's dedication to not moving.",
  "A sloth's top speed is 0.27 km/h. Goals.",
  "Sloths only poop once a week. Maximum efficiency.",
  "Baby sloths learn to climb by grabbing onto their mother's fur. Clingy behavior starts early.",
  "Sloths spend 90% of their lives motionless. Same.",
  "Sloths can turn their heads 270 degrees. All the better to avoid eye contact.",
  "Ancient giant ground sloths were the size of elephants. Imagine that procrastinating.",
  "Sloths have extra neck vertebrae. Evolved for optimal napping positions.",
];

const easterEggs = [
  { trigger: "☕", message: "Achievement Unlocked: Coffee Addict", color: "cyan" },
  { trigger: "🎮", message: "Achievement Unlocked: Gaming Legend", color: "violet" },
  { trigger: "🦥", message: "Achievement Unlocked: Spirit Animal", color: "cyan" },
];

export const About = () => {
  const navigate = useNavigate();
  const [currentFact, setCurrentFact] = useState(0);
  const [easterEggTriggered, setEasterEggTriggered] = useState<string | null>(null);
  const [clickCount, setClickCount] = useState(0);
  const [secretMode, setSecretMode] = useState(false);

  useEffect(() => {
    if (clickCount >= 7) {
      setSecretMode(true);
    }
  }, [clickCount]);

  const nextFact = useCallback(() => {
    setCurrentFact((prev) => (prev + 1) % slothFacts.length);
    setClickCount(prev => prev + 1);
  }, []);

  const triggerEasterEgg = useCallback((egg: typeof easterEggs[0]) => {
    setEasterEggTriggered(egg.message);
    setTimeout(() => setEasterEggTriggered(null), 2000);
  }, []);

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

      {/* Easter Egg Popup */}
      {easterEggTriggered && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-primary/20 border border-primary/50 rounded-xl backdrop-blur-sm"
        >
          <p className="text-primary font-heading font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            {easterEggTriggered}
          </p>
        </motion.div>
      )}

      <main className="relative z-10 pt-20 pb-16 px-4 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-heading font-bold text-glow-cyan mb-2">
            Easter Eggs & About
          </h1>
          <p className="text-muted-foreground">
            Secrets, credits, and sloth wisdom
          </p>
        </motion.div>

        {/* Interactive Sloth */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <SlothMascot size="xl" />
          
          <motion.div
            className="mt-6 p-4 bg-muted/30 rounded-xl border border-border/50 max-w-md mx-auto cursor-pointer"
            onClick={nextFact}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <p className="text-sm text-muted-foreground italic">
              "{slothFacts[currentFact]}"
            </p>
            <p className="text-xs text-primary mt-2">Click for more sloth wisdom</p>
          </motion.div>

          {secretMode && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 p-3 bg-accent/20 rounded-xl border border-accent/50 inline-block"
            >
              <p className="text-sm text-accent font-heading font-bold">
                🎉 Secret Mode Unlocked! You clicked 7 times.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Easter Egg Triggers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <GlassCard>
            <h3 className="text-lg font-heading font-semibold mb-4">Hidden Treasures</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Click the icons to discover Easter eggs...
            </p>
            <div className="flex justify-center gap-6">
              {easterEggs.map((egg, index) => (
                <motion.button
                  key={index}
                  onClick={() => triggerEasterEgg(egg)}
                  className="text-4xl p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                  whileTap={{ scale: 0.9 }}
                >
                  {egg.trigger}
                </motion.button>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard glowColor="violet">
            <div className="text-center space-y-6">
              <h3 className="text-2xl font-heading font-bold text-primary">
                ProofOfProcrastination™
              </h3>
              
              <p className="text-muted-foreground">
                Version 1.0.0-beta-still-procrastinating
              </p>

              <div className="py-4 border-t border-b border-border/30">
                <p className="text-sm text-muted-foreground italic">
                  "Built during a hackathon while actively procrastinating on other things."
                </p>
              </div>

              <div>
                <h4 className="font-heading font-semibold mb-3">The Concept</h4>
                <p className="text-sm text-muted-foreground">
                  What if we made procrastination feel official and immutable? 
                  This app uses real cryptographic hashing to create an unbreakable chain 
                  of your avoidance patterns. Because if you're going to waste time, 
                  you might as well document it professionally.
                </p>
              </div>

              <div>
                <h4 className="font-heading font-semibold mb-3">Tech Stack</h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {["React", "TypeScript", "Tailwind", "Framer Motion", "Supabase", "SHA-256"].map((tech) => (
                    <span 
                      key={tech}
                      className="px-3 py-1 bg-muted/30 rounded-full text-xs font-mono text-primary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-center gap-4 pt-4">
                <NeonButton variant="ghost" size="sm">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </NeonButton>
                <NeonButton variant="ghost" size="sm">
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </NeonButton>
              </div>

              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                Made with <Heart className="w-3 h-3 text-destructive" /> and a lot of procrastination
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </main>
    </div>
  );
};
