import PagePlaceholder from "@/components/dashboard/PagePlaceholder";

/**
 * Enregistrement d'un nouveau-ne par l'agent.
 *
 * Seul le point d'entree du futur formulaire est livre. La page elle-meme est
 * un placeholder : aucun champ n'est cree ici, conformement au perimetre de ce
 * lot (coquilles, navigation, tableaux de bord).
 */
export default function AgentNewborn() {
  return (
    <PagePlaceholder
      title="Nouveau-né"
      description="L’enregistrement d’une naissance : identité du bébé, données de la mère, poids, taille et informations deVaccination."
      hint="À implémenter : formulaire multi-étapes. Penser à conserver le lien « Enregistrer un nouveau-né » du dashboard agent et à valider l’accès avant d’ouvrir la page (rôle Agent de maternité)."
      cta="Retour a l’accueil"
      to="/agent/dashboard"
    />
  );
}