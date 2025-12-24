import { useEffect, useRef, memo } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { usePerformance } from "@/hooks/usePerformance";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  baseSpeedX: number;
  baseSpeedY: number;
}

export const OptimizedParticleField = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const { theme, chaosMode } = useTheme();
  const { performanceMode, reducedMotion } = usePerformance();

  useEffect(() => {
    // Skip animation entirely in performance mode
    if (performanceMode || reducedMotion) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let isVisible = true;

    // Use IntersectionObserver to pause when not visible
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    resize();

    // Throttle resize
    let resizeTimeout: number;
    const throttledResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(resize, 100);
    };
    window.addEventListener("resize", throttledResize);

    // Reduce particle count for performance
    const particleCount = 40; // Reduced from 80
    particlesRef.current = Array.from({ length: particleCount }, () => {
      const speedX = (Math.random() - 0.5) * 0.3;
      const speedY = (Math.random() - 0.5) * 0.3;
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 0.5,
        speedX,
        speedY,
        baseSpeedX: speedX,
        baseSpeedY: speedY,
        opacity: Math.random() * 0.5 + 0.1,
      };
    });

    // Theme-based colors - computed once
    const isDark = theme === "dark";
    const primaryColor = isDark
      ? { r: 255, g: 110, b: 199 }
      : { r: 219, g: 112, b: 147 };
    const secondaryColor = isDark
      ? { r: 127, g: 90, b: 240 }
      : { r: 221, g: 160, b: 221 };

    let lastTime = 0;
    const targetFPS = 30; // Cap at 30 FPS for particles
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      animationRef.current = requestAnimationFrame(animate);

      if (!isVisible) return;

      const deltaTime = currentTime - lastTime;
      if (deltaTime < frameInterval) return;
      lastTime = currentTime - (deltaTime % frameInterval);

      const width = window.innerWidth;
      const height = window.innerHeight;

      ctx.clearRect(0, 0, width, height);

      particlesRef.current.forEach((particle) => {
        if (chaosMode) {
          const time = currentTime * 0.001;
          particle.speedX = particle.baseSpeedX * (1 + Math.sin(time + particle.x * 0.01) * 2);
          particle.speedY = particle.baseSpeedY * (1 + Math.cos(time + particle.y * 0.01) * 2);
        } else {
          particle.speedX = particle.baseSpeedX;
          particle.speedY = particle.baseSpeedY;
        }

        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;

        // Simplified drawing - no gradient for performance
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, ${particle.opacity})`;
        ctx.fill();
      });
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", throttledResize);
      clearTimeout(resizeTimeout);
      cancelAnimationFrame(animationRef.current);
      observer.disconnect();
    };
  }, [theme, chaosMode, performanceMode, reducedMotion]);

  // In performance mode, show a simple gradient background instead
  if (performanceMode || reducedMotion) {
    return (
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: theme === "dark" 
            ? "radial-gradient(ellipse at center, hsl(270 50% 15% / 0.3) 0%, transparent 70%)"
            : "radial-gradient(ellipse at center, hsl(330 50% 95% / 0.5) 0%, transparent 70%)",
        }}
      />
    );
  }

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  );
});

OptimizedParticleField.displayName = "OptimizedParticleField";
