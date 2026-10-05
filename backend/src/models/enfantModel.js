import pool from "../config/db.js";
import { createDossier } from "./dossierModel.js";

// Récupérer tous les nouveau-nés
export const getAllNewborns = async () => {
  const result = await pool.query(
    `SELECT * FROM enfants ORDER BY created_at DESC`,
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
    [id],
  );
  return result.rows[0];
};

// Ajouter un nouveau-né (db = connexion de la transaction, sinon le pool normal)
export const createNewborn = async (data, db = pool) => {
  const result = await db.query(
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
      data.statut_vital ?? "vivant",
      data.etablissement_id,
      data.agent_id,
    ],
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
    ],
  );
  return result.rows[0];
};

// Supprimer un nouveau-né
export const deleteNewborn = async (id) => {
  const result = await pool.query(
    `DELETE FROM enfants WHERE id = $1 RETURNING id`,
    [id],
  );
  return result.rows[0];
};

// ===== NOUVEAU : enregistrement complet (enfant + parents + dossier) =====

// Ajouter la fiche d'un parent (saisie par l'agent)
const createParent = async (data, db) => {
  const result = await db.query(
    `INSERT INTO parents (nom, prenom, telephone, email, adresse)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [data.nom, data.prenom, data.telephone, data.email, data.adresse],
  );
  return result.rows[0];
};

// Lier un parent à un enfant (mere, pere ou tuteur)
const linkParentToChild = async (enfantId, parentId, lien, db) => {
  await db.query(
    `INSERT INTO enfant_parents (enfant_id, parent_id, lien) VALUES ($1, $2, $3)`,
    [enfantId, parentId, lien],
  );
};

// Vérifier si l'enfant existe déjà (évite le doublon)
export const findDuplicateNewborn = async (
  nom,
  prenom,
  date_naissance,
  etablissement_id,
) => {
  const result = await pool.query(
    `SELECT id FROM enfants
     WHERE LOWER(nom) = LOWER($1) AND LOWER(prenom) = LOWER($2)
       AND date_naissance = $3 AND etablissement_id = $4`,
    [nom, prenom, date_naissance, etablissement_id],
  );
  return result.rows[0];
};

// Enregistrer enfant + parents + dossier : tout ou rien (transaction)
export const registerNewborn = async (enfant, parents, codeHash) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const newborn = await createNewborn(enfant, client);

    const savedParents = [];
    for (const p of parents) {
      const parent = await createParent(p, client);
      await linkParentToChild(newborn.id, parent.id, p.lien, client);
      savedParents.push({ ...parent, lien: p.lien });
    }

    const annee = new Date().getFullYear();
    const numero_dossier = `EB-${annee}-${String(newborn.id).padStart(6, "0")}`;
    const dossier = await createDossier(
      newborn.id,
      numero_dossier,
      codeHash,
      null,
      client,
    );
    const { code_acces_hash, ...dossierSansHash } = dossier; // le hash ne sort jamais

    await client.query("COMMIT");
    return { enfant: newborn, parents: savedParents, dossier: dossierSansHash };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
