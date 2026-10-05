import PagePlaceholder from "@/components/dashboard/PagePlaceholder";

/**
 * Espace enfant du parent.
 *
 * Structure et navigation livrees ; seule la liste des enfants reste a
 * implementer. Le composant est volontairement isole : il peut etre remplace
 * sans toucher au layout Parent ni aux autres pages.
 */
export default function ParentChildren() {
  return (
    <PagePlaceholder
      title="Mes enfants"
      description="La liste des enfants rattachés à votre compte, avec leur dossier, leur statut et leurs prochaines échéances."
      hint="À implémenter : cartouche par enfant (identité, dossier, statut), puis un lien vers la fiche détaillée. Réutiliser DashboardCard et les types de @/lib/dashboard/types."
      cta="Retour à l’accueil"
      to="/parent/dashboard"
    />
  );
}