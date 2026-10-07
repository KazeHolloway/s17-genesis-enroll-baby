import { Router } from 'express';
import { getEtablissements } from '../models/etablissementModel.js';
import { authentifier } from '../middlewares/auth.js';

const router = Router();

// GET /api/etablissements : liste des structures de soins actives.
// Accessible à tout utilisateur connecté : le parent en a besoin pour nommer
// l'établissement où son enfant est suivi.
router.get('/', authentifier, async (req, res) => {
  try {
    const etablissements = await getEtablissements();
    res.status(200).json({ success: true, data: etablissements });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la récupération des établissements' });
  }
});

export default router;
