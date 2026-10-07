import * as StatistiquesModel from '../models/statistiquesModel.js';

// Vérifie qu'une chaîne est une vraie date au format AAAA-MM-JJ (refuse par exemple 2026-02-31)
const estDateValide = (texte) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texte)) return false;
  const date = new Date(texte);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === texte;
};

// GET /api/statistiques?debut=AAAA-MM-JJ&fin=AAAA-MM-JJ
export const getStatistiques = async (req, res) => {
  try {
    // Par défaut, la période couvre les 12 derniers mois
    const aujourdhui = new Date();
    const debutParDefaut = new Date(aujourdhui);
    debutParDefaut.setFullYear(debutParDefaut.getFullYear() - 1);

    const debut = req.query.debut || debutParDefaut.toISOString().slice(0, 10);
    const fin = req.query.fin || aujourdhui.toISOString().slice(0, 10);

    if (!estDateValide(debut) || !estDateValide(fin) || debut > fin) {
      return res.status(400).json({
        success: false,
        message: 'Période invalide : utiliser debut et fin au format AAAA-MM-JJ, debut avant fin'
      });
    }

    // Un agent ne voit que son établissement, un admin voit tout ou filtre avec etablissement_id
    let etablissementId = null;
    if (req.user.role === 'agent_maternite') {
      etablissementId = req.user.etablissement_id;
    } else if (req.query.etablissement_id !== undefined) {
      etablissementId = Number(req.query.etablissement_id);
      if (!Number.isInteger(etablissementId)) {
        return res.status(400).json({ success: false, message: 'etablissement_id invalide' });
      }
    }

    const parMois = await StatistiquesModel.getStatsParMois(debut, fin, etablissementId);

    // Totaux calculés à partir des lignes mensuelles
    const total = parMois.reduce((somme, ligne) => ({
      naissances: somme.naissances + ligne.naissances,
      garcons: somme.garcons + ligne.garcons,
      filles: somme.filles + ligne.filles,
      mort_nes: somme.mort_nes + ligne.mort_nes,
      deces: somme.deces + ligne.deces
    }), { naissances: 0, garcons: 0, filles: 0, mort_nes: 0, deces: 0 });

    res.status(200).json({
      success: true,
      message: total.naissances === 0 ? 'Aucune donnée pour cette période' : undefined,
      data: { periode: { debut, fin }, total, par_mois: parMois }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors du calcul des statistiques' });
  }
};