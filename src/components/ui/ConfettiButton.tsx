import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { usePerformance } from "@/hooks/usePerformance";

interface ConfettiButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const triggerConfetti = (performanceMode = false) => {
  if (performanceMode) return;
  
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#00f5ff', '#7f5af0', '#ff004c', '#50fa7b'],
  });
};

export const ConfettiButton = ({ children, onClick, className }: ConfettiButtonProps) => {
  const { performanceMode } = usePerformance();
  
  const handleClick = () => {
    triggerConfetti(performanceMode);
    onClick?.();
  };

  return (
    <motion.button
      onClick={handleClick}
      className={className}
      whileHover={performanceMode ? {} : { scale: 1.05 }}
      whileTap={performanceMode ? {} : { scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};
