import PagePlaceholder from "@/components/dashboard/PagePlaceholder";

/**
 * Parametres du compte agent.
 *
 * Comme pour le parent, le theme est deja accessible via le bouton de l'en-tete.
 */
export default function AgentSettings() {
  return (
    <PagePlaceholder
      title="Paramètres"
      description="Le profil de l’agent, son service d’affectation et ses préférences de notification."
      hint="À implémenter : lecture des informations du compte et, si le rôle le permet, les paramètres du service (horaires de vaccination, modèles de documents)."
      cta="Retour à l’accueil"
      to="/agent/dashboard"
    />
  );
}