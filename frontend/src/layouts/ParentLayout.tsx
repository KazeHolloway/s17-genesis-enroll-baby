import { Outlet } from "react-router-dom";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { parentNavItems } from "@/lib/dashboard/navigation";
import { parentDashboardMock } from "@/lib/dashboard/mockParentData";

/**
 * Layout du dashboard Parent.
 *
 * Il ne fait que fournir la navigation et le compte connecte a la coquille ;
 * chaque page enfant est injectee par le routeur via <Outlet />.
 *
 * Branchement API : remplacer `parentDashboardMock.parent` par les donnees du
 * parent issues de la session, et `unreadCount` par le compteur de notifications.
 */
export default function ParentLayout() {
  const { parent, notifications } = parentDashboardMock;
  const unreadCount = notifications.filter((item) => !item.read).length;

  return (
    <DashboardShell
      navItems={parentNavItems}
      user={{
        firstName: parent.firstName,
        lastName: parent.lastName,
        roleLabel: parent.roleLabel,
        initials: parent.initials,
      }}
      unreadCount={unreadCount}
      notificationsTo="/parent/notifications"
    >
      <Outlet />
    </DashboardShell>
  );
}