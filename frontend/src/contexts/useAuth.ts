import { useContext } from "react";

import { AuthContext, type AuthState } from "@/contexts/authContextValue";

/**
 * Accès à la session.
 *
 * Un `useAuth` hors provider est un bug d'architecture : le faire échouer
 * bruyamment vaut mieux qu'un `undefined` silencieux qui casserait plus loin.
 */
export function useAuth(): AuthState {
  const contexte = useContext(AuthContext);
  if (!contexte) {
    throw new Error(
      "useAuth doit être utilisé dans un <AuthProvider>. Vérifie que le composant est placé sous le provider dans main.tsx.",
    );
  }
  return contexte;
}
