import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HashDisplayProps {
  hash: string;
  className?: string;
  animated?: boolean;
  truncate?: boolean;
}

export const HashDisplay = ({
  hash,
  className,
  animated = true,
  truncate = true,
}: HashDisplayProps) => {
  const displayHash = truncate 
    ? `${hash.slice(0, 8)}...${hash.slice(-8)}`
    : hash;

  const characters = displayHash.split("");

  return (
    <motion.div
      className={cn(
        "font-mono text-sm tracking-wider",
        "bg-muted/30 px-3 py-2 rounded-lg border border-border/50",
        "overflow-hidden",
        className
      )}
    >
      {animated ? (
        <span className="inline-flex">
          {characters.map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: index * 0.02,
                type: "spring",
                stiffness: 500,
                damping: 30
              }}
              className={cn(
                "inline-block",
                char === "." ? "text-muted-foreground" : "text-primary"
              )}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ) : (
        <span className="text-primary">{displayHash}</span>
      )}
    </motion.div>
  );
};

export const generateFakeHash = (): string => {
  const chars = "0123456789abcdef";
  return Array.from({ length: 64 }, () => 
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};
