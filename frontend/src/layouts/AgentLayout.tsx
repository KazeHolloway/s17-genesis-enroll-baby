import { Outlet } from "react-router-dom";
import DashboardShell from "@/components/dashboard/DashboardShell";
import {
  agentBottomNavItems,
  agentNavItems,
} from "@/lib/dashboard/navigation";
import { agentProfileMock } from "@/lib/dashboard/mockAgentData";

/**
 * Layout du dashboard Agent de maternité.
 *
 * Même coque que le dashboard Parent : navigation, compte connecté et <Outlet />.
 * Aucun bouton d'action métier dans le layout ; le formulaire d'enregistrement
 * du nouveau-né reste une page fille, conformément au périmètre de ce lot.
 */
export default function AgentLayout() {
  const agent = agentProfileMock;

  return (
    <DashboardShell
      navItems={agentNavItems}
      bottomNavItems={agentBottomNavItems}
      user={{
        firstName: agent.firstName,
        lastName: agent.lastName,
        roleLabel: agent.roleLabel,
        initials: agent.initials,
        facility: agent.facility,
        matricule: agent.matricule,
      }}
      identity={{
        role: agent.roleLabel,
        name: `${agent.firstName} ${agent.lastName}`,
        facility: agent.facility,
      }}
    >
      <Outlet />
    </DashboardShell>
  );
}