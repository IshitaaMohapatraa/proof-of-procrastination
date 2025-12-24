import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { X, Link2, Hash, ArrowRight, ShieldCheck, ExternalLink } from 'lucide-react';
import { NeonButton } from './NeonButton';

interface ChainExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  chainLength: number;
  onViewChain?: () => void;
}

export function ChainExplainerModal({
  isOpen,
  onClose,
  chainLength,
  onViewChain,
}: ChainExplainerModalProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            className="relative w-full max-w-md"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className={`
                absolute -top-2 -right-2 z-10 p-2 rounded-full
                ${isDark ? 'bg-muted hover:bg-muted/80' : 'bg-card shadow-lg hover:bg-muted'}
                transition-colors
              `}
            >
              <X className="w-5 h-5 text-foreground" />
            </button>

            <div
              className={`
                relative overflow-hidden rounded-3xl p-6
                ${isDark 
                  ? 'bg-gradient-to-br from-[hsl(240,30%,10%)] via-[hsl(260,40%,14%)] to-[hsl(280,35%,12%)]' 
                  : 'bg-gradient-to-br from-[hsl(240,30%,97%)] via-[hsl(260,40%,96%)] to-[hsl(280,35%,95%)]'
                }
                border-2 ${isDark ? 'border-accent/30' : 'border-accent/20'}
              `}
            >
              {/* Header */}
              <div className="text-center mb-6">
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/20 mb-4"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Link2 className={`w-8 h-8 ${isDark ? 'text-accent text-glow-violet' : 'text-accent'}`} />
                </motion.div>
                <h2 className={`text-2xl font-heading font-bold ${isDark ? 'text-accent text-glow-violet' : 'text-accent'}`}>
                  What is a Block?
                </h2>
                <p className="text-muted-foreground mt-1">
                  You have <span className="font-bold text-foreground">{chainLength}</span> blocks in your chain
                </p>
              </div>

              {/* Visual Chain Diagram */}
              <motion.div
                className={`p-4 rounded-2xl mb-6 ${isDark ? 'bg-muted/30' : 'bg-muted/50'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-center gap-2 overflow-hidden">
                  {[1, 2, 3].map((block, index) => (
                    <motion.div
                      key={block}
                      className="flex items-center"
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.15 }}
                    >
                      <div className={`
                        flex flex-col items-center p-3 rounded-xl
                        ${isDark ? 'bg-card/80 border border-accent/30' : 'bg-card shadow-sm border border-accent/20'}
                      `}>
                        <Hash className="w-4 h-4 text-primary mb-1" />
                        <span className="text-xs font-mono text-muted-foreground">Block {block}</span>
                      </div>
                      {index < 2 && (
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1, repeat: Infinity, delay: index * 0.3 }}
                        >
                          <ArrowRight className="w-4 h-4 text-accent mx-1" />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                  <span className="text-muted-foreground text-lg ml-1">...</span>
                </div>
              </motion.div>

              {/* Explanation Points */}
              <div className="space-y-3 mb-6">
                <motion.div
                  className={`flex items-start gap-3 p-3 rounded-xl ${isDark ? 'bg-primary/10' : 'bg-primary/5'}`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Hash className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Each Block = One Session</p>
                    <p className="text-xs text-muted-foreground">Activity, mood, duration, and excuse are stored</p>
                  </div>
                </motion.div>

                <motion.div
                  className={`flex items-start gap-3 p-3 rounded-xl ${isDark ? 'bg-secondary/10' : 'bg-secondary/5'}`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="p-2 rounded-lg bg-secondary/20">
                    <Link2 className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Linked Together</p>
                    <p className="text-xs text-muted-foreground">Each block contains the hash of the previous one</p>
                  </div>
                </motion.div>

                <motion.div
                  className={`flex items-start gap-3 p-3 rounded-xl ${isDark ? 'bg-neon-green/10' : 'bg-green-50'}`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="p-2 rounded-lg bg-neon-green/20">
                    <ShieldCheck className="w-4 h-4 text-neon-green" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Tamper-Proof</p>
                    <p className="text-xs text-muted-foreground">Changing any block breaks the entire chain</p>
                  </div>
                </motion.div>
              </div>

              {/* CTA Button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <NeonButton 
                  className="w-full" 
                  onClick={() => {
                    onClose();
                    onViewChain?.();
                  }}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Full Chain
                </NeonButton>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
