import React from "react";

type BadgeVariant = "emerald" | "ghost" | "glow";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  /** Rend la pastille de statut. */
  dot?: boolean;
}

const badgeStyles: Record<BadgeVariant, string> = {
  emerald:
    "bg-[#ebf5f0] text-[#1b5e52] border border-[#1b5e52]/20 dark:bg-[#1a1a1a] dark:text-[#7fe8d0] dark:border-[#5eead4]/25",
  ghost:
    "bg-white/80 text-[#103d34] border border-[#134e43]/15 backdrop-blur-md dark:bg-white/5 dark:text-[#fafafa] dark:border-[#ffffff]/20",
  glow: "bg-gradient-to-r from-[#103d34] to-[#1b5e52] text-white border border-emerald-400/30 shadow-[0_0_14px_rgba(45,212,191,0.25)] dark:from-[#262626] dark:to-[#1b5e52]",
};

/** Petite pastille avec point de statut anime, posee au-dessus des titres de section. */
export function Badge({ children, variant = "emerald", className = "", dot = true }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${badgeStyles[variant]} ${className}`}
    >
      {dot && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10b981] opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
        </span>
      )}
      <span>{children}</span>
    </span>
  );
}
