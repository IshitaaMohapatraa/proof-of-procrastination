import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ParticleField } from "@/components/ui/ParticleField";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { HashDisplay } from "@/components/ui/HashDisplay";
import { useAuth } from "@/hooks/useAuth";
import { useProcrastinationChain } from "@/hooks/useProcrastinationChain";
import { 
  ArrowLeft, 
  Shield, 
  ShieldCheck, 
  ChevronDown,
  ChevronUp,
  Clock,
  MessageSquare,
  Loader2
} from "lucide-react";

const activityEmojis: Record<string, string> = {
  social_media: "📱",
  gaming: "🎮",
  streaming: "📺",
  snacking: "🍕",
  daydreaming: "💭",
  other: "🤷",
};

const activityLabels: Record<string, string> = {
  social_media: "Social Media",
  gaming: "Gaming",
  streaming: "Streaming",
  snacking: "Snacking",
  daydreaming: "Daydreaming",
  other: "Other",
};

export const ChainViewer = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { chain, isLoading, validateChainIntegrity } = useProcrastinationChain();
  
  const [expandedBlock, setExpandedBlock] = useState<string | null>(null);
  const [chainIntegrity, setChainIntegrity] = useState<{ valid: boolean; broken_at: number | null }>({ valid: true, broken_at: null });

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Validate chain
  useEffect(() => {
    if (chain.length > 0) {
      validateChainIntegrity().then(setChainIntegrity);
    }
  }, [chain]);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center animated-gradient">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Reverse to show newest first
  const reversedChain = [...chain].reverse();

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
              chainIntegrity.valid 
                ? "bg-neon-green/20 text-neon-green border border-neon-green/50"
                : "bg-destructive/20 text-destructive border border-destructive/50"
            }`}
            animate={{ 
              boxShadow: chainIntegrity.valid 
                ? ["0 0 10px hsl(150 100% 50% / 0.3)", "0 0 20px hsl(150 100% 50% / 0.5)", "0 0 10px hsl(150 100% 50% / 0.3)"]
                : ["0 0 10px hsl(345 100% 50% / 0.3)", "0 0 20px hsl(345 100% 50% / 0.5)", "0 0 10px hsl(345 100% 50% / 0.3)"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {chainIntegrity.valid ? (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span className="font-mono text-sm">Chain Verified</span>
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                <span className="font-mono text-sm">Integrity Compromised at Block #{chainIntegrity.broken_at}</span>
              </>
            )}
          </motion.div>
        </motion.div>

        {chain.length === 0 ? (
          <GlassCard className="text-center py-16">
            <p className="text-muted-foreground mb-4">No procrastination logged yet.</p>
            <NeonButton onClick={() => navigate("/log")}>
              Log Your First Session
            </NeonButton>
          </GlassCard>
        ) : (
          <>
            {/* Chain Timeline */}
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary/20" />

              <div className="space-y-4">
                {reversedChain.map((block, index) => (
                  <motion.div
                    key={block.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
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
                          <div className="text-3xl">{activityEmojis[block.activity_type] || "🤷"}</div>
                          <div>
                            <h3 className="font-heading font-semibold">
                              {activityLabels[block.activity_type] || block.activity_type}
                            </h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              {block.duration_minutes} min • {formatDate(block.timestamp)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-mono text-primary">
                            #{block.block_index.toString().padStart(3, "0")}
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
                            <HashDisplay hash={block.current_hash} truncate={false} animated={false} />
                          </div>
                          
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                              Previous Hash
                            </p>
                            <HashDisplay hash={block.prev_hash} truncate animated={false} />
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Mood:</span>
                            <span className="text-sm">{block.mood}</span>
                          </div>

                          {block.excuse && (
                            <div className="flex items-start gap-2">
                              <MessageSquare className="w-4 h-4 text-accent mt-1" />
                              <p className="text-sm text-muted-foreground italic">
                                "{block.excuse}"
                              </p>
                            </div>
                          )}

                          {block.custom_label && (
                            <div className="text-sm text-muted-foreground">
                              <span className="text-xs uppercase tracking-wider">Note: </span>
                              {block.custom_label}
                            </div>
                          )}

                          {/* JSON View */}
                          <div className="bg-muted/30 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                            <pre className="text-muted-foreground">
{`{
  "block": ${block.block_index},
  "type": "${block.activity_type}",
  "duration": ${block.duration_minutes},
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
          </>
        )}
      </main>
    </div>
  );
};
