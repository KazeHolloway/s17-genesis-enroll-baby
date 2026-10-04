import { Router } from 'express';
import {
  postRendezVous,
  getRendezVousEnfant,
  putRendezVous,
  getRappels,
} from '../controllers/rendezVousController.js';
import { authentifier, autoriser } from '../middlewares/auth.js';

const router = Router();

// Toutes les routes exigent d'être connecté
router.use(authentifier);

router.get('/rappels', autoriser('parent'), getRappels);
router.get('/enfant/:enfantId', getRendezVousEnfant);
router.post('/', autoriser('agent_maternite', 'admin'), postRendezVous);
router.put('/:id', autoriser('agent_maternite', 'admin'), putRendezVous);

export default router;