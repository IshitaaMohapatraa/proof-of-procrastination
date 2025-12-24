import { motion } from "framer-motion";
import confetti from "canvas-confetti";

interface ConfettiButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const triggerConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#00f5ff', '#7f5af0', '#ff004c', '#50fa7b'],
  });
};

export const ConfettiButton = ({ children, onClick, className }: ConfettiButtonProps) => {
  const handleClick = () => {
    triggerConfetti();
    onClick?.();
  };

  return (
    <motion.button
      onClick={handleClick}
      className={className}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};
