import { Outlet } from "react-router-dom";
import DashboardShell from "@/components/dashboard/DashboardShell";
import {
  parentBottomNavItems,
  parentNavItems,
} from "@/lib/dashboard/navigation";
import { useAuth } from "@/contexts/useAuth";
import { identiteUtilisateur } from "@/services/api";
import { useEspaceParent } from "@/lib/dashboard/useEspaceParent";

/**
 * Layout du dashboard Parent.
 *
 * Il ne fait que fournir la navigation et le compte connecté à la coquille ;
 * chaque page enfant est injectée par le routeur via <Outlet />.
 *
 * L'identité vient de la session, plus du mock : le backend fournit `prenom` et
 * `nom` du parent connecté.
 *
 * Le compteur de notifications est dérivé de `espace.rappels` plutôt que d'un
 * mock : il doit correspondre aux échéances réelles du dossier.
 */
export default function ParentLayout() {
  const { utilisateur, chargement } = useAuth();
  const { enfants } = useEspaceParent(utilisateur?.role === "parent");

  /* `nom_complet` est la seule colonne stockée côté backend : le prénom et le
     nom sont dérivés ici. Un accès direct à `utilisateur.prenom` donnerait
     `undefined` et ferait tomber l'écran au premier rendu. */
  const identite = identiteUtilisateur(utilisateur);

  const unreadCount = enfants.reduce(
    (total, espace) => total + espace.rappels.length,
    0,
  );

  return (
    <DashboardShell
      navItems={parentNavItems}
      bottomNavItems={parentBottomNavItems}
      user={{
        firstName: identite.firstName,
        lastName: identite.lastName,
        roleLabel: "Parent",
        initials: identite.initials,
      }}
      /* Tant que la session n'est pas vérifiée, on ne déclare pas de compteur :
         afficher « 0 » puis « 3 » ferait clignoter la cloche au chargement. */
      unreadCount={chargement ? 0 : unreadCount}
      notificationsTo="/parent/notifications"
    >
      <Outlet />
    </DashboardShell>
  );
}
