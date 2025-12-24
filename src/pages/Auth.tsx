import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { OptimizedParticleField } from "@/components/ui/OptimizedParticleField";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, User, Loader2 } from "lucide-react";

const emailSchema = z.string().email("Invalid email address").max(255, "Email too long");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters").max(72, "Password too long");
const displayNameSchema = z.string().max(50, "Display name too long").optional();

const loadingMessages = [
  "Summoning motivation...",
  "Still procrastinating...",
  "Checking if you're worthy...",
  "Warming up the blockchain...",
  "Finding your inner sloth...",
];

export const Auth = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp, loading } = useAuth();
  const { toast } = useToast();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  // Cycle loading messages
  useEffect(() => {
    if (!isSubmitting) return;
    
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[index]);
    }, 1500);

    return () => clearInterval(interval);
  }, [isSubmitting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
      if (!isLogin) {
        displayNameSchema.parse(displayName);
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: err.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Login Failed",
            description: error.message === "Invalid login credentials" 
              ? "Wrong email or password. Try again!"
              : error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "Ready to procrastinate?",
          });
          navigate("/dashboard");
        }
      } else {
        const { error } = await signUp(email, password, displayName || undefined);
        if (error) {
          toast({
            title: "Signup Failed",
            description: error.message.includes("already registered")
              ? "This email is already registered. Try logging in!"
              : error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Account Created!",
            description: "Welcome to the procrastination club.",
          });
          navigate("/dashboard");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center animated-gradient">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden animated-gradient flex items-center justify-center p-4">
      <OptimizedParticleField />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <GlassCard className="p-8">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-heading font-bold text-glow-cyan mb-2">
              {isLogin ? "Welcome Back" : "Join the Club"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isLogin 
                ? "Your procrastination awaits" 
                : "Start documenting your avoidance"}
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="displayName"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Display name (optional)"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-muted/30 border border-border/50 rounded-xl pl-12 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                placeholder="Email (we won't judge... much)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-muted/30 border border-border/50 rounded-xl pl-12 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="password"
                placeholder="Password (make it strong-ish)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-muted/30 border border-border/50 rounded-xl pl-12 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <NeonButton
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <motion.span
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="flex items-center gap-2"
                  >
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {loadingMessage}
                  </motion.span>
                ) : (
                  isLogin ? "Login" : "Create Account"
                )}
              </NeonButton>
            </motion.div>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Login"}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-border/30">
            <NeonButton
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => navigate("/")}
            >
              ← Back to splash
            </NeonButton>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};
