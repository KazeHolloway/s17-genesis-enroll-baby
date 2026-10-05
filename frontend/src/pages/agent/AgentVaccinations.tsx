import PagePlaceholder from "@/components/dashboard/PagePlaceholder";

/**
 * Planning de vaccination du service.
 *
 * Le bloc « Vaccinations a suivre » du dashboard agent et le badge de la sidebar
 * (5 echeances) pointent vers cette page.
 */
export default function AgentVaccinations() {
  return (
    <PagePlaceholder
      title="Vaccinations"
      description="Les échéances du service : doses du jour, rappels en retard et suivi par nourrisson."
      hint="À implémenter : planning par semaine alimenté par le type PendingVaccination, avec tri par retard et export. Le compteur du dashboard doit lire la même source."
      cta="Retour à l’accueil"
      to="/agent/dashboard"
    />
  );
}