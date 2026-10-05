import pool from "../config/db.js";

// Récupère la déclaration d'un dossier (ou rien si elle n'a pas encore été générée)
export const getDeclaration = async (dossierId) => {
  const result = await pool.query(
    "SELECT * FROM declarations_naissance WHERE dossier_id = $1",
    [dossierId],
  );
  return result.rows[0];
};

// Génère la déclaration avec son numéro et le jeton de son certificat (sans effet si elle existe déjà)
export const creerDeclaration = async (dossierId, certificatToken) => {
  const result = await pool.query(
    `WITH n AS (SELECT nextval(pg_get_serial_sequence('declarations_naissance', 'id')) AS id)
     INSERT INTO declarations_naissance (id, dossier_id, numero, certificat_token, certificat_url)
     SELECT n.id, $1, 'DEC-' || to_char(CURRENT_DATE, 'YYYY') || '-' || lpad(n.id::text, 6, '0'),
            $2::text, '/api/certificats/' || $2::text
     FROM n
     ON CONFLICT (dossier_id) DO NOTHING
     RETURNING *`,
    [dossierId, certificatToken],
  );
  return result.rows[0];
};

// Marque la déclaration comme enregistrée à l'état civil
export const marquerDeclaree = async (dossierId, dateDeclaration) => {
  const result = await pool.query(
    `UPDATE declarations_naissance
     SET statut = 'declaree', date_declaration = $2
     WHERE dossier_id = $1
     RETURNING *`,
    [dossierId, dateDeclaration],
  );
  return result.rows[0];
};

// Retrouve le dossier associé à un certificat grâce à son jeton
export const getDossierIdParToken = async (token) => {
  const result = await pool.query(
    "SELECT dossier_id FROM declarations_naissance WHERE certificat_token = $1",
    [token],
  );
  return result.rows[0] ? result.rows[0].dossier_id : null;
};
