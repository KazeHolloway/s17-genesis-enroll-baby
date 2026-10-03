import pool from '../config/db.js';

// Récupère, pour un parent, les dossiers rattachés avec les informations essentielles et la situation de la déclaration
export const getDossiersDetailles = async (utilisateurId) => {
  const result = await pool.query(
    `SELECT d.id AS dossier_id, d.numero_dossier, d.statut AS statut_dossier,
            e.id AS enfant_id, e.nom, e.prenom, e.sexe, e.date_naissance, e.lieu_naissance, e.statut_vital,
            et.nom AS etablissement_nom,
            dn.statut AS declaration_statut, dn.date_declaration,
            COALESCE(dn.date_limite, e.date_naissance + 30) AS date_limite_declaration,
            COALESCE(dn.date_limite, e.date_naissance + 30) - CURRENT_DATE AS jours_restants_declaration
     FROM acces_dossier a
     JOIN dossiers d ON d.id = a.dossier_id
     JOIN enfants e ON e.id = d.enfant_id
     JOIN etablissements et ON et.id = e.etablissement_id
     LEFT JOIN declarations_naissance dn ON dn.dossier_id = d.id
     WHERE a.utilisateur_id = $1
     ORDER BY e.date_naissance DESC`,
    [utilisateurId]
  );
  return result.rows;
};