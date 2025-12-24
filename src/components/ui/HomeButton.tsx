import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

interface HomeButtonProps {
  className?: string;
}

/**
 * Persistent Home button - appears on all screens except dashboard
 * Uses controlled routing with replace: true for instant navigation
 * No animations on click to prevent lag
 */
export const HomeButton = memo(({ className = "" }: HomeButtonProps) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate("/dashboard", { replace: true });
  }, [navigate]);

  return (
    <button
      onClick={handleClick}
      className={`
        fixed top-4 left-4 z-50
        w-12 h-12 rounded-full
        bg-background/80 backdrop-blur-sm
        border border-border/50
        flex items-center justify-center
        text-foreground/70 hover:text-primary
        hover:border-primary/50
        transition-colors duration-150
        cursor-pointer
        ${className}
      `}
      aria-label="Go to Dashboard"
    >
      <Home className="w-5 h-5" />
    </button>
  );
});

HomeButton.displayName = "HomeButton";
