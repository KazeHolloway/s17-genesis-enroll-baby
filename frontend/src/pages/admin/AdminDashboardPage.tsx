import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminDashboard } from "../../components/admin/AdminDashboard";
import { ThemeProvider } from "../../context/ThemeContext";
import type { AgentUser, Child } from "../../types/dashboard";
import { AGENTS_DEMO } from "../../data/mockDashboardData";
import {
  getDossiers,
  getEnfantDetail,
  getEnfants,
  type EnfantDetail,
} from "../../services/api";
import {
  agentVersEnfants,
  dossiersParEnfant,
} from "../../lib/dashboard/adaptateurs";
import { useAuth } from "../../contexts/useAuth";

/**
 * Console super admin (`/admin/dashboard`).
 *
 * - Enfants : réels (`GET /api/enfants`, `/api/dossiers`, `/api/enfants/:id`),
 *   comme l'espace agent.
 * - Agents : état local (`AGENTS_DEMO`), le backend n'expose aucun endpoint
 *   CRUD `/api/agents` — les créations/éditions/suppressions vivent donc en
 *   mémoire le temps d'une session.
 */
export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { deconnexion } = useAuth();

  const [agents, setAgents] = useState<AgentUser[]>(AGENTS_DEMO);
  const [childrenList, setChildrenList] = useState<Child[]>([]);

  useEffect(() => {
    let ignore = false;

    async function charger() {
      try {
        const [liste, reponseDossiers] = await Promise.all([
          getEnfants(),
          getDossiers(),
        ]);
        const index = dossiersParEnfant(reponseDossiers.data);
        const details: EnfantDetail[] = await Promise.all(
          liste.map(async (enfant) => {
            try {
              return await getEnfantDetail(enfant.id);
            } catch {
              return {
                ...enfant,
                numero_dossier: index.get(enfant.id)?.numero ?? null,
                parents: [],
              };
            }
          }),
        );
        if (ignore) return;
        setChildrenList(agentVersEnfants(details, index));
      } catch {
        /* API indisponible : la console s'affiche avec 0 dossier. */
      }
    }

    charger();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <ThemeProvider>
      <AdminDashboard
      agents={agents}
      childrenList={childrenList}
      onAddAgent={(nouvel) => setAgents((courants) => [nouvel, ...courants])}
      onUpdateAgent={(maj) =>
        setAgents((courants) =>
          courants.map((ag) =>
            (ag.id && ag.id === maj.id) || ag.matricule === maj.matricule
              ? maj
              : ag,
          ),
        )
      }
      onDeleteAgent={(id) =>
        setAgents((courants) =>
          courants.filter((ag) => ag.id !== id && ag.matricule !== id),
        )
      }
      onLogout={() => {
        deconnexion();
        navigate("/");
      }}
    />
    </ThemeProvider>
  );
}
