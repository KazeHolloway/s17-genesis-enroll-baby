import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/landing/LandingPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ParentLayout from "./layouts/ParentLayout";
import AgentLayout from "./layouts/AgentLayout";
import ParentDashboard from "./pages/parent/ParentDashboard";
import ParentChildren from "./pages/parent/ParentChildren";
import ParentVaccinations from "./pages/parent/ParentVaccinations";
import ParentDocuments from "./pages/parent/ParentDocuments";
import ParentNotifications from "./pages/parent/ParentNotifications";
import ParentSettings from "./pages/parent/ParentSettings";
import AgentDashboard from "./pages/agent/AgentDashboard";
import AgentNewborn from "./pages/agent/AgentNewborn";
import AgentRecords from "./pages/agent/AgentRecords";
import AgentVaccinations from "./pages/agent/AgentVaccinations";
import AgentSettings from "./pages/agent/AgentSettings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* ---------- Dashboard Parent ----------
          Chaque route fille est une page de contenu ; le layout fournit la
          sidebar, l'en-tete et le <Outlet />. */}
      <Route path="/parent" element={<ParentLayout />}>
        <Route index element={<Navigate to="/parent/dashboard" replace />} />
        <Route path="dashboard" element={<ParentDashboard />} />
        <Route path="enfants" element={<ParentChildren />} />
        <Route path="vaccinations" element={<ParentVaccinations />} />
        <Route path="documents" element={<ParentDocuments />} />
        <Route path="notifications" element={<ParentNotifications />} />
        <Route path="parametres" element={<ParentSettings />} />
      </Route>

      {/* ---------- Dashboard Agent de maternite ---------- */}
      <Route path="/agent" element={<AgentLayout />}>
        <Route index element={<Navigate to="/agent/dashboard" replace />} />
        <Route path="dashboard" element={<AgentDashboard />} />
        <Route path="nouveau-ne" element={<AgentNewborn />} />
        <Route path="dossiers" element={<AgentRecords />} />
        <Route path="vaccinations" element={<AgentVaccinations />} />
        {/* Entree dediee pour la confirmation des statuts : la page Vaccins est
            la meme, ouverte sur le bon sous-onglet. Evite de dupliquer la page
            et garde l'URL explicite dans la sidebar. */}
        <Route
          path="statuts"
          element={<AgentVaccinations ongletInitial="statuts" />}
        />
        <Route path="parametres" element={<AgentSettings />} />
      </Route>

      {/* Les deux routes d'index /parent et /agent convergent vers leur
          tableau de bord : pas d'ecran vide apres connexion. */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;