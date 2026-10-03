import pool from '../config/db.js';

// Récupérer tous les dossiers (avec les infos de l'enfant associé)
export const getAllDossiers = async () => {
  const result = await pool.query(
    `SELECT d.*, e.nom as enfant_nom, e.prenom as enfant_prenom 
     FROM dossiers d
     JOIN enfants e ON e.id = d.enfant_id
     ORDER BY d.created_at DESC;`
  );
  return result.rows;
};

//  GET by ID : Récupérer un dossier par son ID
export const getDossierById = async (id) => {
  const result = await pool.query(
    `SELECT d.*, e.nom as enfant_nom, e.prenom as enfant_prenom 
     FROM dossiers d
     JOIN enfants e ON e.id = d.enfant_id
     WHERE d.id = $1;`,
    [id]
  );
  return result.rows[0];
};

//  POST : Créer un dossier pour un enfant
export const createDossier = async (enfant_id, numero_dossier, code_acces_hash, code_expire_at, db= pool) => {
  const result = await db.query(
    `INSERT INTO dossiers (enfant_id, numero_dossier, code_acces_hash, code_expire_at)
     VALUES ($1, $2, $3, $4)
     RETURNING *;`,
    [enfant_id, numero_dossier, code_acces_hash, code_expire_at]
  );
  return result.rows[0];
};

// PUT : Mettre à jour un dossier (statut ou code d'accès)
export const updateDossier = async (id, statut, code_acces_hash, code_expire_at) => {
  const result = await pool.query(
    `UPDATE dossiers
     SET statut          = COALESCE($1, statut),
         code_acces_hash = COALESCE($2, code_acces_hash),
         code_expire_at  = COALESCE($3, code_expire_at)
     WHERE id = $4
     RETURNING *;`,
    [statut, code_acces_hash, code_expire_at, id]
  );
  return result.rows[0];
};

// DELETE : Supprimer un dossier
export const deleteDossier = async (id) => {
  const result = await pool.query(
    `DELETE FROM dossiers WHERE id = $1 RETURNING id;`,
    [id]
  );
  return result.rows[0];
};