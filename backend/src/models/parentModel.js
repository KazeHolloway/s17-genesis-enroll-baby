import pool from '../config/db.js';

// Cherche un dossier à partir de l'empreinte de son code d'accès
export const getDossierByCodeHash = async (codeHash) => {
  const result = await pool.query(
    `SELECT d.id, d.enfant_id, d.statut, d.code_expire_at,
            EXISTS (SELECT 1 FROM acces_dossier a WHERE a.dossier_id = d.id) AS deja_utilise
     FROM dossiers d
     WHERE d.code_acces_hash = $1`,
    [codeHash]
  );
  return result.rows[0];
};

// Crée le compte parent et le rattache au dossier (tout ou rien grâce à la transaction)
export const createParentAccount = async (data) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Verrouille la ligne du dossier pour éviter que deux parents utilisent le même code en même temps
    await client.query('SELECT id FROM dossiers WHERE id = $1 FOR UPDATE', [data.dossier_id]);
    const dejaUtilise = await client.query(
      'SELECT 1 FROM acces_dossier WHERE dossier_id = $1',
      [data.dossier_id]
    );
    if (dejaUtilise.rows.length > 0) {
      const erreur = new Error('Code déjà utilisé');
      erreur.code = 'CODE_UTILISE';
      throw erreur;
    }

    // Création du compte utilisateur avec le rôle parent
    const compte = await client.query(
      `INSERT INTO utilisateurs (nom_complet, telephone, email, mot_de_passe_hash, role)
       VALUES ($1, $2, $3, $4, 'parent')
       RETURNING id, nom_complet, telephone, email, role, created_at`,
      [data.nom_complet, data.telephone, data.email, data.mot_de_passe_hash]
    );
    const utilisateur = compte.rows[0];

    // Rattachement du compte au dossier de l'enfant
    await client.query(
      'INSERT INTO acces_dossier (utilisateur_id, dossier_id) VALUES ($1, $2)',
      [utilisateur.id, data.dossier_id]
    );

    // Rattache la fiche parent saisie par l'agent si le téléphone correspond
    await client.query(
      `UPDATE parents SET utilisateur_id = $1
       WHERE utilisateur_id IS NULL AND telephone = $2
       AND id IN (SELECT parent_id FROM enfant_parents WHERE enfant_id = $3)`,
      [utilisateur.id, data.telephone, data.enfant_id]
    );

    await client.query('COMMIT');
    return utilisateur;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};