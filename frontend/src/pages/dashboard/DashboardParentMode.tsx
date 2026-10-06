import { useState } from "react";
import { ThemeProvider } from "../../context/ThemeContext";
import { ParentDashboard } from "../../components/parent/ParentDashboard";
import type { Child, VaccineItem } from "../../types/dashboard";
import {
  INITIAL_CHILDREN,
  INITIAL_VACCINES,
  INITIAL_DOCUMENTS,
  INITIAL_NOTIFICATIONS,
} from "../../data/mockDashboardData";

export default function DashboardParentMode() {
  const [childrenList, setChildrenList] = useState<Child[]>(INITIAL_CHILDREN);
  const [vaccines, setVaccines] = useState<VaccineItem[]>(INITIAL_VACCINES);

  return (
    <ThemeProvider>
      <ParentDashboard
        childrenList={childrenList}
        vaccines={vaccines}
        documents={INITIAL_DOCUMENTS}
        notifications={INITIAL_NOTIFICATIONS}
        onAddChild={(child) => setChildrenList((prev) => [child, ...prev])}
        onUpdateChild={(child) =>
          setChildrenList((prev) => prev.map((c) => (c.id === child.id ? child : c)))
        }
        onUpdateVaccines={(next) => setVaccines(next)}
        onLogout={() => window.location.assign("/")}
        onSwitchToAgent={() => window.location.assign("/agent/dashboard")}
      />
    </ThemeProvider>
  );
}