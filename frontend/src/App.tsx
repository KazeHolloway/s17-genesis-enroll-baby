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

import ParentDashboard from "./pages/parent/ParentDashboard";
import ParentChildren from "./pages/parent/ParentChildren";
import ParentChildDetail from "./pages/parent/ParentChildDetail";
import ParentVaccinations from "./pages/parent/ParentVaccinations";
import ParentDocuments from "./pages/parent/ParentDocuments";
import ParentNotifications from "./pages/parent/ParentNotifications";
import ParentSettings from "./pages/parent/ParentSettings";

import AgentDashboard from "./pages/agent/AgentDashboard";
import AgentNewborn from "./pages/agent/AgentNewborn";
import AgentRecords from "./pages/agent/AgentRecords";
import DossierEnfant from "./pages/dossiers-enfants/DossierEnfant";
import AgentVaccinations from "./pages/agent/AgentVaccinations";
import AgentSettings from "./pages/agent/AgentSettings";

/**
 * Routage de l'application.
 *
 * Les espaces `/parent/*` et `/agent/*` sont branchés sur les layouts et les
 * pages API existants : navigation de la coquille, données de l'espace parent
 * (`useEspaceParent`) et écrans agent (registre, vaccinations, création de
 * dossier). Les deux sections sont protégées par `RequireAuth` : sans session,
 * la connexion est exigée ; un compte qui n'a pas le rôle bascule vers son propre
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

      {/* Espace parent */}
      <Route
        path="/parent"
        element={
          <RequireAuth role="parent">
            <ParentLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/parent/dashboard" replace />} />
        <Route path="dashboard" element={<ParentDashboard />} />
        <Route path="enfants" element={<ParentChildren />} />
        <Route path="enfants/:id" element={<ParentChildDetail />} />
        <Route path="vaccinations" element={<ParentVaccinations />} />
        <Route path="documents" element={<ParentDocuments />} />
        <Route path="notifications" element={<ParentNotifications />} />
        <Route path="parametres" element={<ParentSettings />} />
      </Route>

      {/* Espace agent / admin */}
      <Route
        path="/agent"
        element={
          <RequireAuth role="agent_maternite">
            <AgentLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/agent/dashboard" replace />} />
        <Route path="dashboard" element={<AgentDashboard />} />
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