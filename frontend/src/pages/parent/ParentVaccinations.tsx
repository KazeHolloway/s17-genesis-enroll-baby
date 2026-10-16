import PagePlaceholder from "@/components/dashboard/PagePlaceholder";

/**
 * Calendrier de vaccination cote parent.
 *
 * Le compteur de la sidebar (`badge: 1`) et le bloc « Prochaine vaccination »
 * du dashboard_parent pointent deja vers cette page.
 */
export default function ParentVaccinations() {
  return (
    <PagePlaceholder
      title="Vaccinations"
      description="Le calendrier vaccinal de votre enfant : doses effectuées, prochaine échéance et rappel du centre de vaccination."
      hint="À implémenter : frise chronologique des doses, à partir du type VaccinationSummary. Le jour où l’API existera, remplacer les valeurs en dur du tableau de bord par celles de la réponse."
      cta="Retour à l’accueil"
      to="/parent/dashboard"
    />
  );
}