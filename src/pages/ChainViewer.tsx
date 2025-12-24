import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { OptimizedParticleField } from "@/components/ui/OptimizedParticleField";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { PageHeader } from "@/components/ui/PageHeader";
import { HashDisplay } from "@/components/ui/HashDisplay";
import { useAuth } from "@/hooks/useAuth";
import { useProcrastinationChain } from "@/hooks/useProcrastinationChain";
import { usePerformance } from "@/hooks/usePerformance";
import { 
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

// Memoized static block component - no animations
const ChainBlock = memo(({ 
  block, 
  isExpanded, 
  onToggle,
}: {
  block: any;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
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
    <div className="relative pl-16">
      {/* Chain link connector - static dot */}
      <div className="absolute left-6 top-6 w-4 h-4 rounded-full bg-background border-2 border-primary" />

      <GlassCard 
        className="cursor-pointer"
        onClick={onToggle}
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
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Expanded Details - static */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border/50 space-y-4">
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
          </div>
        )}
      </GlassCard>
    </div>
  );
});

ChainBlock.displayName = "ChainBlock";

export const ChainViewer = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { chain, isLoading, validateChainIntegrity } = useProcrastinationChain();
  const { reducedMotion } = usePerformance();
  
  const [expandedBlock, setExpandedBlock] = useState<string | null>(null);
  const [chainIntegrity, setChainIntegrity] = useState<{ valid: boolean; broken_at: number | null }>({ valid: true, broken_at: null });
  const [visibleCount, setVisibleCount] = useState(20);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Validate chain - only when chain length changes
  useEffect(() => {
    if (chain.length > 0) {
      validateChainIntegrity().then(setChainIntegrity);
    }
  }, [chain.length, validateChainIntegrity]);

  // Memoize reversed chain
  const reversedChain = useMemo(() => [...chain].reverse(), [chain]);
  
  // Visible chain slice for virtualization
  const visibleChain = useMemo(() => 
    reversedChain.slice(0, visibleCount), 
    [reversedChain, visibleCount]
  );

  // Load more handler
  const handleLoadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + 20, reversedChain.length));
  }, [reversedChain.length]);

  // Toggle block expansion
  const handleToggleBlock = useCallback((blockId: string) => {
    setExpandedBlock(prev => prev === blockId ? null : blockId);
  }, []);

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

      <PageHeader />

      <main className="relative z-10 pt-20 pb-16 px-4 max-w-3xl mx-auto">
        {/* Header - Static */}
        <div className="text-center mb-10">
          <h1 className={`text-4xl font-heading font-bold mb-2 ${!reducedMotion ? 'text-glow-cyan' : ''}`}>
            Your Procrastination Chain
          </h1>
          <p className="text-muted-foreground mb-4">
            An immutable record of your avoidance patterns
          </p>
          
          {/* Chain Integrity Badge - Static */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
              chainIntegrity.valid 
                ? "bg-neon-green/20 text-neon-green border border-neon-green/50"
                : "bg-destructive/20 text-destructive border border-destructive/50"
            }`}
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
          </div>
        </div>

        {chain.length === 0 ? (
          <GlassCard className="text-center py-16">
            <p className="text-muted-foreground mb-4">No procrastination logged yet.</p>
            <NeonButton onClick={handleLogFirst}>
              Log Your First Session
            </NeonButton>
          </GlassCard>
        ) : (
          <>
            {/* Chain Timeline - Static */}
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary/20" />

              <div className="space-y-4">
                {visibleChain.map((block) => (
                  <ChainBlock
                    key={block.id}
                    block={block}
                    isExpanded={expandedBlock === block.id}
                    onToggle={() => handleToggleBlock(block.id)}
                  />
                ))}
              </div>
            </div>

            {/* Load More Button */}
            {visibleCount < reversedChain.length && (
              <div className="text-center mt-8">
                <NeonButton variant="secondary" onClick={handleLoadMore}>
                  Load More ({reversedChain.length - visibleCount} remaining)
                </NeonButton>
              </div>
            )}

            {/* Genesis Block Indicator */}
            {visibleCount >= reversedChain.length && (
              <div className="text-center mt-8 text-muted-foreground text-sm">
                ⚡ Genesis Block - The First Procrastination ⚡
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
