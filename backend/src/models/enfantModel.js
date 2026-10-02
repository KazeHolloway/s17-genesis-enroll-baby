import pool from '../config/db.js';

// Récupérer tous les nouveau-nés
export const getAllNewborns = async () => {
  const result = await pool.query(
    `SELECT * FROM enfants ORDER BY created_at DESC`
  );
  return result.rows;
};

// Récupérer un nouveau-né par son id
export const getNewbornById = async (id) => {
  const result = await pool.query(
    `SELECT e.*, d.numero_dossier
     FROM enfants e
     LEFT JOIN dossiers d ON d.enfant_id = e.id
     WHERE e.id = $1`,
    [id]
  );
  return result.rows[0];
};

// Ajouter un nouveau-né
export const createNewborn = async (data) => {
  const result = await pool.query(
    `INSERT INTO enfants
       (nom, prenom, sexe, date_naissance, lieu_naissance, photo_url,
        poids_naissance, taille_naissance, statut_vital, etablissement_id, agent_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING *`,
    [
      data.nom,
      data.prenom,
      data.sexe,
      data.date_naissance,
      data.lieu_naissance,
      data.photo_url,
      data.poids_naissance,
      data.taille_naissance,
      // Sans statut vital envoyé, on applique la valeur par défaut 'vivant'
      data.statut_vital ?? 'vivant',
      data.etablissement_id,
      data.agent_id,
    ]
  );
  return result.rows[0];
};

// Modifier un nouveau-né (un champ non envoyé garde sa valeur actuelle)
export const updateNewborn = async (id, data) => {
  const result = await pool.query(
    `UPDATE enfants
     SET nom              = COALESCE($1, nom),
         prenom           = COALESCE($2, prenom),
         sexe             = COALESCE($3, sexe),
         date_naissance   = COALESCE($4, date_naissance),
         lieu_naissance   = COALESCE($5, lieu_naissance),
         photo_url        = COALESCE($6, photo_url),
         poids_naissance  = COALESCE($7, poids_naissance),
         taille_naissance = COALESCE($8, taille_naissance),
         statut_vital     = COALESCE($9, statut_vital)
     WHERE id = $10
     RETURNING *`,
    [
      data.nom,
      data.prenom,
      data.sexe,
      data.date_naissance,
      data.lieu_naissance,
      data.photo_url,
      data.poids_naissance,
      data.taille_naissance,
      data.statut_vital,
      id,
    ]
  );
  return result.rows[0];
};

// Supprimer un nouveau-né
export const deleteNewborn = async (id) => {
  const result = await pool.query(
    `DELETE FROM enfants WHERE id = $1 RETURNING id`,
    [id]
  );
  return result.rows[0];
};
