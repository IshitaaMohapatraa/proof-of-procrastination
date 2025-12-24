import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { NeonButton } from "./NeonButton";
import { Home, ArrowLeft } from "lucide-react";
import { usePerformance } from "@/hooks/usePerformance";

interface PageHeaderProps {
  showBack?: boolean;
  backPath?: string;
  showHome?: boolean;
  className?: string;
}

export const PageHeader = memo(({ 
  showBack = true, 
  backPath = "/dashboard",
  showHome = true,
  className = ""
}: PageHeaderProps) => {
  const navigate = useNavigate();
  const { reducedMotion } = usePerformance();

  const handleBack = useCallback(() => {
    navigate(backPath, { replace: true });
  }, [navigate, backPath]);

  const handleHome = useCallback(() => {
    navigate("/dashboard", { replace: true });
  }, [navigate]);

  return (
    <motion.div
      className={`fixed top-4 left-4 z-50 flex gap-2 ${className}`}
      initial={reducedMotion ? {} : { opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      {showBack && (
        <NeonButton 
          variant="ghost" 
          size="sm"
          onClick={handleBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </NeonButton>
      )}
      {showHome && backPath !== "/dashboard" && (
        <NeonButton 
          variant="ghost" 
          size="sm"
          onClick={handleHome}
        >
          <Home className="w-4 h-4" />
        </NeonButton>
      )}
    </motion.div>
  );
});

PageHeader.displayName = "PageHeader";
