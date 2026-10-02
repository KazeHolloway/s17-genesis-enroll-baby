import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import de vos routes
import enfantRoute from './routes/enfantRoute.js';
import dossierRoute from './routes/dossierRoute.js';


dotenv.config();

const app = express();

// --- Middlewares globaux ---
app.use(cors()); // Autorise les requêtes cross-origin (depuis le front-end)
app.use(express.json()); // Permet de lire le corps des requêtes en JSON
app.use(express.urlencoded({ extended: true })); // Pour parser les form-data si besoin

// --- Définition des routes de l'API ---
app.use('/api/enfants', enfantRoute);
app.use('/api/dossiers', dossierRoute);

// --- Route de test de santé (Health check) ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Le serveur fonctionne à merveille 🚀' });
});

// --- Gestion des routes introuvables (404) ---
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ressource introuvable' });
});

// --- Gestionnaire d'erreurs global ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur interne du serveur' });
});

export default app;