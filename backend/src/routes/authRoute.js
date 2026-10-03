import { Router } from 'express';
import { login, moi } from '../controllers/authController.js';
import { authentifier } from '../middlewares/auth.js';

const router = Router();

// POST /api/auth/login : route publique
router.post('/login', login);

// GET /api/auth/moi : profil de la personne connectée
router.get('/moi', authentifier, moi);

export default router;