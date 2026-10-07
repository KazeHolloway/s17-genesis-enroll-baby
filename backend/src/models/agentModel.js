import pool from '../config/db.js';

/**
 * Comptes habilités de la console super admin (`/api/agents`).
 *
 * La colonne `role` porte l'autorisation technique (`agent_maternite` ou
 * `admin`, les seuls rôles que connaissent les guards et le JWT) ; le libellé
 * affiché dans la console (« Sage-femme », « Officier État Civil », …) vit
 * dans `metier`.
 */

const SERVICES = {
  'Sage-femme': 'Maternité & Néonatalogie',
  'Officier État Civil': 'État Civil — Mairie',
  'Médecin Chef': 'Direction médicale',
  Administrateur: 'Administration locale',
};

const COLONNES_AGENTS = `
  SELECT u.id, u.nom_complet, u.telephone, u.email, u.role, u.matricule, u.metier,
         u.actif, u.created_at,
         et.nom AS etablissement_nom, et.ville AS etablissement_ville
  FROM utilisateurs u
  LEFT JOIN etablissements et ON et.id = u.etablissement_id`;

/** Transforme une ligne SQL en objet consommé par la console. */
const versAgent = (ligne) => {
  const libelleRole = ligne.role === 'admin' ? 'Administrateur' : (ligne.metier || 'Sage-femme');
  return {
    id: String(ligne.id),
    nom: ligne.nom_complet,
    email: ligne.email ?? '',
    telephone: ligne.telephone,
    role: libelleRole,
    etablissement: ligne.etablissement_nom ?? 'Non rattaché',
    matricule: ligne.matricule ?? '',
    ville: ligne.etablissement_ville ?? 'Brazzaville',
    service: SERVICES[libelleRole] ?? SERVICES['Sage-femme'],
    actif: ligne.actif,
    dateCreation: new Date(ligne.created_at).toLocaleDateString('fr-FR'),
  };
};

/** Tous les comptes agents et administrateurs, du plus récent au plus ancien. */
export const listerAgents = async () => {
  const result = await pool.query(
    `${COLONNES_AGENTS}
     WHERE u.role IN ('agent_maternite', 'admin')
     ORDER BY u.created_at DESC, u.id DESC`
  );
  return result.rows.map(versAgent);
};

/** Un compte habilité par son identifiant, ou `null`. */
export const getAgent = async (id) => {
  const result = await pool.query(`${COLONNES_AGENTS} WHERE u.id = $1`, [id]);
  return result.rows.length ? versAgent(result.rows[0]) : null;
};

/** Un téléphone déjà pris par un autre compte (contrainte UNIQUE côté base). */
export const telephoneDejaUtilise = async (telephone, saufId = null) => {
  const result = saufId
    ? await pool.query('SELECT id FROM utilisateurs WHERE telephone = $1 AND id <> $2', [
        telephone,
        saufId,
      ])
    : await pool.query('SELECT id FROM utilisateurs WHERE telephone = $1', [telephone]);
  return result.rows.length > 0;
};

/** Un matricule déjà attribué à un autre compte. */
export const matriculeDejaUtilise = async (matricule, saufId = null) => {
  const result = saufId
    ? await pool.query('SELECT id FROM utilisateurs WHERE matricule = $1 AND id <> $2', [
        matricule,
        saufId,
      ])
    : await pool.query('SELECT id FROM utilisateurs WHERE matricule = $1', [matricule]);
  return result.rows.length > 0;
};

/**
 * Résout le nom libre d'établissement saisi dans la console vers un
 * `etablissement_id` : la structure existe déjà ou elle est créée au vol.
 */
export const resoudreEtablissement = async (nom, ville = '') => {
  const nomNettoye = String(nom).trim();
  const existant = await pool.query('SELECT id FROM etablissements WHERE nom ILIKE $1', [
    nomNettoye,
  ]);
  if (existant.rows.length) return existant.rows[0].id;

  const cree = await pool.query(
    `INSERT INTO etablissements (nom, ville)
     VALUES ($1, COALESCE(NULLIF($2, ''), 'Brazzaville'))
     RETURNING id`,
    [nomNettoye, String(ville || '').trim()]
  );
  return cree.rows[0].id;
};

export const creerAgent = async ({
  nom,
  telephone,
  email,
  hash,
  role,
  matricule,
  metier,
  etablissementId,
}) => {
  const result = await pool.query(
    `INSERT INTO utilisateurs
       (nom_complet, telephone, email, mot_de_passe_hash, role, matricule, metier, etablissement_id)
     VALUES ($1, $2, NULLIF($3, ''), $4, $5, $6, $7, $8)
     RETURNING id`,
    [nom, telephone, email, hash, role, matricule, metier, etablissementId]
  );
  return getAgent(result.rows[0].id);
};

/**
 * Met à jour un compte. `hash` et `actif` sont facultatifs : non fournis,
 * ils laissent la valeur actuelle inchangée.
 */
export const modifierAgent = async (
  id,
  { nom, telephone, email, hash, role, matricule, metier, etablissementId, actif }
) => {
  const result = await pool.query(
    `UPDATE utilisateurs
     SET nom_complet = $1,
         telephone = $2,
         email = NULLIF($3, ''),
         role = $4,
         matricule = $5,
         metier = $6,
         etablissement_id = $7,
         mot_de_passe_hash = COALESCE($8, mot_de_passe_hash),
         actif = COALESCE($9, actif),
         updated_at = now()
     WHERE id = $10
     RETURNING id`,
    [nom, telephone, email, role, matricule, metier, etablissementId, hash ?? null, actif ?? null, id]
  );
  if (!result.rows.length) return null;
  return getAgent(id);
};

/** Supprime un compte. `false` si l'identifiant n'existe plus. */
export const supprimerAgent = async (id) => {
  const result = await pool.query('DELETE FROM utilisateurs WHERE id = $1 RETURNING id', [id]);
  return result.rows.length > 0;
};
