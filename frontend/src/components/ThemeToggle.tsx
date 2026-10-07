import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/theme-context';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabel = false,
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleTheme();
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      aria-label={isDark ? 'Passer au mode clair' : 'Passer au mode sombre'}
      title={isDark ? 'Activer le mode clair (White)' : 'Activer le mode sombre (Dark)'}
      className={`relative inline-flex items-center justify-center gap-2 p-2 sm:px-3 sm:py-1.5 rounded-full text-xs font-semibold transition-all duration-300 border focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-400 active:scale-95 cursor-pointer select-none ${
        isDark
          ? 'bg-black/90 hover:bg-[#121c19] text-amber-300 border-emerald-500/35 hover:border-amber-300/50 shadow-[0_0_15px_rgba(251,191,36,0.15)]'
          : 'bg-white/90 hover:bg-white text-[#103d34] border-[#134e43]/20 hover:border-[#134e43]/40 shadow-xs'
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center pointer-events-none">
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="sun-active"
              initial={{ rotate: -90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="text-amber-300"
            >
              <Sun className="w-4 h-4 fill-amber-300/30 text-amber-300" />
            </motion.div>
          ) : (
            <motion.div
              key="moon-active"
              initial={{ rotate: 90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="text-[#103d34]"
            >
              <Moon className="w-4 h-4 text-[#103d34]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showLabel && (
        <span className="font-mono-velora tracking-wider text-[11px] uppercase pointer-events-none">
          {isDark ? 'Mode clair' : 'Mode sombre'}
        </span>
      )}
    </button>
  );
};
