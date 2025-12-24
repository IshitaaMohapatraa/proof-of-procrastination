import { useRef, useEffect } from "react";

/**
 * Hook to track if initial animations have run
 * Returns true if animations should be skipped (already ran once)
 * This prevents re-triggering animations on back navigation
 */
export function useAnimationFreeze(key: string = "default") {
  const hasAnimated = useRef(false);
  
  useEffect(() => {
    // Mark as animated after first mount
    hasAnimated.current = true;
  }, []);

  return {
    hasAnimated: hasAnimated.current,
    shouldAnimate: !hasAnimated.current,
  };
}

/**
 * Global animation state that persists across navigation
 * Use this to track which pages have already shown their animations
 */
const animatedPages = new Set<string>();

export function usePageAnimation(pageKey: string) {
  const isFirstVisit = !animatedPages.has(pageKey);
  
  useEffect(() => {
    animatedPages.add(pageKey);
  }, [pageKey]);

  return {
    shouldAnimate: isFirstVisit,
    hasAnimated: !isFirstVisit,
  };
}
