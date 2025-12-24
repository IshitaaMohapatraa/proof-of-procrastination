import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { OptimizedParticleField } from "@/components/ui/OptimizedParticleField";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { PageHeader } from "@/components/ui/PageHeader";
import { HashDisplay } from "@/components/ui/HashDisplay";
import { useAuth } from "@/hooks/useAuth";
import { useProcrastinationChain } from "@/hooks/useProcrastinationChain";
import { useToast } from "@/hooks/use-toast";
import { 
  Sparkles, 
  Clock, 
  MessageSquare,
  Zap,
  Coffee,
  Gamepad2,
  Tv,
  Globe,
  HelpCircle,
  Loader2
} from "lucide-react";

const procrastinationTypes = [
  { id: "social_media", label: "Social Media", icon: Globe, emoji: "📱" },
  { id: "gaming", label: "Gaming", icon: Gamepad2, emoji: "🎮" },
  { id: "streaming", label: "Streaming", icon: Tv, emoji: "📺" },
  { id: "snacking", label: "Snacking", icon: Coffee, emoji: "🍕" },
  { id: "daydreaming", label: "Daydreaming", icon: Sparkles, emoji: "💭" },
  { id: "other", label: "Other", icon: HelpCircle, emoji: "🤷" },
];

const excuseGenerators = [
  "I was researching... something",
  "My creative process requires this",
  "It's called strategic delay",
  "The deadline wasn't clear anyway",
  "I work better under pressure",
  "Mercury is in retrograde",
  "I was about to start, technically",
  "This IS work... kind of",
];

const moodLabels = ["Very guilty", "Mildly concerned", "Neutral", "Pretty chill", "Zero regrets", "Unhinged"];
const moodEmojis = ["😤", "😐", "🙂", "😊", "😌", "🥴"];

export const LogProcrastination = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { addBlock, isAddingBlock } = useProcrastinationChain();
  const { toast } = useToast();
  
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [duration, setDuration] = useState(30);
  const [mood, setMood] = useState(2);
  const [excuse, setExcuse] = useState("");
  const [customNote, setCustomNote] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedHash, setGeneratedHash] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const generateExcuse = () => {
    const randomExcuse = excuseGenerators[Math.floor(Math.random() * excuseGenerators.length)];
    setExcuse(randomExcuse);
  };

  const handleSubmit = async () => {
    if (!selectedType) return;
    
    try {
      const newBlock = await addBlock({
        activity_type: selectedType,
        custom_label: customNote || null,
        duration_minutes: duration,
        mood: moodLabels[mood],
        excuse: excuse || "No excuse provided",
      });

      setGeneratedHash(newBlock.current_hash);
      setShowSuccess(true);
      
      toast({
        title: "Block Added!",
        description: "Your procrastination has been immortalized.",
      });

      setTimeout(() => {
        navigate("/chain");
      }, 2500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add block. Please try again.",
        variant: "destructive",
      });
    }
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
      <OptimizedParticleField />

      <PageHeader />

      <main className="relative z-10 pt-20 pb-16 px-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-heading font-bold text-glow-cyan mb-2">
            Log Procrastination
          </h1>
          <p className="text-muted-foreground">
            Document your avoidance for eternal blockchain glory
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showSuccess ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              {/* Type Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <GlassCard>
                  <h3 className="text-lg font-heading font-semibold mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    What are you avoiding?
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {procrastinationTypes.map((type) => (
                      <motion.button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedType === type.id
                            ? "border-primary bg-primary/20 glow-cyan"
                            : "border-border/50 bg-muted/20 hover:border-primary/50"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="text-2xl mb-2">{type.emoji}</div>
                        <p className="text-sm font-medium">{type.label}</p>
                      </motion.button>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>

              {/* Duration Slider */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <GlassCard>
                  <h3 className="text-lg font-heading font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-accent" />
                    How long did you procrastinate?
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="5"
                      max="180"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">5 min</span>
                      <motion.span 
                        className="text-3xl font-heading font-bold text-primary"
                        key={duration}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 0.2 }}
                      >
                        {duration} min
                      </motion.span>
                      <span className="text-sm text-muted-foreground">3 hrs</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Mood Picker */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <GlassCard>
                  <h3 className="text-lg font-heading font-semibold mb-4">
                    How guilty do you feel?
                  </h3>
                  <div className="flex justify-between">
                    {moodEmojis.map((emoji, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setMood(index)}
                        className={`text-4xl p-2 rounded-xl transition-all ${
                          mood === index
                            ? "bg-primary/20 scale-125"
                            : "opacity-50 hover:opacity-100"
                        }`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </div>
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    {moodLabels[mood]}
                  </p>
                </GlassCard>
              </motion.div>

              {/* Excuse Generator */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <GlassCard>
                  <h3 className="text-lg font-heading font-semibold mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    Your excuse (optional but encouraged)
                  </h3>
                  <div className="space-y-4">
                    <textarea
                      value={excuse}
                      onChange={(e) => setExcuse(e.target.value)}
                      placeholder="Why couldn't you possibly have done the thing..."
                      className="w-full h-24 bg-muted/30 border border-border/50 rounded-xl p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    <NeonButton 
                      variant="secondary" 
                      size="sm"
                      onClick={generateExcuse}
                      className="w-full"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Excuse
                    </NeonButton>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Custom Note */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <GlassCard>
                  <h3 className="text-lg font-heading font-semibold mb-4">
                    Additional notes (for posterity)
                  </h3>
                  <input
                    type="text"
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="e.g., 'I regret nothing'"
                    className="w-full bg-muted/30 border border-border/50 rounded-xl p-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </GlassCard>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="pt-4"
              >
                <NeonButton
                  size="xl"
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={!selectedType || isAddingBlock}
                >
                  {isAddingBlock ? (
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Adding to Chain...
                    </motion.span>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Add to Chain
                    </>
                  )}
                </NeonButton>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="mb-8"
              >
                <div className="w-24 h-24 mx-auto rounded-full bg-primary/20 flex items-center justify-center glow-cyan">
                  <Sparkles className="w-12 h-12 text-primary" />
                </div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl font-heading font-bold text-glow-cyan mb-4"
              >
                Procrastination Logged!
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-muted-foreground mb-8"
              >
                Your laziness has been cryptographically verified
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <HashDisplay hash={generatedHash} className="inline-flex" />
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-sm text-muted-foreground mt-8"
              >
                Redirecting to your chain...
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
