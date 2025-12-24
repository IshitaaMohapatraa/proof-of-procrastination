import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SlothMascotProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  mood?: "happy" | "sad" | "sleepy" | "excited" | "angry";
  interactive?: boolean;
  onClick?: () => void;
}

const slothQuotes = [
  "Slow and steady wins the... eventually.",
  "I'm not lazy, I'm energy efficient.",
  "Why do today what you can do never?",
  "Procrastination is just time travel to future you.",
  "I'll finish this quote later.",
  "Due dates are just suggestions.",
  "Productivity is overrated anyway.",
  "Rest is productive... right?",
  "I was going to be motivated, but...",
  "Tomorrow sounds like a great day to start.",
];

const slothMoods = {
  happy: "🦥",
  sad: "😔",
  sleepy: "😴", 
  excited: "🎉",
  angry: "😤",
};

const sizes = {
  sm: "text-4xl",
  md: "text-6xl",
  lg: "text-8xl",
  xl: "text-9xl",
};

export const SlothMascot = ({ 
  className, 
  size = "lg", 
  mood = "happy",
  interactive = true,
  onClick 
}: SlothMascotProps) => {
  const [currentMood, setCurrentMood] = useState(mood);
  const [isBlinking, setIsBlinking] = useState(false);
  const [quote, setQuote] = useState<string | null>(null);

  const handleClick = () => {
    if (interactive) {
      const randomQuote = slothQuotes[Math.floor(Math.random() * slothQuotes.length)];
      setQuote(randomQuote);
      setCurrentMood("excited");
      
      setTimeout(() => {
        setQuote(null);
        setCurrentMood(mood);
      }, 3000);
    }
    onClick?.();
  };

  // Random blink effect
  useState(() => {
    if (!interactive) return;
    
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    }, 2000);

    return () => clearInterval(blinkInterval);
  });

  return (
    <motion.div 
      className={cn("relative inline-flex flex-col items-center", className)}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div
        className={cn(
          sizes[size],
          "cursor-pointer select-none filter drop-shadow-lg",
          interactive && "hover:scale-110 transition-transform"
        )}
        onClick={handleClick}
        whileHover={interactive ? { 
          rotate: [0, -5, 5, -5, 0],
          scale: 1.1,
        } : undefined}
        whileTap={interactive ? { scale: 0.95 } : undefined}
        animate={isBlinking ? { scaleY: 0.1 } : { scaleY: 1 }}
        transition={{ duration: 0.1 }}
      >
        {currentMood === "happy" ? "🦥" : slothMoods[currentMood]}
      </motion.div>

      {/* Speech bubble */}
      {quote && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.8 }}
          className="absolute -top-20 left-1/2 -translate-x-1/2 px-4 py-2 bg-card/95 backdrop-blur-sm rounded-2xl border border-primary/30 shadow-lg max-w-[250px] text-center"
        >
          <p className="text-sm text-foreground italic">"{quote}"</p>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-card border-r border-b border-primary/30" />
        </motion.div>
      )}

      {interactive && !quote && (
        <motion.p
          className="text-xs text-muted-foreground mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Click for wisdom
        </motion.p>
      )}
    </motion.div>
  );
};
