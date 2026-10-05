import { Router } from "express";
import {
  getCompteARebours,
  getDeclarationDossier,
  getDeclarationImprimable,
  declarer,
} from "../controllers/declarationController.js";
import { authentifier, autoriser } from "../middlewares/auth.js";

const router = Router();

// Toutes les routes de déclaration nécessitent d'être connecté
router.use(authentifier);

// GET /api/declarations/dossier/:dossierId/compte-a-rebours : délai restant avant J+30
router.get("/dossier/:dossierId/compte-a-rebours", getCompteARebours);

// GET /api/declarations/dossier/:dossierId/imprimable : déclaration prête à imprimer
router.get("/dossier/:dossierId/imprimable", getDeclarationImprimable);

// GET /api/declarations/dossier/:dossierId : déclaration (générée si besoin) et lien du certificat
router.get("/dossier/:dossierId", getDeclarationDossier);

// PUT /api/declarations/dossier/:dossierId/declarer : enregistre la déclaration à l'état civil
router.put(
  "/dossier/:dossierId/declarer",
  autoriser("agent_maternite", "admin"),
  declarer,
);

export default router;
