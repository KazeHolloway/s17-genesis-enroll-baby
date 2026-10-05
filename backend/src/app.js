import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import de nos routes
import enfantRoute from "./routes/enfantRoute.js";
import dossierRoute from "./routes/dossierRoute.js";
import authRoute from "./routes/authRoute.js";
import parentRoute from "./routes/parentRoute.js";
import calendrierRoute from "./routes/calendrierRoute.js";
import imprimableRoute from "./routes/imprimableRoute.js";
import statistiquesRoute from "./routes/statistiquesRoute.js";
import vaccinationRoute from "./routes/vaccinationRoute.js";
import declarationRoute from "./routes/declarationRoute.js";
import certificatRoute from "./routes/certificatRoute.js";
import rendezVousRoute from "./routes/rendezVousRoute.js";

dotenv.config();

const app = express();

// --- Middlewares globaux ---
app.use(cors()); // Autorise les requêtes cross-origin (depuis le front-end)
app.use(express.json()); // Permet de lire le corps des requêtes en JSON
app.use(express.urlencoded({ extended: true })); // Pour parser les form-data si besoin

// --- Définition des routes de l'API ---
app.use("/api/enfants", enfantRoute);
app.use("/api/dossiers", dossierRoute);
app.use("/api/auth", authRoute);
app.use("/api/parents", parentRoute);
app.use("/api/calendrier-vaccinal", calendrierRoute);
app.use("/api/imprimable", imprimableRoute);
app.use("/api/statistiques", statistiquesRoute);
app.use("/api/vaccinations", vaccinationRoute);
app.use("/api/declarations", declarationRoute);
app.use("/api/certificats", certificatRoute);
app.use("/api/rendez-vous", rendezVousRoute);

// --- Route de test de santé (Health check) ---
app.get("/api/health", (req, res) => {
  res
    .status(200)
    .json({ status: "OK", message: "Le serveur fonctionne à merveille 🚀" });
});

// --- Gestion des routes introuvables (404) ---
app.use((req, res, next) => {
  res.status(404).json({ message: "Ressource introuvable" });
});

// --- Gestionnaire d'erreurs global ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Erreur interne du serveur" });
});

export default app;
