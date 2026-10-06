import PagePlaceholder from "@/components/dashboard/PagePlaceholder";

/**
 *liste complete des notifications du parent.
 *
 * La cloche de l'en-tete et le bloc « Notifications » du dashboard aboutissent
 * ici ; `unreadCount` du layout Parent correspond au badge de la cloche.
 */
export default function ParentNotifications() {
  return (
    <PagePlaceholder
      title="Notifications"
      description="Tous les messages de votre compte : rappels de vaccination, documents manquants et confirmations de mise a jour."
      hint="À implémenter : liste paginée issue du type NotificationItem, avec filtre « non lues » et action « marquer comme lue ». Le compteur du layout doit être branché sur la même source de données."
      cta="Retour à l’accueil"
      to="/parent/dashboard"
    />
  );
}