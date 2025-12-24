import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { OptimizedParticleField } from "@/components/ui/OptimizedParticleField";
import { TypewriterText } from "@/components/ui/TypewriterText";
import { NeonButton } from "@/components/ui/NeonButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { FloatingIcons } from "@/components/ui/FloatingIcons";
import { ScrollCue } from "@/components/ui/ScrollCue";
import { useAuth } from "@/hooks/useAuth";
import { usePerformance } from "@/hooks/usePerformance";
import { 
  Link2, 
  Trophy, 
  BarChart3, 
  Award, 
  FileText,
  Sparkles,
  Zap
} from "lucide-react";
import confetti from "canvas-confetti";

export const SplashScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { performanceMode } = usePerformance();
  const [showTagline, setShowTagline] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [logoReady, setLogoReady] = useState(false);
  const [showSections, setShowSections] = useState(false);

  useEffect(() => {
    const logoTimer = setTimeout(() => setLogoReady(true), performanceMode ? 100 : 500);
    const taglineTimer = setTimeout(() => setShowTagline(true), performanceMode ? 300 : 1200);
    const buttonTimer = setTimeout(() => setShowButton(true), performanceMode ? 600 : 3500);
    const sectionsTimer = setTimeout(() => setShowSections(true), performanceMode ? 800 : 4000);
    
    return () => {
      clearTimeout(logoTimer);
      clearTimeout(taglineTimer);
      clearTimeout(buttonTimer);
      clearTimeout(sectionsTimer);
    };
  }, [performanceMode]);

  const handleEnter = useCallback(() => {
    if (!performanceMode) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff6ec7', '#bb77ff', '#ff4d6d', '#00f5ff'],
      });
    }
    
    setTimeout(() => {
      navigate(user ? "/dashboard" : "/auth", { replace: true });
    }, performanceMode ? 100 : 500);
  }, [navigate, user, performanceMode]);

  const quickLinks = [
    { icon: Link2, label: "Chain Viewer", path: "/chain", color: "pink" },
    { icon: Trophy, label: "Achievements", path: "/achievements", color: "violet" },
    { icon: BarChart3, label: "Analytics", path: "/analytics", color: "pink" },
    { icon: FileText, label: "Certificate", path: "/certificate", color: "violet" },
    { icon: Sparkles, label: "Excuses", path: "/excuses", color: "pink" },
    { icon: Award, label: "Profile", path: "/profile", color: "violet" },
  ];

  return (
    <div className="relative min-h-[200vh] overflow-hidden animated-gradient">
      <OptimizedParticleField />
      {!performanceMode && <FloatingIcons />}
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4">
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
            className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold neon-flicker"
            animate={logoReady ? { 
              scale: [1, 1.02, 1],
              textShadow: [
                "0 0 20px hsl(var(--primary) / 0.5)",
                "0 0 40px hsl(var(--primary) / 0.8)",
                "0 0 20px hsl(var(--primary) / 0.5)",
              ]
            } : {}}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          >
            <motion.span 
              className="text-primary inline-block"
              animate={{ 
                x: [0, -2, 2, 0],
              }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 5 }}
            >
              Proof
            </motion.span>
            <span className="text-foreground">Of</span>
            <span className="text-accent">Procrastination</span>
            <motion.span 
              className="text-primary"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ™
            </motion.span>
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
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 40px hsl(var(--primary) / 0.5)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="relative"
                >
                  <NeonButton 
                    size="xl" 
                    onClick={handleEnter}
                    className="min-w-[280px] relative overflow-hidden"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Get Started
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    />
                  </NeonButton>
                </motion.div>
              </motion.div>
              
              <motion.p
                className="text-center text-sm text-muted-foreground mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {user ? "Welcome back, fellow procrastinator" : "No rush... we get it."}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll Cue */}
        {showSections && <ScrollCue />}
      </section>

      {/* Quick Links Section */}
      <section className="relative min-h-screen py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-heading font-bold text-glow-pink mb-4">
              Explore Your Procrastination
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Track, analyze, and celebrate your avoidance patterns with cryptographic proof
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickLinks.map((link, index) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard
                  hoverable
                  glowColor={link.color as "pink" | "violet"}
                  className="cursor-pointer h-full"
                  onClick={() => navigate(user ? link.path : "/auth")}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${
                      link.color === "pink" ? "bg-primary/20" : "bg-accent/20"
                    }`}>
                      <link.icon className={`w-6 h-6 ${
                        link.color === "pink" ? "text-primary" : "text-accent"
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-lg">{link.label}</h3>
                      <p className="text-sm text-muted-foreground">
                        {link.label === "Chain Viewer" && "View your immutable procrastination history"}
                        {link.label === "Achievements" && "Unlock badges of dishonor"}
                        {link.label === "Analytics" && "Visualize your avoidance patterns"}
                        {link.label === "Certificate" && "Generate proof of your laziness"}
                        {link.label === "Excuses" && "AI-powered excuse generation"}
                        {link.label === "Profile" && "Your procrastination wrapped"}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom gradient */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-40" />
    </div>
  );
};
