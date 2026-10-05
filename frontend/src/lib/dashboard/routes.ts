import type { Utilisateur } from "@/services/api";

/**
 * Route d'accueil correspondant au rôle renvoyé par l'API.
 *
 * `agent_maternite` et `admin` ont les mêmes droits côté back (statistiques,
 * confirmation de vaccin, rendez-vous) : l'admin atterrit donc sur le tableau
 * de bord agent. Si l'admin doit avoir son propre écran, c'est ici qu'il faut
 * ajouter une troisième branche.
 */
export function routePourRole(role: Utilisateur["role"]): string {
  if (role === "parent") return "/parent/dashboard";
  return "/agent/dashboard";
}
