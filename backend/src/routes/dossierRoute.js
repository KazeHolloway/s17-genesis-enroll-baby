import { Router } from 'express';
import { 
  getDossiers, 
  getDossier, 
  postDossier, 
  putDossier, 
  removeDossier 
} from '../controllers/dossierController.js';
import { authentifier, autoriser } from '../middlewares/auth.js';

const router = Router();

// Toutes les routes des dossiers nécessitent d'être authentifié
router.use(authentifier);

// Réservé aux agents et admins
router.get('/', autoriser('agent_maternite', 'admin'), getDossiers);

// GET /api/dossiers/:id
router.get('/:id', autoriser('agent_maternite', 'admin'), getDossier);

//  Réservé aux agents et admins
router.post('/', autoriser('agent_maternite', 'admin'), postDossier);

//Réservé aux agents et admins
router.put('/:id', autoriser('agent_maternite', 'admin'), putDossier);

// DELETE /api/dossiers/:id - Réservé uniquement aux admins par sécurité
router.delete('/:id', autoriser('admin'), removeDossier);

export default router;