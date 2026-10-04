import { Router } from 'express';
import { getStatistiques } from '../controllers/statistiquesController.js';
import { authentifier, autoriser } from '../middlewares/auth.js';

const router = Router();

// GET /api/statistiques : réservé aux agents de maternité et aux admins
router.get('/', authentifier, autoriser('agent_maternite', 'admin'), getStatistiques);

export default router;