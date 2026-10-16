import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardShell from "@/components/dashboard/DashboardShell";
import {
  agentBottomNavItems,
  agentNavItems,
} from "@/lib/dashboard/navigation";
import { useAuth } from "@/contexts/useAuth";
import {
  getEtablissements,
  identiteUtilisateur,
  type Etablissement,
} from "@/services/api";

/**
 * Layout du dashboard Agent de maternité.
 *
 * Même coque que le dashboard Parent : navigation, compte connecté et <Outlet />.
 * L'identité vient de la session (`useAuth`), et l'établissement d'affectation
 * est résolu depuis `GET /api/etablissements` grâce à `etablissement_id`.
 */
export default function AgentLayout() {
  const { utilisateur } = useAuth();
  const identite = identiteUtilisateur(utilisateur);

  const [etablissements, setEtablissements] = useState<Etablissement[]>([]);

  useEffect(() => {
    let ignore = false;
    getEtablissements()
      .then((reponse) => {
        if (!ignore) setEtablissements(reponse.data);
      })
      .catch(() => {
        /* Sans établissement résolu, l'en-tête affiche simplement le rôle. */
      });
    return () => {
      ignore = true;
    };
  }, []);

  const etablissement = etablissements.find(
    (e) => e.id === utilisateur?.etablissement_id,
  );
  const facility =
    etablissement?.nom ?? (utilisateur?.etablissement_id ? "Maternité" : "");
  const roleLabel =
    utilisateur?.role === "admin"
      ? "Administrateur"
      : "Agent de maternité";
  const matricule = utilisateur
    ? `AG-${String(utilisateur.id).padStart(3, "0")}`
    : "";
  const nomComplet =
    [identite.firstName, identite.lastName].filter(Boolean).join(" ") || "Agent";

  return (
    <DashboardShell
      navItems={agentNavItems}
      bottomNavItems={agentBottomNavItems}
      user={{
        firstName: identite.firstName,
        lastName: identite.lastName,
        roleLabel,
        initials: identite.initials,
        ...(facility ? { facility } : {}),
        matricule,
      }}
      identity={{ role: roleLabel, name: nomComplet, facility }}
    >
      <Outlet />
    </DashboardShell>
  );
}