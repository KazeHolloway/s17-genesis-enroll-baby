import pool from '../config/db.js';

/**
 * Liste des établissements, pour alimenter les sélecteurs de l'interface.
 * Seuls les établissements actifs sont proposés : un agent ne doit pas
 * enregistrer un rendez-vous dans une structure désaffectée.
 */
export const getEtablissements = async () => {
  const result = await pool.query(
    `SELECT id, nom, ville, adresse, telephone
     FROM etablissements
     WHERE actif = true
     ORDER BY nom`
  );
  return result.rows;
};

/**
 * Établissement d'un enfant, utilisé pour afficher où le rendez-vous sera
 * enregistré. Le backend déduit l'établissement de l'enfant à la création du
 * rendez-vous : cette information est donc consultative, jamais saisie.
 */
export const getEtablissementEnfant = async (enfantId) => {
  const result = await pool.query(
    `SELECT et.id, et.nom, et.ville
     FROM enfants e
     JOIN etablissements et ON et.id = e.etablissement_id
     WHERE e.id = $1`,
    [enfantId]
  );
  return result.rows[0] ?? null;
};
