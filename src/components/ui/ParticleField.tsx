import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";

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

export const ParticleField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const { theme, chaosMode } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize particles
    const particleCount = 80;
    particlesRef.current = Array.from({ length: particleCount }, () => {
      const speedX = (Math.random() - 0.5) * 0.3;
      const speedY = (Math.random() - 0.5) * 0.3;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX,
        speedY,
        baseSpeedX: speedX,
        baseSpeedY: speedY,
        opacity: Math.random() * 0.5 + 0.1,
      };
    });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Theme-based colors
      const isDark = theme === "dark";
      const primaryColor = isDark 
        ? { r: 255, g: 110, b: 199 }  // Neon pink
        : { r: 219, g: 112, b: 147 }; // Soft rose
      const secondaryColor = isDark 
        ? { r: 127, g: 90, b: 240 }   // Neon violet
        : { r: 221, g: 160, b: 221 }; // Soft lavender

      particlesRef.current.forEach((particle) => {
        // Chaos mode: randomize speeds
        if (chaosMode) {
          particle.speedX = particle.baseSpeedX * (1 + Math.sin(Date.now() * 0.001 + particle.x) * 2);
          particle.speedY = particle.baseSpeedY * (1 + Math.cos(Date.now() * 0.001 + particle.y) * 2);
        } else {
          particle.speedX = particle.baseSpeedX;
          particle.speedY = particle.baseSpeedY;
        }

        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle with glow
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 3
        );
        
        gradient.addColorStop(
          0, 
          `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, ${particle.opacity})`
        );
        gradient.addColorStop(
          0.5, 
          `rgba(${secondaryColor.r}, ${secondaryColor.g}, ${secondaryColor.b}, ${particle.opacity * 0.5})`
        );
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [theme, chaosMode]);

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    />
  );
};