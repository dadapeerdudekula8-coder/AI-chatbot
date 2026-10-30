"use client";
import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  perspective?: number;
  glareEffect?: boolean;
  scaleOnHover?: number;
  glowColor?: "cyan" | "violet" | "emerald" | "amber" | "blue";
}

export function TiltCard({
  children,
  className,
  maxTilt = 7,
  perspective = 1000,
  glareEffect = true,
  scaleOnHover = 1.015,
  glowColor = "cyan",
  ...props
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTilt({ x: rotateX, y: rotateY });
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.15,
    });
  };

  const handleMouseEnter = () => {
    if (prefersReducedMotion) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  const glowStyles = {
    cyan: "hover:border-cyan-500/40 hover:shadow-[0_15px_35px_-5px_rgba(6,182,212,0.25)]",
    violet: "hover:border-violet-500/40 hover:shadow-[0_15px_35px_-5px_rgba(139,92,246,0.25)]",
    emerald: "hover:border-emerald-500/40 hover:shadow-[0_15px_35px_-5px_rgba(16,185,129,0.25)]",
    amber: "hover:border-amber-500/40 hover:shadow-[0_15px_35px_-5px_rgba(245,158,11,0.25)]",
    blue: "hover:border-blue-500/40 hover:shadow-[0_15px_35px_-5px_rgba(59,130,246,0.25)]",
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: `${perspective}px`,
      }}
      className={cn("relative transition-transform duration-300 ease-out", className)}
      {...props}
    >
      <div
        style={{
          transform: isHovered && !prefersReducedMotion
            ? `rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg) scale(${scaleOnHover})`
            : "rotateX(0deg) rotateY(0deg) scale(1)",
          transformStyle: "preserve-3d",
          transition: isHovered ? "transform 0.1s ease-out" : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className={cn(
          "relative w-full h-full rounded-2xl overflow-hidden transition-colors border border-border/80",
          glowStyles[glowColor]
        )}
      >
        {/* Dynamic Specular Glare Overlay */}
        {glareEffect && !prefersReducedMotion && (
          <div
            className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
            style={{
              opacity: glarePos.opacity,
              background: `radial-gradient(circle 350px at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 80%)`,
            }}
          />
        )}

        {/* Content Container with 3D Depth support */}
        <div style={{ transformStyle: "preserve-3d" }} className="w-full h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
