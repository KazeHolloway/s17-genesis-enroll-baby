import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import {
  DARK_MEDIA_QUERY,
  ThemeContext,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type ThemeContextValue,
  type ThemePreference,
} from "./theme-context";

function isThemePreference(value: unknown): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia(DARK_MEDIA_QUERY).matches ? "dark" : "light";
}

/**
 * Défaut : `light`.
 *
 * Un visiteur dont l'OS est en mode sombre arrivait sur la landing en thème
 * sombre alors que la maquette est claire. `system` reste proposé dans le
 * sélecteur, c'est seulement l'absence de choix enregistré qui vaut `light`.
 */
const DEFAULT_PREFERENCE: ThemePreference = "light";

function readStoredPreference(): ThemePreference {
  if (typeof window === "undefined") return DEFAULT_PREFERENCE;
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemePreference(stored) ? stored : DEFAULT_PREFERENCE;
  } catch {
    return DEFAULT_PREFERENCE;
  }
}

function applyTheme(resolved: ResolvedTheme) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = resolved;
  // `color-scheme` pilote les barres de défilement et les contrôles natifs.
  document.documentElement.style.colorScheme = resolved;
}

/**
 * Fournit la préférence de thème à l'application et l'applique sur `<html>`
 * via `data-theme`, que la feuille de style Velora exploite pour le mode sombre.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(readStoredPreference);
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme);

  // Suit les changements de préférence OS tant que l'utilisateur n'a pas choisi.
  useEffect(() => {
    if (!window.matchMedia) return;
    const media = window.matchMedia(DARK_MEDIA_QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? "dark" : "light");
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const theme: ResolvedTheme = preference === "system" ? systemTheme : preference;

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Stockage indisponible (mode privé) : la préférence reste valable pour la session.
    }
  }, []);

  const toggle = useCallback(() => {
    setPreferenceState((current) => {
      const currentResolved =
        current === "system"
          ? window.matchMedia?.(DARK_MEDIA_QUERY).matches
            ? "dark"
            : "light"
          : current;
      const next: ThemePreference = currentResolved === "dark" ? "light" : "dark";
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // Idem : on ignore l'échec d'écriture.
      }
      return next;
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ preference, theme, setPreference, toggle }),
    [preference, theme, setPreference, toggle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}