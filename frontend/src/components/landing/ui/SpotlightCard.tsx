import React, { useRef, useState } from "react";
import { motion, type HTMLMotionProps } from "motion/react";

interface SpotlightCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  spotlightColor?: string;
  children?: React.ReactNode;
}

/** Carte qui allume un halo radial suivant le pointeur. */
export function SpotlightCard({
  spotlightColor = "rgba(45, 212, 191, 0.12)",
  className = "",
  children,
  ...props
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden rounded-2xl border border-[#134e43]/10 bg-white/90 p-6 shadow-[0_4px_20px_-2px_rgba(19,78,67,0.04)] backdrop-blur-md transition-[border-color,box-shadow] duration-300 hover:border-[#134e43]/25 hover:shadow-[0_16px_36px_-12px_rgba(19,78,67,0.1)] ${className}`}
      {...props}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 70%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
