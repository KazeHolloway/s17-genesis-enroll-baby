import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  login as apiLogin,
  moi as apiMoi,
  setToken,
  getToken,
  type Utilisateur,
} from "@/services/api";
import { AuthContext } from "@/contexts/authContextValue";

export function AuthProvider({ children }: { children: ReactNode }) {
  /* L'état initial lit le token : si aucun n'est stocké, la session est vide
     dès le premier rendu et il n'y a rien à vérifier. Évite un setState dans
     l'effet pour le cas le plus fréquent (visiteur non connecté). */
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);
  const [chargement, setChargement] = useState(() => Boolean(getToken()));

  // Reconnexion automatique : le token dure 1 jour et survit au rafraîchissement.
  // Un token périmé est traité comme une session vide.
  useEffect(() => {
    if (!getToken()) return;

    let ignore = false;

    void apiMoi().then(({ utilisateur: u }) => {
      if (ignore) return;
      if (!u) setToken(null);
      setUtilisateur(u);
      setChargement(false);
    });

    return () => {
      ignore = true;
    };
  }, []);

  const connexion = useCallback(
    async (telephone: string, motDePasse: string) => {
      const reponse = await apiLogin(telephone, motDePasse);
      setToken(reponse.data.token);
      setUtilisateur(reponse.data.utilisateur);
      return reponse.data.utilisateur;
    },
    [],
  );

  const deconnexion = useCallback(() => {
    setToken(null);
    setUtilisateur(null);
  }, []);

  const valeur = useMemo(
    () => ({ utilisateur, chargement, connexion, deconnexion }),
    [utilisateur, chargement, connexion, deconnexion],
  );

  return <AuthContext.Provider value={valeur}>{children}</AuthContext.Provider>;
}
