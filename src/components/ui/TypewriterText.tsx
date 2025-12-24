import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TypewriterTextProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export const TypewriterText = ({
  text,
  delay = 0,
  speed = 50,
  className,
  onComplete,
}: TypewriterTextProps) => {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let currentIndex = 0;

    const startTyping = () => {
      const type = () => {
        if (currentIndex < text.length) {
          setDisplayText(text.slice(0, currentIndex + 1));
          currentIndex++;
          timeout = setTimeout(type, speed);
        } else {
          setIsComplete(true);
          onComplete?.();
        }
      };
      type();
    };

    const delayTimeout = setTimeout(startTyping, delay);

    return () => {
      clearTimeout(delayTimeout);
      clearTimeout(timeout);
    };
  }, [text, delay, speed, onComplete]);

  return (
    <span className={cn("inline-block", className)}>
      {displayText}
      {!isComplete && (
        <motion.span
          className="inline-block w-[2px] h-[1em] bg-primary ml-1 align-middle"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </span>
  );
};
