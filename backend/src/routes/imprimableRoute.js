import { Router } from 'express';
import { getDossierImprimable } from '../controllers/imprimableController.js';
import { authentifier } from '../middlewares/auth.js';

const router = Router();

// GET /api/imprimable/dossier/:dossierId : page HTML prête à imprimer (agent, admin ou parent du dossier)
router.get('/dossier/:dossierId', authentifier, getDossierImprimable);

export default router;