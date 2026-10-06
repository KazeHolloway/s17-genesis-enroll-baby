import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";

import {
  ApiError,
  getEspaceParent,
  getToken,
  type ParentEspace,
} from "@/services/api";

interface EspaceParent {
  enfants: ParentEspace[];
  /** Message du backend, affichable tel quel à l'utilisateur. */
  erreur: string | null;
  chargement: boolean;
  rafraichir: () => void;
}

/**
 * Chargement de `GET /api/parents/espace` partagé entre tous les appelants.
 *
 * Pourquoi une source externe au lieu d'un `useState` par composant : cinq
 * composants utilisent cet espace (layout, accueil, calendrier, confirmation des
 * statuts, rendez-vous) et chacun aurait déclenché son propre
 * `GET /api/parents/espace`. `/api/parents` étant plafonné à 10 requêtes par
 * quart d'heure côté serveur, deux ou trois rafraîchissements suffisaient à
 * épuiser le quota et à renvoyer « Trop de tentatives » — alors que la session
 * était parfaitement valide.
 *
 * Le module ci-dessous met en cache une seule promesse partagée : même
 * plusieurs composants montés en même temps, un seul appel part sur le réseau.
 * `useSyncExternalStore` permet à chacun de s'abonner à cet état partagé.
 */

interface Etat {
  enfants: ParentEspace[];
  erreur: string | null;
  chargement: boolean;
}

/** Les deux clés sont figées : `useSyncExternalStore` les compare par identité. */
const VIDE: ParentEspace[] = [];
const ETAT_REPOS: Etat = { enfants: VIDE, erreur: null, chargement: false };

let etat: Etat = ETAT_REPOS;

/**
 * Promesse d'appel en cours. Conservée pour que deux composants montés dans la
 * même frame réutilisent la même requête au lieu d'en lancer deux en parallèle.
 */
let enCours: Promise<void> | null = null;

const abonnes = new Set<() => void>();

function definir(nouvelEtat: Etat): void {
  etat = nouvelEtat;
  for (const notifier of abonnes) notifier();
}

function getInstantane(): Etat {
  return etat;
}

/** `getServerSnapshot` n'est utilisé qu'en rendu serveur : l'API n'y existe pas. */
function getInstantaneServeur(): Etat {
  return ETAT_REPOS;
}

/**
 * Numéro de la requête en cours. Une réponse qui arrive après une autre plus
 * récente est ignorée : sans cela, un rafraîchissement déclenché pendant un
 * chargement peut laisser l'écran afficher d'anciennes données.
 */
let generation = 0;

async function charger(): Promise<void> {
  const mien = ++generation;
  try {
    const reponse = await getEspaceParent();
    if (mien !== generation) return;
    definir({ enfants: reponse.data.enfants, erreur: null, chargement: false });
  } catch (e: unknown) {
    if (mien !== generation) return;
    definir({
      enfants: VIDE,
      erreur:
        e instanceof ApiError ? e.message : "Impossible de charger votre espace",
      chargement: false,
    });
  } finally {
    if (mien === generation) enCours = null;
  }
}

function demander(): void {
  /* Un appel est déjà en vol : on ne le double pas. */
  if (enCours) return;
  /* `chargement` ne passe à `true` que si le cache est réellement vide : le
     poser à chaque refresh ferait clignoter le « Chargement… » à l'écran sans
     raison, et déclencherait un rendu de plus chez chaque abonné. */
  const aDonnees = etat.enfants !== VIDE;
  definir({ ...etat, chargement: aDonnees ? etat.chargement : true });
  enCours = charger();
}

/**
 * Vide le cache. À appeler à la déconnexion : le compte suivant ne doit pas
 * hériter de l'espace du précédent.
 */
export function viderEspaceParent(): void {
  enCours = null;
  /* Invalide les requêtes en vol : leur réponse ne doit pas repeupler le cache
     du compte suivant après une déconnexion. */
  generation += 1;
  definir(ETAT_REPOS);
}

/**
 * Abonnement : enregistre la fonction de notification et renvoie le
 * désabonnement. React appelle celle-ci au démontage du composant.
 */
function abonner(notifier: () => void): () => void {
  abonnes.add(notifier);
  return () => {
    abonnes.delete(notifier);
  };
}

export function useEspaceParent(actif: boolean): EspaceParent {
  const courant = useSyncExternalStore(
    abonner,
    getInstantane,
    getInstantaneServeur,
  );

  useEffect(() => {
    /* Sans session, pas d'appel : inutile d'exposer un 401 au premier rendu
       d'un visiteur, et inutile de consommer le quota de `/api/parents`. */
    if (!actif || !getToken()) return;
    demander();
  }, [actif]);

  const rafraichir = useCallback(() => {
    if (!actif || !getToken()) return;
    /* Le cache est invalidé avant l'appel : `demander` refuse de doubler un
       appel en cours, donc il faut d'abord casser la promesse existante. */
    enCours = null;
    demander();
  }, [actif]);

  /* La valeur retournée doit rester stable entre deux rendus sans changement
     réel : les composants l'utilisent dans les dépendances de leurs effets. */
  const valeur = useMemo<EspaceParent>(
    () => ({
      enfants: actif ? courant.enfants : VIDE,
      erreur: actif ? courant.erreur : null,
      chargement: actif && courant.chargement,
      rafraichir,
    }),
    [actif, courant.enfants, courant.erreur, courant.chargement, rafraichir],
  );

  return valeur;
}
