import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import LandingPage from "./pages/landing/LandingPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import RedirectionDashboard from "./pages/RedirectionDashboard";

import DashboardParentMode from "./pages/dashboard/DashboardParentMode";
import DashboardAgentMode from "./pages/dashboard/DashboardAgentMode";

function App() {
  return (
    <Routes>
      {/* Pages publiques */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<RedirectionDashboard />} />

      {/* Dashboards implémentés selon le projet de référence (Enroll-Baby-2026).
          Le dashboard parent et le dashboard agent gèrent leur propre
          navigation interne (onglets, tiroir mobile, modales). Tous les chemins
          /parent/* et /agent/* (y compris /parent/dashboard après connexion)
          affichent le dashboard correspondant. */}
      <Route path="/parent/*" element={<DashboardParentMode />} />
      <Route path="/agent/*" element={<DashboardAgentMode />} />

      {/* Route inconnue */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;