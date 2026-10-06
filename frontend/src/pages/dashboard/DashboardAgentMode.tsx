import { useState } from "react";
import { ThemeProvider } from "../../context/ThemeContext";
import { AgentDashboard } from "../../components/agent/AgentDashboard";
import type { Child } from "../../types/dashboard";
import {
  INITIAL_CHILDREN,
  INITIAL_VACCINES,
  INITIAL_DOCUMENTS,
} from "../../data/mockDashboardData";

export default function DashboardAgentMode() {
  const [childrenList, setChildrenList] = useState<Child[]>(INITIAL_CHILDREN);
  const [vaccines] = useState(INITIAL_VACCINES);

  return (
    <ThemeProvider>
      <AgentDashboard
        childrenList={childrenList}
        vaccines={vaccines}
        documents={INITIAL_DOCUMENTS}
        onAddChild={(child) => setChildrenList((prev) => [child, ...prev])}
        onLogout={() => window.location.assign("/")}
        onSwitchToParent={() => window.location.assign("/parent/dashboard")}
      />
    </ThemeProvider>
  );
}