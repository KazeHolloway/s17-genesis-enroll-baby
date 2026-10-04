import * as VaccinationModel from '../models/vaccinationModel.js';
import * as CalendrierModel from '../models/calendrierModel.js';
import { estDateValide, dateDuJour } from '../utils/validerDate.js';

// POST /api/vaccinations/confirmer
export const confirmer = async (req, res) => {
  try {
    const { enfant_id, calendrier_id, date_administration, numero_lot } = req.body;

    if (!Number.isInteger(enfant_id) || !Number.isInteger(calendrier_id)) {
      return res.status(400).json({
        success: false,
        message: 'enfant_id et calendrier_id sont obligatoires (nombres entiers)'
      });
    }

    // Sans date envoyée, on prend la date du jour
    const dateAdmin = date_administration || dateDuJour();
    if (!estDateValide(dateAdmin) || dateAdmin > dateDuJour()) {
      return res.status(400).json({
        success: false,
        message: 'Date d’administration invalide (format AAAA-MM-JJ, pas dans le futur)'
      });
    }
    if (numero_lot !== undefined && numero_lot !== null && String(numero_lot).length > 50) {
      return res.status(400).json({ success: false, message: 'Numéro de lot trop long (50 caractères maximum)' });
    }

    const ligne = await VaccinationModel.getEnfantEtCalendrier(enfant_id, calendrier_id);
    const autorise = ligne && await CalendrierModel.peutVoirEnfant(req.user, enfant_id);

    // Même réponse si le vaccin ou l'enfant n'existe pas, ou si l'accès est refusé
    if (!autorise) {
      return res.status(404).json({ success: false, message: 'Vaccin ou enfant introuvable' });
    }
    if (dateAdmin < ligne.date_naissance) {
      return res.status(400).json({
        success: false,
        message: 'La date d’administration ne peut pas précéder la date de naissance'
      });
    }

    const vaccination = await VaccinationModel.confirmerVaccination({
      enfant_id,
      calendrier_id,
      date_prevue: ligne.date_prevue,
      date_administration: dateAdmin,
      agent_id: req.user.id,
      etablissement_id: ligne.etablissement_id,
      numero_lot: numero_lot || null
    });

    res.status(200).json({
      success: true,
      message: `Vaccin ${ligne.vaccin_nom} (dose ${ligne.dose_numero}) enregistré comme administré`,
      data: vaccination
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la confirmation du vaccin' });
  }
};
