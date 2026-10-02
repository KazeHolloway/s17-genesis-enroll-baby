import {
  getAllNewborns,
  getNewbornById,
  createNewborn,
  updateNewborn,
  deleteNewborn,
} from '../models/enfant.model.js';

// Gère les erreurs PostgreSQL les plus courantes
const handleError = (error, res) => {
  console.error(error);

  if (error.code === '22P02') {
    return res.status(400).json({ message: 'Une valeur envoyée a un format invalide' });
  }
  if (error.code === '23514') {
    return res.status(400).json({ message: 'La date de naissance ne peut pas être dans le futur' });
  }
  if (error.code === '23503') {
    return res.status(400).json({ message: 'Établissement ou agent introuvable' });
  }
  return res.status(500).json({ message: 'Erreur interne du serveur' });
};

// GET /api/enfants
export const getAll = async (req, res) => {
  try {
    const enfants = await getAllNewborns();
    res.status(200).json(enfants);
  } catch (error) {
    handleError(error, res);
  }
};

// GET /api/enfants/:id
export const getById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: 'Identifiant invalide' });
    }

    const enfant = await getNewbornById(id);
    if (!enfant) {
      return res.status(404).json({ message: 'Nouveau-né introuvable' });
    }

    res.status(200).json(enfant);
  } catch (error) {
    handleError(error, res);
  }
};

// POST /api/enfants
export const create = async (req, res) => {
  try {
    const { nom, prenom, sexe, date_naissance } = req.body;

    if (!nom || !prenom || !sexe || !date_naissance) {
      return res.status(400).json({
        message: 'Nom, prénom, sexe et date de naissance sont obligatoires',
      });
    }
    if (sexe !== 'M' && sexe !== 'F') {
      return res.status(400).json({ message: 'Le sexe doit être M ou F' });
    }

    const enfant = await createNewborn({
      ...req.body,
      agent_id: req.user.id,                       // pris dans le token
      etablissement_id: req.user.etablissement_id, // pris dans le token
    });

    res.status(201).json(enfant);
  } catch (error) {
    handleError(error, res);
  }
};

// PUT /api/enfants/:id
export const update = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: 'Identifiant invalide' });
    }

    const { sexe } = req.body;
    if (sexe && sexe !== 'M' && sexe !== 'F') {
      return res.status(400).json({ message: 'Le sexe doit être M ou F' });
    }

    const enfant = await updateNewborn(id, req.body);
    if (!enfant) {
      return res.status(404).json({ message: 'Nouveau-né introuvable' });
    }

    res.status(200).json(enfant);
  } catch (error) {
    handleError(error, res);
  }
};

// DELETE /api/enfants/:id
export const remove = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: 'Identifiant invalide' });
    }

    const supprime = await deleteNewborn(id);
    if (!supprime) {
      return res.status(404).json({ message: 'Nouveau-né introuvable' });
    }

    res.status(200).json({ message: 'Nouveau-né supprimé' });
  } catch (error) {
    handleError(error, res);
  }
};