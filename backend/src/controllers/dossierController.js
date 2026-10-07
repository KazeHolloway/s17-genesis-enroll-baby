import * as DossierModel from '../models/dossierModel.js';

// GET /api/dossiers
export const getDossiers = async (req, res) => {
  try {
    const dossiers = await DossierModel.getAllDossiers();
    res.status(200).json({ success: true, data: dossiers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la récupération des dossiers' });
  }
};

// GET /api/dossiers/:id
export const getDossier = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ success: false, message: 'Identifiant invalide' });
    }

    const dossier = await DossierModel.getDossierById(id);
    if (!dossier) {
      return res.status(404).json({ success: false, message: 'Dossier introuvable' });
    }

    res.status(200).json({ success: true, data: dossier });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la récupération du dossier' });
  }
};

// POST /api/dossiers
export const postDossier = async (req, res) => {
  try {
    const { enfant_id, numero_dossier, code_acces_hash, code_expire_at } = req.body;

    if (!enfant_id || !numero_dossier || !code_acces_hash) {
      return res.status(400).json({ 
        success: false, 
        message: 'L’ID de l’enfant, le numéro de dossier et le code d’accès haché sont obligatoires' 
      });
    }

    const newDossier = await DossierModel.createDossier(
      enfant_id, 
      numero_dossier, 
      code_acces_hash, 
      code_expire_at || null
    );

    res.status(201).json({ success: true, message: 'Dossier créé avec succès', data: newDossier });
  } catch (error) {
    console.error(error);
    if (error.code === '23505') { // Code PostgreSQL pour violation d'unicité (ex: numéro de dossier ou enfant_id déjà existant)
      return res.status(400).json({ success: false, message: 'Ce numéro de dossier ou cet enfant possède déjà un dossier' });
    }
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la création du dossier' });
  }
};

// PUT /api/dossiers/:id
export const putDossier = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ success: false, message: 'Identifiant invalide' });
    }

    const { statut, code_acces_hash, code_expire_at } = req.body;

    if (statut && !['actif', 'archive'].includes(statut)) {
      return res.status(400).json({ success: false, message: 'Statut de dossier invalide (actif ou archive)' });
    }

    const updated = await DossierModel.updateDossier(id, statut, code_acces_hash, code_expire_at);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Dossier introuvable' });
    }

    res.status(200).json({ success: true, message: 'Dossier mis à jour avec succès', data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la mise à jour du dossier' });
  }
};

// DELETE /api/dossiers/:id
export const removeDossier = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ success: false, message: 'Identifiant invalide' });
    }

    const deleted = await DossierModel.deleteDossier(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Dossier introuvable' });
    }

    res.status(200).json({ success: true, message: 'Dossier supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la suppression du dossier' });
  }
};