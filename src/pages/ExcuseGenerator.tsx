import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { OptimizedParticleField } from "@/components/ui/OptimizedParticleField";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAuth } from "@/hooks/useAuth";
import { 
  Sparkles, 
  Copy, 
  Check,
  RefreshCw,
  Loader2
} from "lucide-react";

const excuseCategories = [
  { id: "social_media", label: "Social Media", emoji: "📱" },
  { id: "gaming", label: "Gaming", emoji: "🎮" },
  { id: "streaming", label: "Streaming", emoji: "📺" },
  { id: "general", label: "General", emoji: "🤷" },
  { id: "work", label: "Avoiding Work", emoji: "💼" },
  { id: "fitness", label: "Skipping Gym", emoji: "💪" },
];

const excuseTemplates: Record<string, string[]> = {
  social_media: [
    "I was conducting important market research on trending memes.",
    "My creative process requires exposure to diverse content.",
    "I was networking with potential future contacts.",
    "Algorithm analysis is crucial for my understanding of digital culture.",
    "I needed to verify that the internet still exists.",
  ],
  gaming: [
    "I was developing my hand-eye coordination for future productivity.",
    "Strategic thinking exercises are essential for problem-solving.",
    "I was stress-testing my focus under high-pressure situations.",
    "Virtual world exploration enhances real-world creativity.",
    "Team coordination practice for future collaborative projects.",
  ],
  streaming: [
    "I was researching storytelling techniques for my work.",
    "Cultural literacy requires exposure to modern media.",
    "Background noise helps me think. I was just... thinking.",
    "I needed to understand what everyone's talking about.",
    "Quality entertainment is essential for mental health.",
  ],
  general: [
    "I was strategically delaying to allow my subconscious to solve the problem.",
    "Mercury is in retrograde, so productivity would be futile anyway.",
    "I was about to start, technically. Any moment now.",
    "My creative batteries need regular recharging sessions.",
    "Future me will handle this much better than current me.",
  ],
  work: [
    "I'm doing important pre-work mental preparation.",
    "Sometimes the best work is the work we don't do.",
    "I'm prioritizing my mental health over arbitrary deadlines.",
    "This delay will actually improve the final quality.",
    "I work better under pressure, so I'm building pressure.",
  ],
  fitness: [
    "Rest days are scientifically proven to be important.",
    "I'm giving my muscles time to prepare for the workout.",
    "The gym will still be there tomorrow. Probably.",
    "My body is telling me it needs recovery time.",
    "Stretching at home counts as exercise preparation.",
  ],
};

export const ExcuseGenerator = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [generatedExcuses, setGeneratedExcuses] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [history, setHistory] = useState<Array<{ category: string; excuse: string }>>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const generateExcuses = useCallback(async () => {
    if (!selectedCategory) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const templates = excuseTemplates[selectedCategory];
    const shuffled = [...templates].sort(() => Math.random() - 0.5);
    
    setGeneratedExcuses(shuffled);
    setIsGenerating(false);
  }, [selectedCategory]);

  const copyExcuse = useCallback((excuse: string, index: number) => {
    navigator.clipboard.writeText(excuse);
    setCopiedIndex(index);
    
    // Add to history
    if (selectedCategory) {
      setHistory(prev => [
        { category: selectedCategory, excuse },
        ...prev.slice(0, 9)
      ]);
    }
    
    setTimeout(() => setCopiedIndex(null), 2000);
  }, [selectedCategory]);

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

      <PageHeader backPath="/dashboard" showHome={false} />

      <main className="relative z-10 pt-20 pb-16 px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-heading font-bold text-glow-cyan mb-2">
            Excuse Generator
          </h1>
          <p className="text-muted-foreground">
            AI-powered justifications for your procrastination
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Generator Panel */}
          <div className="space-y-6">
            {/* Category Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GlassCard>
                <h3 className="text-lg font-heading font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  What are you avoiding?
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {excuseCategories.map((cat) => (
                    <motion.button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`p-3 rounded-xl border-2 transition-all text-center ${
                        selectedCategory === cat.id
                          ? "border-primary bg-primary/20 glow-cyan"
                          : "border-border/50 bg-muted/20 hover:border-primary/50"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-2xl block mb-1">{cat.emoji}</span>
                      <span className="text-xs">{cat.label}</span>
                    </motion.button>
                  ))}
                </div>

                <NeonButton
                  className="w-full mt-6"
                  onClick={generateExcuses}
                  disabled={!selectedCategory || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Excuses
                    </>
                  )}
                </NeonButton>
              </GlassCard>
            </motion.div>

            {/* Generated Excuses */}
            <AnimatePresence mode="wait">
              {generatedExcuses.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <GlassCard>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-heading font-semibold">
                        Your Excuses
                      </h3>
                      <NeonButton variant="ghost" size="sm" onClick={generateExcuses}>
                        <RefreshCw className="w-4 h-4" />
                      </NeonButton>
                    </div>
                    <div className="space-y-3">
                      {generatedExcuses.map((excuse, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="group relative p-4 bg-muted/30 rounded-xl border border-border/50 hover:border-primary/50 transition-all cursor-pointer"
                          onClick={() => copyExcuse(excuse, index)}
                          whileHover={{ scale: 1.02, x: 5 }}
                        >
                          <p className="text-sm italic pr-8">"{excuse}"</p>
                          <motion.div
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            {copiedIndex === index ? (
                              <Check className="w-5 h-5 text-neon-green" />
                            ) : (
                              <Copy className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            )}
                          </motion.div>
                          
                          {copiedIndex === index && (
                            <motion.div
                              className="absolute inset-0 pointer-events-none"
                              initial={{ opacity: 0.5 }}
                              animate={{ opacity: 0 }}
                              transition={{ duration: 0.5 }}
                            >
                              <div className="absolute inset-0 bg-primary/20 rounded-xl" />
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* History Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="h-full">
              <h3 className="text-lg font-heading font-semibold mb-4">
                Excuse History
              </h3>
              
              {history.length > 0 ? (
                <div className="space-y-3" style={{ perspective: "1000px" }}>
                  {history.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, rotateX: -15 }}
                      animate={{ opacity: 1, rotateX: 0 }}
                      className="p-3 bg-muted/20 rounded-lg border border-border/30"
                      style={{ 
                        transformStyle: "preserve-3d",
                        transform: `translateZ(${(history.length - index) * 2}px)`,
                      }}
                      whileHover={{ 
                        scale: 1.02, 
                        rotateY: 5,
                        boxShadow: "0 0 20px hsl(185 100% 50% / 0.3)"
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">
                          {excuseCategories.find(c => c.id === item.category)?.emoji}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {excuseCategories.find(c => c.id === item.category)?.label}
                        </span>
                      </div>
                      <p className="text-xs italic text-muted-foreground">"{item.excuse}"</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No excuses copied yet.</p>
                  <p className="text-xs mt-2">Generate and copy some excuses to build your arsenal!</p>
                </div>
              )}
            </GlassCard>
          </motion.div>
        </div>
      </main>
    </div>
  );
};
