import { Navigate } from "react-router-dom";

import { useAuth } from "@/contexts/useAuth";
import { routePourRole } from "@/lib/dashboard/routes";

/**
 * Route de compatibilité pour `/dashboard`.
 *
 * L'ancienne version de la connexion redirigait tous les rôles vers
 * `/dashboard`, une page unique incapable de savoir si l'utilisateur était
 * parent ou agent. La connexion redirige désormais directement vers
 * `/parent/dashboard` ou `/agent/dashboard` selon le rôle ; cette route ne sert
 * plus qu'àiguiller les anciens liens et signets.
 *
 * Sans session, on renvoie vers la connexion plutôt que de boucler : c'est le
 * cas d'un visiteur qui ouvre `/dashboard` en direct.
 */
export default function RedirectionDashboard() {
  const { utilisateur, chargement } = useAuth();

  /* Le contexte vérifie la session stockée au démarrage. Rediriger avant la
     réponse de `GET /auth/moi` enverrait un utilisateur connecté vers la page
     de connexion. */
  if (chargement) return null;

  if (!utilisateur) return <Navigate to="/login" replace />;

  return <Navigate to={routePourRole(utilisateur.role)} replace />;
}
