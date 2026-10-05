import { Link } from "react-router-dom";

import { useTheme } from "@/contexts/theme-context";

type LogoVariant = "full" | "icon" | "white";

interface LogoProps {
  className?: string;
  variant?: LogoVariant;
}

/** Enroll Baby emblem: a heart embrace sheltering a newborn, with a sprout on top. */
export function Logo({ className = "", variant = "full" }: LogoProps) {
  const { theme } = useTheme();

  // En thème sombre, le tracé vert de la marque passerait sur un fond nuit :
  // on bascule sur la menthe Velora, plus lumineuse.
  const isWhite = variant === "white" || theme === "dark";
  const primaryColor = isWhite ? (theme === "dark" ? "#5eead4" : "#ffffff") : "#134e43";
  const titleColor = isWhite
    ? theme === "dark"
      ? "text-[#fafafa]"
      : "text-white"
    : "text-[#134e43]";
  const baselineColor = isWhite
    ? theme === "dark"
      ? "text-[#a1a1a1]"
      : "text-emerald-100/80"
    : "text-[#55756d]";

  return (
    <div className={`flex min-w-0 select-none items-center gap-2 sm:gap-3 ${className}`}>
      <div className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center sm:h-10 sm:w-10">
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full drop-shadow-sm"
          aria-hidden="true"
        >
          <path
            d="M24 43C24 43 7 32 7 18.5C7 11.5 12.5 6 19.5 6C21.8 6 23.5 6.8 24 7.6C24.5 6.8 26.2 6 28.5 6C35.5 6 41 11.5 41 18.5C41 32 24 43 24 43Z"
            stroke={primaryColor}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={isWhite ? "rgba(255,255,255,0.1)" : "rgba(19, 78, 67, 0.05)"}
          />
          <circle cx="24" cy="18" r="4.2" fill={primaryColor} />
          <path
            d="M17 28C17 23.5 20.2 21 24 21C27.8 21 31 23.5 31 28C31 33 27 35.5 24 35.5C21 35.5 17 33 17 28Z"
            fill={primaryColor}
            opacity="0.9"
          />
          <path
            d="M24 6C23 3 25.5 1 28 2C27 4.5 25 5.5 24 6Z"
            fill={isWhite ? "#a7f3d0" : "#2d8664"}
          />
        </svg>
      </div>

      {variant !== "icon" && (
        <div className="flex min-w-0 flex-col text-left">
          <span
            className={`truncate font-serif text-[1.15rem] font-bold leading-none tracking-tight min-[380px]:text-[1.35rem] ${titleColor}`}
          >
            Enroll Baby
          </span>
          {/* Le tagline cède la place sur les écrans étroits pour laisser
              respirer la pastille de thème et le menu. */}
          <span className={`mt-1 hidden text-[0.72rem] font-medium sm:block ${baselineColor}`}>
            Un avenir en bonne santé
          </span>
        </div>
      )}
    </div>
  );
}

interface BrandProps {
  variant?: LogoVariant;
  className?: string;
}

/** Home link wrapping the emblem. */
export function Brand({ variant = "full", className = "" }: BrandProps) {
  return (
    <Link
      to="/"
      className={`rounded-full transition-transform hover:scale-[1.01] ${className}`}
      aria-label="Enroll Baby — Accueil"
    >
      <Logo variant={variant} />
    </Link>
  );
}