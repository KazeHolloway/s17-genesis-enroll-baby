import { Router } from 'express';
import { confirmer } from '../controllers/vaccinationController.js';
import { authentifier, autoriser } from '../middlewares/auth.js';

const router = Router();

// POST /api/vaccinations/confirmer : réservé aux agents de maternité et aux admins
router.post('/confirmer', authentifier, autoriser('agent_maternite', 'admin'), confirmer);

export default router;
