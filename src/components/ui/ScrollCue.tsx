import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export const ScrollCue = () => {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 4 }}
      onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
    >
      <motion.p
        className="text-sm text-muted-foreground"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Scroll to explore
      </motion.p>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-primary"
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>
      <motion.div
        className="absolute inset-0 -z-10 rounded-full blur-xl bg-primary/20"
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
};
