import { Router } from 'express';
import {
  getCalendrier,
  getCalendrierEnfant,
  postEntree,
  putEntree
} from '../controllers/calendrierController.js';
import { authentifier, autoriser } from '../middlewares/auth.js';

const router = Router();

// Toutes les routes du calendrier nécessitent d'être connecté
router.use(authentifier);

// GET /api/calendrier-vaccinal : calendrier de référence, visible par tout utilisateur connecté
router.get('/', getCalendrier);

// GET /api/calendrier-vaccinal/enfant/:enfantId : échéances calculées pour un enfant
router.get('/enfant/:enfantId', getCalendrierEnfant);

// Configuration du calendrier : réservée aux admins
router.post('/', autoriser('admin'), postEntree);
router.put('/:id', autoriser('admin'), putEntree);

export default router;