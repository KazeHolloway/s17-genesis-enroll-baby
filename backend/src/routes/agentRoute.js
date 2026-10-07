import { Router } from 'express';
import { lister, creer, modifier, supprimer } from '../controllers/agentController.js';
import { authentifier, autoriser } from '../middlewares/auth.js';

const router = Router();

// Console super admin : la gestion des comptes agents est réservée aux admins
router.use(authentifier, autoriser('admin'));

router.get('/', lister);
router.post('/', creer);
router.put('/:id', modifier);
router.delete('/:id', supprimer);

export default router;
