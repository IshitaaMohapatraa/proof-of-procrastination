import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ParticleField } from "@/components/ui/ParticleField";
import { TypewriterText } from "@/components/ui/TypewriterText";
import { NeonButton } from "@/components/ui/NeonButton";

export const SplashScreen = () => {
  const navigate = useNavigate();
  const [showTagline, setShowTagline] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [logoReady, setLogoReady] = useState(false);

  useEffect(() => {
    const logoTimer = setTimeout(() => setLogoReady(true), 500);
    const taglineTimer = setTimeout(() => setShowTagline(true), 1200);
    const buttonTimer = setTimeout(() => setShowButton(true), 3500);
    
    return () => {
      clearTimeout(logoTimer);
      clearTimeout(taglineTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  const handleEnter = () => {
    navigate("/dashboard");
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden animated-gradient">
      <ParticleField />
      
      {/* Logo */}
      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, filter: "blur(20px)" }}
        animate={{ 
          opacity: logoReady ? 1 : 0, 
          filter: logoReady ? "blur(0px)" : "blur(20px)" 
        }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <motion.h1
          className="text-6xl md:text-8xl font-heading font-bold text-glow-cyan"
          animate={logoReady ? { 
            scale: [1, 1.02, 1],
          } : {}}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        >
          <span className="text-primary">Proof</span>
          <span className="text-foreground">Of</span>
          <span className="text-accent">Procrastination</span>
          <span className="text-primary">™</span>
        </motion.h1>

        {/* Tagline */}
        <div className="mt-8 h-8">
          {showTagline && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl md:text-2xl text-muted-foreground italic"
            >
              <TypewriterText 
                text='"Your laziness, mathematically verified."'
                speed={40}
              />
            </motion.p>
          )}
        </div>
      </motion.div>

      {/* Enter Button */}
      <AnimatePresence>
        {showButton && (
          <motion.div
            className="relative z-10 mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ 
                rotate: [0, -1, 1, -1, 0],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2
              }}
            >
              <NeonButton 
                size="lg" 
                onClick={handleEnter}
                className="min-w-[280px]"
              >
                Enter when ready (no rush)
              </NeonButton>
            </motion.div>
            
            <motion.p
              className="text-center text-sm text-muted-foreground mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Auto-continuing in a moment... or don't, we get it.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
    </div>
  );
};
