import { createContext } from "react";

import type { Utilisateur } from "@/services/api";

export interface AuthState {
  utilisateur: Utilisateur | null;
  /** Vrai tant que la session stockée n'a pas été vérifiée. */
  chargement: boolean;
  connexion: (telephone: string, motDePasse: string) => Promise<Utilisateur>;
  deconnexion: () => void;
}

export const AuthContext = createContext<AuthState | null>(null);
