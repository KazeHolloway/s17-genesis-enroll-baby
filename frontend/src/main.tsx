import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// Tokens et classes des dashboards Parent / Agent. Importee ici (et non dans
// les layouts) pour n'etre chargee qu'une fois et garder le perimetre du
// dashboard isole des pages existantes.
import "./styles/dashboard.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
