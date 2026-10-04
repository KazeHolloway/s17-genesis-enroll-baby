import * as RendezVousModel from '../models/rendezVousModel.js';
import { peutVoirEnfant } from '../models/calendrierModel.js';

const STATUTS = ['planifie', 'honore', 'manque', 'annule'];

// POST /api/rendez-vous
export const postRendezVous = async (req, res) => {
  try {
    const { enfant_id, date_rdv, motif, vaccination_id } = req.body;

    if (!Number.isInteger(enfant_id) || !date_rdv) {
      return res.status(400).json({ success: false, message: 'enfant_id et date_rdv sont obligatoires' });
    }
    const date = new Date(date_rdv);
    if (isNaN(date) || date <= new Date()) {
      return res.status(400).json({ success: false, message: 'La date du rendez-vous doit être valide et dans le futur' });
    }

    // Un agent ne peut créer un rendez-vous que pour un enfant de son établissement
    if (!(await peutVoirEnfant(req.user, enfant_id))) {
      return res.status(404).json({ success: false, message: 'Enfant introuvable' });
    }

    const rdv = await RendezVousModel.createRendezVous({ enfant_id, date_rdv, motif, vaccination_id });
    res.status(201).json({ success: true, message: 'Rendez-vous créé', data: rdv });
  } catch (error) {
    console.error(error);
    if (error.code === '23503') {
      return res.status(400).json({ success: false, message: 'Vaccination introuvable' });
    }
    if (error.code === '22P02') {
      return res.status(400).json({ success: false, message: 'Une valeur envoyée a un format invalide' });
    }
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la création du rendez-vous' });
  }
};

// GET /api/rendez-vous/enfant/:enfantId
export const getRendezVousEnfant = async (req, res) => {
  try {
    const enfantId = Number(req.params.enfantId);
    if (!Number.isInteger(enfantId)) {
      return res.status(400).json({ success: false, message: 'Identifiant invalide' });
    }
    if (!(await peutVoirEnfant(req.user, enfantId))) {
      return res.status(404).json({ success: false, message: 'Enfant introuvable' });
    }

    const rdvs = await RendezVousModel.getRendezVousByEnfant(enfantId);
    res.status(200).json({ success: true, data: rdvs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la récupération des rendez-vous' });
  }
};

// PUT /api/rendez-vous/:id  (modifier ou annuler avec statut = "annule")
export const putRendezVous = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ success: false, message: 'Identifiant invalide' });
    }

    const { date_rdv, motif, statut } = req.body;
    if (statut && !STATUTS.includes(statut)) {
      return res.status(400).json({ success: false, message: 'Statut invalide (planifie, honore, manque, annule)' });
    }
    if (date_rdv && isNaN(new Date(date_rdv))) {
      return res.status(400).json({ success: false, message: 'Date invalide' });
    }

    const existant = await RendezVousModel.getRendezVousById(id);
    if (!existant || !(await peutVoirEnfant(req.user, existant.enfant_id))) {
      return res.status(404).json({ success: false, message: 'Rendez-vous introuvable' });
    }

    const rdv = await RendezVousModel.updateRendezVous(id, { date_rdv, motif, statut });
    res.status(200).json({ success: true, message: 'Rendez-vous mis à jour', data: rdv });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la mise à jour du rendez-vous' });
  }
};

// GET /api/rendez-vous/rappels  (rappels 24 h du parent connecté)
export const getRappels = async (req, res) => {
  try {
    const rappels = await RendezVousModel.getRappelsParent(req.user.id);
    res.status(200).json({ success: true, data: rappels });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la récupération des rappels' });
  }
};