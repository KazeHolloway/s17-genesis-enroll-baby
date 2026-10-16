import PagePlaceholder from "@/components/dashboard/PagePlaceholder";

/**
 * Annuaire des dossiers du service.
 *
 * La vue tableau du dashboard agent (> 768px) sert de reference visuelle pour
 * la liste complete : memes libelles, meme pastille de statut.
 */
export default function AgentRecords() {
  return (
    <PagePlaceholder
      title="Dossiers"
      description="Tous les dossiers du service : recherche, filtres par statut et ouverture d’une fiche pour compléter les pièces manquantes."
      hint="À implémenter : table paginée alimentée par le type NewbornRecord, avec filtre « incomplets » (le badge de la sidebar vaut 3) et pagination prévue pour le mobile."
      cta="Retour à l’accueil"
      to="/agent/dashboard"
    />
  );
}