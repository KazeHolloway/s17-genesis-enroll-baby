import { useCallback, useEffect, useState } from "react";

import {
  ApiError,
  getEspaceParent,
  type ParentEspace,
} from "@/services/api";

interface EspaceParent {
  enfants: ParentEspace[];
  /** Message du backend, affichable tel quel à l'utilisateur. */
  erreur: string | null;
  chargement: boolean;
  rafraichir: () => void;
}

interface Donnees {
  enfants: ParentEspace[];
  erreur: string | null;
}

/**
 * Charge `GET /api/parents/espace`, qui fournit en un seul appel l'essentiel de
 * l'espace parent : dossier, compte à rebours J+30, calendrier vaccinal et
 * rappels.
 *
 * L'état n'est écrit qu'après le `await` : l'effet ne déclenche donc aucun
 * setState synchrone, ce qui évite la cascade de rendus que React 19 signale.
 * Le drapeau `ignore` écarte les réponses arrivant après un démontage.
 *
 * `jeton` sert de déclencheur de rechargement manuel : l'effet dépend d'un
 * scalaire, pas d'une fonction recréée à chaque rendu.
 */
export function useEspaceParent(actif: boolean): EspaceParent {
  const [donnees, setDonnees] = useState<Donnees>({
    enfants: [],
    erreur: null,
  });
  const [chargement, setChargement] = useState(actif);
  const [jeton, setJeton] = useState(0);

  useEffect(() => {
  // Sans session, pas d'appel : inutile d'exposer un 401 au premier rendu
  // d'un visiteur.
  if (!actif) return;

  let ignore = false;

  void (async () => {
      try {
        const reponse = await getEspaceParent();
        if (ignore) return;
        setDonnees({ enfants: reponse.data.enfants, erreur: null });
      } catch (e: unknown) {
        if (ignore) return;
        setDonnees({
          enfants: [],
          erreur:
            e instanceof ApiError
              ? e.message
              : "Impossible de charger votre espace",
        });
      } finally {
        if (!ignore) setChargement(false);
      }
    })();

    return () => {
    ignore = true;
  };
}, [actif, jeton]);

const rafraichir = useCallback(() => {
  setChargement(true);
  setJeton((n) => n + 1);
}, []);

  return {
    enfants: actif ? donnees.enfants : [],
    erreur: actif ? donnees.erreur : null,
    chargement: actif && chargement,
    rafraichir,
  };
}
