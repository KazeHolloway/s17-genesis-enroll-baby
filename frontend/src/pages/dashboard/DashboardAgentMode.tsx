import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "../../context/ThemeContext";
import { AgentDashboard } from "../../components/agent/AgentDashboard";
import type { AgentUser, Child, VaccineItem } from "../../types/dashboard";
import {
  getCalendrierVaccinal,
  getDossiers,
  getEnfantDetail,
  getEnfants,
  getEtablissements,
  getStatistiques,
  enregistrerEnfant,
  type Etablissement,
  type EnfantDetail,
  type Statistiques,
} from "../../services/api";
import { useAuth } from "../../contexts/useAuth";
import {
  agentVersEnfants,
  childVersEnregistrement,
  dossiersParEnfant,
  echeancesVersVaccins,
} from "../../lib/dashboard/adaptateurs";

/** Repère d'identité affiché dans le bandeau agent (aucun matricule côté API). */
function matriculeDe(id: number | undefined): string {
  return `AGT-${String(id ?? 0).padStart(4, "0")}`;
}

function libelleRole(role: string | undefined): string {
  if (role === "admin") return "Administrateur";
  return "Sage-femme";
}

/**
 * Espace agent — tableaux de bord riches (interface du commit de référence).
 *
 * Registre, calendrier vaccinal et statistiques sont chargés depuis
 * `GET /api/enfants`, `GET /api/dossiers`, `GET /api/enfants/:id`,
 * `GET /api/calendrier-vaccinal/enfant/:id` et `GET /api/statistiques`.
 */
export default function DashboardAgentMode() {
  const navigate = useNavigate();
  const { utilisateur, deconnexion } = useAuth();

  const [enfants, setEnfants] = useState<Child[]>([]);
  const [vaccins, setVaccins] = useState<VaccineItem[]>([]);
  const [agent, setAgent] = useState<AgentUser | null>(null);
  const [statistiques, setStatistiques] = useState<Statistiques | null>(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [recharge, setRecharge] = useState(0);

  useEffect(() => {
    if (utilisateur?.role !== "agent_maternite") return;
    let ignore = false;

    async function charger() {
      setChargement(true);
      setErreur(null);
      const annee = new Date().getFullYear();
      try {
        const [liste, reponseDossiers, etablissements, statistiques] =
          await Promise.all([
            getEnfants(),
            getDossiers(),
            getEtablissements().catch(
              (): { success: boolean; data: Etablissement[] } => ({
                success: false,
                data: [],
              }),
            ),
            getStatistiques(`${annee}-01-01`, `${annee}-12-31`).catch(
              (): { success: boolean; data: Statistiques } | null => null,
            ),
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

        const vaccinsDeTous = await Promise.all(
          details.map(async (detail) => {
            try {
              const calendrier = await getCalendrierVaccinal(detail.id);
              return echeancesVersVaccins(
                String(detail.id),
                calendrier.data.echeances,
              );
            } catch {
              return [] as VaccineItem[];
            }
          }),
        );

        const etablissement = etablissements.data.find(
          (e) => e.id === utilisateur?.etablissement_id,
        );

        if (ignore) return;
        setEnfants(agentVersEnfants(details, index));
        setVaccins(vaccinsDeTous.flat());
        setStatistiques(statistiques?.data ?? null);
        setAgent({
          nom: utilisateur?.nom_complet ?? "",
          role: libelleRole(utilisateur?.role),
          etablissement: etablissement?.nom ?? "",
          matricule: matriculeDe(utilisateur?.id),
          ville: etablissement?.ville ?? "",
        });
        setChargement(false);
      } catch (e) {
        if (ignore) return;
        setErreur(
          e instanceof Error ? e.message : "Impossible de charger l'espace agent",
        );
        setChargement(false);
      }
    }

    void charger();
    return () => {
      ignore = true;
    };
  }, [utilisateur, recharge]);

  /** `POST /api/enfants/enregistrement` : renvoie l'enfant réellement créé. */
  const creer = async (child: Child): Promise<Child> => {
    const payload = childVersEnregistrement(child);
    const reponse = await enregistrerEnfant(payload);
    return {
      ...child,
      id: String(reponse.enfant.id),
      referenceMaternite: reponse.dossier.numero,
      codeAccesParent: reponse.dossier.code_acces,
    };
  };

  const dosesAdministrees = useMemo(
    () => vaccins.filter((v) => v.statut === "administre").length,
    [vaccins],
  );
  const dossiersComplets = useMemo(
    () => enfants.filter((c) => c.status === "complet").length,
    [enfants],
  );

  const kpi = useMemo(() => {
    const naissances = statistiques?.total.naissances ?? enfants.length;
    const vivantes =
      naissances - (statistiques ? statistiques.total.mort_nes : 0);
    const tauxSurvie =
      naissances > 0
        ? `${Math.round((vivantes / naissances) * 1000) / 10}%`
        : "—";
    return {
      naissances,
      naissancesVivantes: vivantes,
      tauxSurvie,
      dossiers: enfants.length,
      dossiersComplets,
      doses: vaccins.length,
      dosesAdministrees,
      deces: statistiques?.total.deces ?? 0,
      mortNes: statistiques?.total.mort_nes ?? 0,
      garcons: statistiques?.total.garcons ?? 0,
      filles: statistiques?.total.filles ?? 0,
      parMois: statistiques?.par_mois ?? [],
    };
  }, [statistiques, enfants.length, dossiersComplets, vaccins.length, dosesAdministrees]);

  if (chargement && enfants.length === 0) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-[#f3f7f4] dark:bg-black flex items-center justify-center px-6">
          <p className="text-sm font-semibold text-[#103d34] dark:text-emerald-100">
            Chargement de l'espace agent…
          </p>
        </div>
      </ThemeProvider>
    );
  }

  if (erreur && enfants.length === 0) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-[#f3f7f4] dark:bg-black flex items-center justify-center px-6">
          <div className="max-w-md text-center space-y-3">
            <p className="text-sm font-semibold text-[#103d34] dark:text-emerald-100">
              {erreur}
            </p>
            <button
              onClick={() => navigate(0)}
              className="px-4 py-2 rounded-xl bg-[#1b5e52] text-white text-xs font-bold cursor-pointer"
            >
              Réessayer
            </button>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <AgentDashboard
        agent={agent}
        kpi={kpi}
        childrenList={enfants}
        vaccines={vaccins}
        documents={[]}
        onAddChild={() => setRecharge((r) => r + 1)}
        creer={creer}
        onLogout={() => {
          deconnexion();
          navigate("/");
        }}
        onSwitchToParent={() => navigate("/parent/dashboard")}
      />
    </ThemeProvider>
  );
}
