import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingIconsProps {
  className?: string;
}

const icons = [
  { emoji: "📱", label: "Phone", delay: 0, x: -200, y: -100 },
  { emoji: "☕", label: "Coffee", delay: 0.5, x: 180, y: -80 },
  { emoji: "🦥", label: "Sloth", delay: 1, x: -150, y: 100 },
  { emoji: "🎮", label: "Gaming", delay: 1.5, x: 200, y: 120 },
  { emoji: "📺", label: "Streaming", delay: 2, x: -220, y: 20 },
  { emoji: "💭", label: "Daydream", delay: 2.5, x: 160, y: -20 },
];

export const FloatingIcons = ({ className }: FloatingIconsProps) => {
  return (
    <div className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}>
      {icons.map((icon, index) => (
        <motion.div
          key={icon.label}
          className="absolute left-1/2 top-1/2 pointer-events-auto cursor-pointer"
          initial={{ 
            opacity: 0, 
            x: icon.x, 
            y: icon.y,
            scale: 0 
          }}
          animate={{ 
            opacity: 1,
            x: [icon.x, icon.x + 20, icon.x - 20, icon.x],
            y: [icon.y, icon.y - 30, icon.y + 20, icon.y],
            scale: 1,
            rotateY: [0, 360],
          }}
          transition={{
            opacity: { delay: icon.delay, duration: 0.5 },
            scale: { delay: icon.delay, duration: 0.5, type: "spring" },
            x: { delay: icon.delay + 0.5, duration: 8, repeat: Infinity, ease: "easeInOut" },
            y: { delay: icon.delay + 0.5, duration: 6, repeat: Infinity, ease: "easeInOut" },
            rotateY: { delay: icon.delay + 0.5, duration: 20, repeat: Infinity, ease: "linear" },
          }}
          whileHover={{ 
            scale: 1.3, 
            rotate: [0, -10, 10, 0],
            transition: { duration: 0.3 }
          }}
          style={{ 
            transformStyle: "preserve-3d",
            perspective: "1000px"
          }}
        >
          <motion.div
            className="relative group"
            whileHover={{ z: 50 }}
          >
            <span className="text-5xl md:text-6xl filter drop-shadow-lg">
              {icon.emoji}
            </span>
            <motion.div
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-3 py-1 bg-card/90 backdrop-blur-sm rounded-lg text-xs font-mono text-primary border border-primary/30 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
              initial={{ y: 10 }}
              whileHover={{ y: 0 }}
            >
              {icon.label}: +1 block
            </motion.div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};
