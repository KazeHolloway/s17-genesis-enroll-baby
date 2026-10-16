import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "../../context/ThemeContext";
import { ParentDashboard } from "../../components/parent/ParentDashboard";
import type {
  Child,
  DocumentItem,
  NotificationItem,
  VaccineItem,
} from "../../types/dashboard";
import { useAuth } from "../../contexts/useAuth";
import { useEspaceParent } from "../../lib/dashboard/useEspaceParent";
import {
  echeancesVersVaccins,
  espaceVersDocuments,
  espaceVersEnfants,
  rappelsVersNotifications,
} from "../../lib/dashboard/adaptateurs";

/**
 * Espace parent — tableaux de bord riches (interface du commit de référence).
 *
 * Les données proviennent exclusivement de `GET /api/parents/espace` via le
 * cache partagé `useEspaceParent` : aucun jeu de démonstration n'est conservé.
 */
export default function DashboardParentMode() {
  const navigate = useNavigate();
  const { utilisateur, deconnexion } = useAuth();
  const { enfants, chargement, erreur, rafraichir } = useEspaceParent(
    utilisateur?.role === "parent",
  );

  const [enfantsRiches, setEnfantsRiches] = useState<Child[]>([]);
  const [vaccins, setVaccins] = useState<VaccineItem[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const adaptes = espaceVersEnfants(enfants, utilisateur);
    setEnfantsRiches(adaptes);
    setVaccins(enfants.flatMap((e) => echeancesVersVaccins(String(e.enfant.id), e.echeances)));
    setDocuments(enfants.flatMap(espaceVersDocuments));
    setNotifications(rappelsVersNotifications(enfants));
  }, [enfants, utilisateur]);

  const avis = useMemo(() => {
    if (chargement && enfantsRiches.length === 0) {
      return "Chargement de votre espace…";
    }
    if (erreur) return erreur;
    return null;
  }, [chargement, erreur, enfantsRiches.length]);

  if (avis && enfantsRiches.length === 0) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-[#f3f7f4] dark:bg-black flex items-center justify-center px-6">
          <div className="max-w-md text-center space-y-3">
            <p className="text-sm font-semibold text-[#103d34] dark:text-emerald-100">
              {avis}
            </p>
            {erreur && (
              <button
                onClick={rafraichir}
                className="px-4 py-2 rounded-xl bg-[#1b5e52] text-white text-xs font-bold cursor-pointer"
              >
                Réessayer
              </button>
            )}
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <ParentDashboard
        childrenList={enfantsRiches}
        vaccines={vaccins}
        documents={documents}
        notifications={notifications}
        utilisateur={utilisateur}
        onLogout={() => {
          deconnexion();
          navigate("/");
        }}
        onSwitchToAgent={() => navigate("/agent/dashboard")}
      />
    </ThemeProvider>
  );
}
