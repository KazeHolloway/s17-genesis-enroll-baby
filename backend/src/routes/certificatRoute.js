import { Router } from 'express';
import { getCertificat } from '../controllers/declarationController.js';

const router = Router();

// GET /api/certificats/:token : certificat numérique, accessible avec le lien secret sans compte
router.get('/:token', getCertificat);

export default router;
