import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import ErrorBoundary from "./components/dashboard/ErrorBoundary";

import LandingPage from "./pages/landing/LandingPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import RedirectionDashboard from "./pages/RedirectionDashboard";

import RequireAuth from "./components/dashboard/RequireAuth";

import ParentLayout from "./layouts/ParentLayout";
import AgentLayout from "./layouts/AgentLayout";

import DashboardParentMode from "./pages/dashboard/DashboardParentMode";
import DashboardAgentMode from "./pages/dashboard/DashboardAgentMode";

import ParentChildren from "./pages/parent/ParentChildren";
import ParentChildDetail from "./pages/parent/ParentChildDetail";
import ParentVaccinations from "./pages/parent/ParentVaccinations";
import ParentDocuments from "./pages/parent/ParentDocuments";
import ParentNotifications from "./pages/parent/ParentNotifications";
import ParentSettings from "./pages/parent/ParentSettings";

import AgentNewborn from "./pages/agent/AgentNewborn";
import AgentRecords from "./pages/agent/AgentRecords";
import DossierEnfant from "./pages/dossiers-enfants/DossierEnfant";
import AgentVaccinations from "./pages/agent/AgentVaccinations";
import AgentSettings from "./pages/agent/AgentSettings";

/**
 * Routage de l'application.
 *
 * `/parent/dashboard` et `/agent/dashboard` rendent les tableaux de bord
 * riches (interface du commit de référence), alimentés par les API actuelles
 * (`useEspaceParent`, `GET /api/enfants`, `GET /api/dossiers`,
 * `GET /api/statistiques`). Ils portent leur propre navigation interne et sont
 * donc montés hors des layouts.
 *
 * Les sous-routes métier (`/parent/enfants/:id`, `/agent/dossiers/:id`,
 * `/agent/nouveau-ne`, …) sont conservées telles quelles pour les liens
 * directs. Les deux espaces passent par `RequireAuth` : sans session la
 * connexion est exigée, un compte du mauvais rôle bascule vers son propre
 * tableau de bord.
 */
function App() {
  return (
    <ErrorBoundary>
      <Routes>
      {/* Pages publiques */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<RedirectionDashboard />} />

      {/* Espace parent — tableau de bord riche (hors coquille : il porte sa
          propre navigation interne) */}
      <Route
        path="/parent/dashboard"
        element={
          <RequireAuth role="parent">
            <DashboardParentMode />
          </RequireAuth>
        }
      />

      {/* Sous-routes métier de l'espace parent : conservées telles quelles
          pour les liens directs et les écrans à profondeur (détail enfant) */}
      <Route
        path="/parent"
        element={
          <RequireAuth role="parent">
            <ParentLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/parent/dashboard" replace />} />
        <Route path="enfants" element={<ParentChildren />} />
        <Route path="enfants/:id" element={<ParentChildDetail />} />
        <Route path="vaccinations" element={<ParentVaccinations />} />
        <Route path="documents" element={<ParentDocuments />} />
        <Route path="notifications" element={<ParentNotifications />} />
        <Route path="parametres" element={<ParentSettings />} />
      </Route>

      {/* Espace agent / admin — tableau de bord riche */}
      <Route
        path="/agent/dashboard"
        element={
          <RequireAuth role="agent_maternite">
            <DashboardAgentMode />
          </RequireAuth>
        }
      />

      {/* Sous-routes métier de l'espace agent : conservées telles quelles */}
      <Route
        path="/agent"
        element={
          <RequireAuth role="agent_maternite">
            <AgentLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/agent/dashboard" replace />} />
        <Route path="nouveau-ne" element={<AgentNewborn />} />
        <Route path="dossiers" element={<AgentRecords />} />
        <Route path="dossiers/:id" element={<DossierEnfant />} />
        <Route path="vaccinations" element={<AgentVaccinations />} />
        <Route
          path="statuts"
          element={<AgentVaccinations ongletInitial="statuts" />}
        />
        <Route path="parametres" element={<AgentSettings />} />
      </Route>

      {/* Route inconnue */}
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;