import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ParticleField } from "@/components/ui/ParticleField";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { HashDisplay } from "@/components/ui/HashDisplay";
import { useAuth } from "@/hooks/useAuth";
import { useProcrastinationChain } from "@/hooks/useProcrastinationChain";
import { useAchievements } from "@/hooks/useAchievements";
import { 
  ArrowLeft, 
  Download, 
  Share2,
  Award,
  Loader2
} from "lucide-react";
import confetti from "canvas-confetti";

const sarcasmLevels = [
  { level: 1, text: "Mildly ironic", seal: "Certified Procrastinator" },
  { level: 2, text: "Passive aggressive", seal: "Professional Time Waster" },
  { level: 3, text: "Brutally honest", seal: "Master of Avoidance" },
  { level: 4, text: "Maximum chaos", seal: "Supreme Delay Champion" },
];

export const Certificate = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { chain, validateChainIntegrity } = useProcrastinationChain();
  const { chainStats } = useAchievements();
  
  const [displayName, setDisplayName] = useState("");
  const [sarcasmLevel, setSarcasmLevel] = useState(2);
  const [isGenerating, setIsGenerating] = useState(false);
  const [chainValid, setChainValid] = useState(true);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      setDisplayName(user.email?.split("@")[0] || "Procrastinator");
    }
  }, [user]);

  useEffect(() => {
    validateChainIntegrity().then(result => setChainValid(result.valid));
  }, [chain]);

  const totalHours = Math.floor(chainStats.totalMinutes / 60);
  const totalMinutes = chainStats.totalMinutes % 60;
  const rootHash = chain.length > 0 ? chain[chain.length - 1].current_hash : "0".repeat(64);

  const handleDownload = () => {
    setIsGenerating(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00f5ff', '#7f5af0', '#ffd700'],
    });
    
    // Simulate download delay
    setTimeout(() => {
      setIsGenerating(false);
      // In production, would generate actual PDF/PNG
      alert("Certificate download would happen here! 📜");
    }, 1500);
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-heading font-bold text-glow-cyan mb-2">
            Certificate Generator
          </h1>
          <p className="text-muted-foreground">
            Official proof of your procrastination prowess
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Customization Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard>
              <h3 className="text-lg font-heading font-semibold mb-6">Customize</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-muted/30 border border-border/50 rounded-xl p-3 text-foreground focus:outline-none focus:border-primary/50"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground block mb-2">
                    Sarcasm Level: {sarcasmLevels[sarcasmLevel - 1].text}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    value={sarcasmLevel}
                    onChange={(e) => setSarcasmLevel(Number(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Mild</span>
                    <span>Maximum</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <NeonButton 
                    className="flex-1" 
                    onClick={handleDownload}
                    disabled={isGenerating || chain.length === 0}
                  >
                    {isGenerating ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    Download
                  </NeonButton>
                  <NeonButton variant="secondary" className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </NeonButton>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Certificate Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02, rotate: 1 }}
          >
            <div 
              ref={certificateRef}
              className="relative bg-gradient-to-br from-card via-card to-muted p-8 rounded-2xl border-4 border-primary/50 shadow-2xl"
              style={{
                boxShadow: "0 0 60px hsl(185 100% 50% / 0.2)",
              }}
            >
              {/* Decorative corners */}
              <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-primary/50" />
              <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-primary/50" />
              <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-primary/50" />
              <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-primary/50" />

              <div className="text-center space-y-6">
                {/* Seal */}
                <motion.div
                  className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center border-2 border-primary/50"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Award className="w-10 h-10 text-primary" />
                </motion.div>

                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">
                    This certifies that
                  </p>
                  <h2 className="text-3xl font-heading font-bold text-primary">
                    {displayName}
                  </h2>
                </div>

                <p className="text-muted-foreground">
                  has been officially recognized as a
                </p>

                <h3 className="text-2xl font-heading font-bold text-accent">
                  {sarcasmLevels[sarcasmLevel - 1].seal}
                </h3>

                <div className="py-4 border-t border-b border-border/30">
                  <p className="text-lg font-mono">
                    <span className="text-muted-foreground">Total Time Wasted:</span>{" "}
                    <span className="text-primary font-bold">{totalHours}h {totalMinutes}m</span>
                  </p>
                  <p className="text-lg font-mono">
                    <span className="text-muted-foreground">Blocks in Chain:</span>{" "}
                    <span className="text-accent font-bold">{chain.length}</span>
                  </p>
                </div>

                {/* Root Hash */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Root Hash</p>
                  <HashDisplay hash={rootHash} truncate animated={false} />
                </div>

                {/* Validity Seal */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                  chainValid 
                    ? "bg-neon-green/20 text-neon-green border border-neon-green/50"
                    : "bg-destructive/20 text-destructive border border-destructive/50"
                }`}>
                  <span className="text-sm font-mono">
                    {chainValid ? "✓ Chain Verified" : "⚠ Chain Compromised"}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground italic">
                  Generated on {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};
