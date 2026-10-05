import { Route, Routes } from "react-router-dom";
import "./App.css";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { Home } from "lucide-react";
import Dashboard from "./pages/Dashboard";
import Calendrier from "./pages/Calendar";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/calendar" element={<Calendrier />} />

      <Route path="/pro/login" element={<Login />} />
      <Route path="/pro/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
