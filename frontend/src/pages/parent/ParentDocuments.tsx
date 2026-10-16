import PagePlaceholder from "@/components/dashboard/PagePlaceholder";

/**
 * Espace documents du parent.
 *
 * Relie au compte a rebours « Declaration a l’etat civil » du dashboard et au
 * rappel de document manquant dans les notifications.
 */
export default function ParentDocuments() {
  return (
    <PagePlaceholder
      title="Documents"
      description="Les pièces de votre dossier : acte de naissance, fiche de vaccination et justificatifs demandés."
      hint="À implémenter : liste des documents avec statut (reçu, attendu), aperçu du fichier et téléchargement. Ne pas construire le formulaire d’envoi ici : c’est une page de consultation."
      cta="Retour à l’accueil"
      to="/parent/dashboard"
    />
  );
}