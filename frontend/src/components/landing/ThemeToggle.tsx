import { motion } from "motion/react";
import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/contexts/theme-context";

interface ThemeToggleProps {
  className?: string;
}

/**
 * Bouton de thème Velora : un seul contrôle qui bascule entre clair et sombre.
 * L'icône suit le thème actif et tourne croisé à chaque bascule. Au premier
 * visite, le thème est celui du systeme ; le premier clic le fige.
 */
export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  const label = isDark ? "Passer en mode clair" : "Passer en mode sombre";
  const Icon = isDark ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[#134e43]/15 bg-white/70 backdrop-blur-md transition-colors hover:bg-[#ebf5f0] after:absolute after:-inset-1 after:content-[''] sm:h-10 sm:w-10 dark:border-[#ffffff]/20 dark:bg-white/5 dark:hover:bg-white/10 ${className}`}
    >
      <motion.span
        key={isDark ? "moon" : "sun"}
        initial={{ opacity: 0, rotate: -60, scale: 0.5 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-center"
      >
        <Icon className="h-4 w-4 text-[#134e43] sm:h-[1.15rem] sm:w-[1.15rem] dark:text-[#5eead4]" aria-hidden="true" />
      </motion.span>
    </button>
  );
}