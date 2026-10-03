import {
  getAllNewborns,
  getNewbornById,
  createNewborn,
  updateNewborn,
  deleteNewborn,
} from '../models/enfantModel.js';
import { createDossier } from '../models/dossierModel.js';
import { genererCodeAcces, hacherCodeAcces } from '../utils/codeAcces.js';
import { nettoyerTelephone } from './parentController.js';

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
    const { nom, prenom, sexe, date_naissance, statut_vital } = req.body;

    if (!nom || !prenom || !sexe || !date_naissance) {
      return res.status(400).json({
        message: 'Nom, prénom, sexe et date de naissance sont obligatoires',
      });
    }
    if (sexe !== 'M' && sexe !== 'F') {
      return res.status(400).json({ message: 'Le sexe doit être M ou F' });
    }

    // Validation du statut vital (facultatif, 'vivant' par défaut)
    if (statut_vital && !['vivant', 'mort_ne', 'decede'].includes(statut_vital)) {
      return res.status(400).json({
        message: 'Statut vital invalide (valeurs autorisées : vivant, mort_ne, decede)',
      });
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

// POST /api/enfants/enregistrement
export const register = async (req, res) => {
  try {
    const { enfant, parents } = req.body;

    if (!enfant || !enfant.nom || !enfant.prenom || !enfant.sexe || !enfant.date_naissance) {
      return res.status(400).json({
        message: 'Nom, prénom, sexe et date de naissance de l\'enfant sont obligatoires',
      });
    }
    if (enfant.sexe !== 'M' && enfant.sexe !== 'F') {
      return res.status(400).json({ message: 'Le sexe doit être M ou F' });
    }
    if (enfant.statut_vital && !['vivant', 'mort_ne', 'decede'].includes(enfant.statut_vital)) {
      return res.status(400).json({ message: 'Statut vital invalide' });
    }
    if (!Array.isArray(parents) || parents.length === 0) {
      return res.status(400).json({ message: 'Au moins un parent est obligatoire' });
    }
    for (const p of parents) {
      if (!p.nom || !p.prenom || !['mere', 'pere', 'tuteur'].includes(p.lien)) {
        return res.status(400).json({
          message: 'Chaque parent doit avoir un nom, un prénom et un lien (mere, pere ou tuteur)',
        });
      }
    }

    const doublon = await findDuplicateNewborn(
      enfant.nom, enfant.prenom, enfant.date_naissance, req.user.etablissement_id
    );
    if (doublon) {
      return res.status(409).json({
        message: 'Un nouveau-né avec ce nom et cette date de naissance existe déjà',
        enfant_id: doublon.id,
      });
    }

    // Même nettoyage du téléphone que l'inscription du parent
    const parentsNettoyes = parents.map((p) => ({
      ...p,
      telephone: p.telephone ? nettoyerTelephone(p.telephone) : null,
    }));

    const code = genererCodeAcces();
    const result = await registerNewborn(
      { ...enfant, agent_id: req.user.id, etablissement_id: req.user.etablissement_id },
      parentsNettoyes,
      hacherCodeAcces(code)
    );

    // Le code en clair n'est renvoyé qu'ici, une seule fois
    result.dossier.code_acces = code;
    res.status(201).json(result);
  } catch (error) {
    handleError(error, res);
  }
};