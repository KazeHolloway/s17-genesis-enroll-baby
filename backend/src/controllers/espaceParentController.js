import * as EspaceParentModel from '../models/espaceParentModel.js';
import * as CalendrierModel from '../models/calendrierModel.js';
import { construireDeclaration, construireRappels } from '../utils/rappels.js';
import { formaterDate } from '../utils/formaterDate.js';

// Rassemble toutes les informations de l'espace parent pour chaque enfant rattaché au compte
const chargerEspace = async (utilisateurId) => {
  const lignes = await EspaceParentModel.getDossiersDetailles(utilisateurId);

  return Promise.all(lignes.map(async (ligne) => {
    const echeances = await CalendrierModel.getEcheancesEnfant(ligne.enfant_id);
    const declaration = construireDeclaration(ligne);
    const rappels = construireRappels(ligne, declaration, echeances);
    const prochaine = echeances.find((e) => e.statut !== 'effectue') || null;

    // La prochaine démarche est celle du rappel le plus urgent, sinon le prochain vaccin prévu
    let prochaineDemarche = null;
    if (rappels.length > 0) {
      prochaineDemarche = rappels[0].prochaine_demarche;
    } else if (prochaine) {
      prochaineDemarche = `Prochain vaccin : ${prochaine.vaccin_nom} (dose ${prochaine.dose_numero}) le ${formaterDate(prochaine.date_prevue)}`;
    }

    return {
      dossier: { id: ligne.dossier_id, numero: ligne.numero_dossier, statut: ligne.statut_dossier },
      enfant: {
        id: ligne.enfant_id,
        nom: ligne.nom,
        prenom: ligne.prenom,
        sexe: ligne.sexe,
        date_naissance: ligne.date_naissance,
        lieu_naissance: ligne.lieu_naissance,
        statut_vital: ligne.statut_vital,
        etablissement: ligne.etablissement_nom
      },
      declaration,
      prochaine_demarche: prochaineDemarche,
      prochaine_echeance: prochaine,
      echeances,
      rappels
    };
  }));
};

// GET /api/parents/espace
export const getEspace = async (req, res) => {
  try {
    const enfants = await chargerEspace(req.user.id);
    res.status(200).json({ success: true, data: { enfants } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors du chargement de l’espace parent' });
  }
};

// GET /api/parents/rappels
export const getRappels = async (req, res) => {
  try {
    const enfants = await chargerEspace(req.user.id);
    // Tous les rappels des enfants du parent, du plus urgent au moins urgent
    const rappels = enfants
      .flatMap((e) => e.rappels)
      .sort((a, b) => a.jours_restants - b.jours_restants);
    res.status(200).json({ success: true, data: rappels });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors du chargement des rappels' });
  }
};