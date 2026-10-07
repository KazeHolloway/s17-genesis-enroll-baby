import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";
import { routePourRole } from "@/lib/dashboard/routes";

/**
 * Garde des sections connectées (`/parent/*` et `/agent/*`).
 *
 * Attend la vérification de session au rafraîchissement (sinon une page rechargée
 * clignoterait vers `/login`), puis :
 *  - sans session, redirige vers la connexion en conservant la page visée ;
 *  - avec un rôle exact attendu et un compte qui ne l'a pas (ex. un parent sur
 *    `/agent/*`), redirige vers le tableau de bord correspondant au rôle réel.
 */
export default function RequireAuth({
  role,
  children,
}: {
  role?: "parent" | "agent_maternite" | "admin";
  children: ReactNode;
}) {
  const { utilisateur, chargement } = useAuth();
  const location = useLocation();

  if (chargement) {
    return (
      <div
        className="flex min-h-screen items-center justify-center text-sm text-[var(--app-muted)]"
        role="status"
      >
        Vérification de la session…
      </div>
    );
  }

  if (!utilisateur) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const autorise =
    role === undefined ||
    (role === "parent"
      ? utilisateur.role === "parent"
      : role === "admin"
        ? utilisateur.role === "admin"
        : utilisateur.role === "agent_maternite" ||
          utilisateur.role === "admin");

  if (!autorise) {
    return <Navigate to={routePourRole(utilisateur.role)} replace />;
  }

  return <>{children}</>;
}