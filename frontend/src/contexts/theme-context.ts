import { createContext, useContext } from "react";

/** Choix offert par le sélecteur de thème. `system` suit la préférence OS. */
export type ThemePreference = "light" | "dark" | "system";
/** Thème réellement appliqué, une fois `system` résolu. */
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "enroll-baby-theme";
export const DARK_MEDIA_QUERY = "(prefers-color-scheme: dark)";

export interface ThemeContextValue {
  /** Préférence choisie par l'utilisateur. */
  preference: ThemePreference;
  /** Thème effectif, prêt à être consommé. */
  theme: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
  /** Bascule entre clair et sombre en partant du thème courant. */
  toggle: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme doit être utilisé à l'intérieur de <ThemeProvider>.");
  }
  return context;
}