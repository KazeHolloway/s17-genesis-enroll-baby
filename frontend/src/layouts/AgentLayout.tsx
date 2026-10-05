import { Outlet } from "react-router-dom";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { agentNavItems } from "@/lib/dashboard/navigation";
import { agentProfileMock } from "@/lib/dashboard/mockAgentData";

/**
 * Layout du dashboard Agent de maternite.
 *
 * Meme coque que le dashboard Parent : navigation, compte connecte et <Outlet />.
 * Aucun bouton d'action metier ici ; le formulaire d'enregistrement du
 * nouveau-ne sera une page fille, pas un element du layout.
 */
export default function AgentLayout() {
  const agent = agentProfileMock;

  return (
    <DashboardShell
      navItems={agentNavItems}
      user={{
        firstName: agent.firstName,
        lastName: agent.lastName,
        roleLabel: agent.roleLabel,
        initials: agent.initials,
      }}
    >
      <Outlet />
    </DashboardShell>
  );
}