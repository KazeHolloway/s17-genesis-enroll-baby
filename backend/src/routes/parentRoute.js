import { Router } from 'express';
import { inscrire } from '../controllers/parentController.js';
import { getEspace, getRappels } from '../controllers/espaceParentController.js';
import { authentifier, autoriser } from '../middlewares/auth.js';

const router = Router();

// POST /api/parents/inscription : route publique, le parent n'a pas encore de compte
router.post('/inscription', inscrire);

// GET /api/parents/espace : informations essentielles, déclaration, vaccinations et rappels
router.get('/espace', authentifier, autoriser('parent'), getEspace);

// GET /api/parents/rappels : rappels de tous les enfants du parent
router.get('/rappels', authentifier, autoriser('parent'), getRappels);

export default router;