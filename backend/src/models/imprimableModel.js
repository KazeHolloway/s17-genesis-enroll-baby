import pool from '../config/db.js';

// Récupère le dossier d'un nouveau-né avec son établissement et sa déclaration
export const getDossierComplet = async (dossierId) => {
  const result = await pool.query(
    `SELECT d.id AS dossier_id, d.numero_dossier, d.statut AS statut_dossier,
            e.id AS enfant_id, e.nom, e.prenom, e.sexe, e.date_naissance, e.lieu_naissance,
            e.poids_naissance, e.taille_naissance, e.statut_vital,
            et.nom AS etablissement_nom, et.ville AS etablissement_ville,
            et.adresse AS etablissement_adresse, et.telephone AS etablissement_telephone,
            dn.numero AS declaration_numero, dn.statut AS declaration_statut, dn.date_declaration,
            COALESCE(dn.date_limite, e.date_naissance + 30) AS date_limite_declaration,
            COALESCE(dn.date_limite, e.date_naissance + 30) - CURRENT_DATE AS jours_restants_declaration
     FROM dossiers d
     JOIN enfants e ON e.id = d.enfant_id
     JOIN etablissements et ON et.id = e.etablissement_id
     LEFT JOIN declarations_naissance dn ON dn.dossier_id = d.id
     WHERE d.id = $1`,
    [dossierId]
  );
  return result.rows[0];
};

// Récupère les parents liés à un enfant
export const getParentsEnfant = async (enfantId) => {
  const result = await pool.query(
    `SELECT p.nom, p.prenom, p.telephone, ep.lien
     FROM enfant_parents ep
     JOIN parents p ON p.id = ep.parent_id
     WHERE ep.enfant_id = $1
     ORDER BY ep.lien`,
    [enfantId]
  );
  return result.rows;
};