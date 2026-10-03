import * as CalendrierModel from '../models/calendrierModel.js';

// GET /api/calendrier-vaccinal
export const getCalendrier = async (req, res) => {
  try {
    const calendrier = await CalendrierModel.getCalendrierActif();
    res.status(200).json({ success: true, data: calendrier });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la récupération du calendrier' });
  }
};

// GET /api/calendrier-vaccinal/enfant/:enfantId
export const getCalendrierEnfant = async (req, res) => {
  try {
    const enfantId = Number(req.params.enfantId);
    if (!Number.isInteger(enfantId)) {
      return res.status(400).json({ success: false, message: 'Identifiant invalide' });
    }

    // Même réponse si l'enfant n'existe pas ou si l'accès est refusé
    const autorise = await CalendrierModel.peutVoirEnfant(req.user, enfantId);
    if (!autorise) {
      return res.status(404).json({ success: false, message: 'Enfant introuvable' });
    }

    const echeances = await CalendrierModel.getEcheancesEnfant(enfantId);

    // La prochaine échéance est la première qui n'est pas encore effectuée
    const prochaine = echeances.find((e) => e.statut !== 'effectue') || null;

    res.status(200).json({ success: true, data: { prochaine_echeance: prochaine, echeances } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors du calcul des échéances' });
  }
};

// POST /api/calendrier-vaccinal
export const postEntree = async (req, res) => {
  try {
    const { vaccin_id, dose_numero, age_cible_jours, version, date_effet } = req.body;

    if (!Number.isInteger(vaccin_id) || !Number.isInteger(dose_numero) || !Number.isInteger(age_cible_jours)) {
      return res.status(400).json({
        success: false,
        message: 'vaccin_id, dose_numero et age_cible_jours sont obligatoires (nombres entiers)'
      });
    }

    const entree = await CalendrierModel.createEntree({
      vaccin_id,
      dose_numero,
      age_cible_jours,
      version: version ?? null,
      date_effet: date_effet ?? null
    });

    res.status(201).json({ success: true, message: 'Ligne ajoutée au calendrier', data: entree });
  } catch (error) {
    console.error(error);
    if (error.code === '23505') { // Combinaison vaccin, dose et version déjà existante
      return res.status(409).json({ success: false, message: 'Cette dose existe déjà pour ce vaccin et cette version' });
    }
    if (error.code === '23503') { // Le vaccin n'existe pas
      return res.status(400).json({ success: false, message: 'Vaccin introuvable' });
    }
    if (error.code === '23514') { // Valeur interdite par une contrainte CHECK
      return res.status(400).json({ success: false, message: 'Dose ou âge cible invalide' });
    }
    res.status(500).json({ success: false, message: 'Erreur serveur lors de l’ajout au calendrier' });
  }
};

// PUT /api/calendrier-vaccinal/:id
export const putEntree = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ success: false, message: 'Identifiant invalide' });
    }

    const { age_cible_jours, actif } = req.body;
    if (age_cible_jours !== undefined && !Number.isInteger(age_cible_jours)) {
      return res.status(400).json({ success: false, message: 'age_cible_jours doit être un nombre entier' });
    }
    if (actif !== undefined && typeof actif !== 'boolean') {
      return res.status(400).json({ success: false, message: 'actif doit être true ou false' });
    }

    const entree = await CalendrierModel.updateEntree(id, age_cible_jours ?? null, actif ?? null);
    if (!entree) {
      return res.status(404).json({ success: false, message: 'Ligne du calendrier introuvable' });
    }

    res.status(200).json({ success: true, message: 'Calendrier mis à jour', data: entree });
  } catch (error) {
    console.error(error);
    if (error.code === '23514') {
      return res.status(400).json({ success: false, message: 'Âge cible invalide' });
    }
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la mise à jour du calendrier' });
  }
};