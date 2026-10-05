import PagePlaceholder from "@/components/dashboard/PagePlaceholder";

/**
 * Parametres du compte parent.
 *
 * Le bouton de theme est deja disponible dans l'en-tete (ThemeToggle) et pilote
 * le ThemeProvider global : cette page ne doit pas le dupliquer.
 */
export default function ParentSettings() {
  return (
    <PagePlaceholder
      title="Paramètres"
      description="Les informations de votre compte : identité, téléphone, adresse et préférences de notification."
      hint="À implémenter : formulaire de consultation pré-rempli, en lecture seule tant que l’API n’expose pas de mise à jour. Le thème se règle déjà via le bouton de l’en-tête."
      cta="Retour à l’accueil"
      to="/parent/dashboard"
    />
  );
}