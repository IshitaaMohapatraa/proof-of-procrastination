import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ParticleField } from "@/components/ui/ParticleField";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { HashDisplay, generateFakeHash } from "@/components/ui/HashDisplay";
import { 
  ArrowLeft, 
  Shield, 
  ShieldCheck, 
  ChevronDown,
  ChevronUp,
  Clock,
  MessageSquare
} from "lucide-react";

// Generate mock chain data
const generateMockChain = () => {
  const types = ["Social Media", "Gaming", "Streaming", "Snacking", "Daydreaming"];
  const emojis = ["📱", "🎮", "📺", "🍕", "💭"];
  
  return Array.from({ length: 12 }, (_, i) => {
    const typeIndex = Math.floor(Math.random() * types.length);
    return {
      id: i + 1,
      hash: generateFakeHash(),
      prevHash: i === 0 ? "0".repeat(64) : generateFakeHash(),
      timestamp: new Date(Date.now() - i * 3600000 * Math.random() * 24).toISOString(),
      type: types[typeIndex],
      emoji: emojis[typeIndex],
      duration: Math.floor(Math.random() * 120) + 10,
      excuse: [
        "I was doing research",
        "Just a quick break",
        "Needed inspiration",
        "The algorithm made me",
        "It's called self-care",
      ][Math.floor(Math.random() * 5)],
    };
  });
};

export const ChainViewer = () => {
  const navigate = useNavigate();
  const [chain] = useState(generateMockChain);
  const [expandedBlock, setExpandedBlock] = useState<number | null>(null);
  const [chainIntegrity] = useState(true);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

      <main className="relative z-10 pt-20 pb-16 px-4 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-heading font-bold text-glow-cyan mb-2">
            Your Procrastination Chain
          </h1>
          <p className="text-muted-foreground mb-4">
            An immutable record of your avoidance patterns
          </p>
          
          {/* Chain Integrity Badge */}
          <motion.div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
              chainIntegrity 
                ? "bg-neon-green/20 text-neon-green border border-neon-green/50"
                : "bg-destructive/20 text-destructive border border-destructive/50"
            }`}
            animate={{ 
              boxShadow: chainIntegrity 
                ? ["0 0 10px hsl(150 100% 50% / 0.3)", "0 0 20px hsl(150 100% 50% / 0.5)", "0 0 10px hsl(150 100% 50% / 0.3)"]
                : ["0 0 10px hsl(345 100% 50% / 0.3)", "0 0 20px hsl(345 100% 50% / 0.5)", "0 0 10px hsl(345 100% 50% / 0.3)"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {chainIntegrity ? (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span className="font-mono text-sm">Chain Verified</span>
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                <span className="font-mono text-sm">Integrity Compromised</span>
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Chain Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary/20" />

          <div className="space-y-4">
            {chain.map((block, index) => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-16"
              >
                {/* Chain link connector */}
                <motion.div
                  className="absolute left-6 top-6 w-4 h-4 rounded-full bg-background border-2 border-primary"
                  animate={{ 
                    boxShadow: [
                      "0 0 5px hsl(185 100% 50% / 0.5)",
                      "0 0 15px hsl(185 100% 50% / 0.8)",
                      "0 0 5px hsl(185 100% 50% / 0.5)",
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                />

                <GlassCard 
                  className="cursor-pointer"
                  onClick={() => setExpandedBlock(expandedBlock === block.id ? null : block.id)}
                >
                  {/* Block Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{block.emoji}</div>
                      <div>
                        <h3 className="font-heading font-semibold">{block.type}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {block.duration} min • {formatDate(block.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-mono text-primary">
                        #{block.id.toString().padStart(3, "0")}
                      </span>
                      {expandedBlock === block.id ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedBlock === block.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-border/50 space-y-4"
                    >
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                          Block Hash
                        </p>
                        <HashDisplay hash={block.hash} truncate={false} animated={false} />
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                          Previous Hash
                        </p>
                        <HashDisplay hash={block.prevHash} truncate animated={false} />
                      </div>

                      {block.excuse && (
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 text-accent mt-1" />
                          <p className="text-sm text-muted-foreground italic">
                            "{block.excuse}"
                          </p>
                        </div>
                      )}

                      {/* Mock JSON View */}
                      <div className="bg-muted/30 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                        <pre className="text-muted-foreground">
{`{
  "block": ${block.id},
  "type": "${block.type}",
  "duration": ${block.duration},
  "timestamp": "${block.timestamp}",
  "verified": true
}`}
                        </pre>
                      </div>
                    </motion.div>
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Genesis Block Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-center mt-8 text-muted-foreground text-sm"
        >
          ⚡ Genesis Block - The First Procrastination ⚡
        </motion.div>
      </main>
    </div>
  );
};
