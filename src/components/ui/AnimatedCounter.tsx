import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export const AnimatedCounter = ({
  value,
  duration = 2,
  className,
  prefix = "",
  suffix = "",
}: AnimatedCounterProps) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Easing function for smooth animation
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.floor(eased * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  const digits = displayValue.toString().padStart(value.toString().length, "0").split("");

  return (
    <div className={cn("flex items-center font-mono", className)}>
      {prefix && <span className="text-muted-foreground mr-2">{prefix}</span>}
      <div className="flex">
        <AnimatePresence mode="popLayout">
          {digits.map((digit, index) => (
            <motion.span
              key={`${index}-${digit}`}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="inline-block"
            >
              {digit}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
      {suffix && <span className="text-muted-foreground ml-2">{suffix}</span>}
    </div>
  );
};
