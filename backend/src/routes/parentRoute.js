import { Router } from 'express';
import { inscrire } from '../controllers/parentController.js';

const router = Router();

// POST /api/parents/inscription : route publique, le parent n'a pas encore de compte
router.post('/inscription', inscrire);

export default router;