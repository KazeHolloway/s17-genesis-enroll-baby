import pool from '../config/db.js';

// Cherche un utilisateur par son numéro de téléphone (pour la connexion)
export const getUtilisateurByTelephone = async (telephone) => {
  const result = await pool.query(
    `SELECT id, nom_complet, telephone, email, mot_de_passe_hash, role, etablissement_id, actif
     FROM utilisateurs WHERE telephone = $1`,
    [telephone]
  );
  return result.rows[0];
};

// Cherche un utilisateur par son identifiant, sans le mot de passe
export const getUtilisateurById = async (id) => {
  const result = await pool.query(
    `SELECT id, nom_complet, telephone, email, role, etablissement_id, actif
     FROM utilisateurs WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

// Liste les dossiers (et enfants) auxquels un parent a accès
export const getDossiersDuParent = async (utilisateurId) => {
  const result = await pool.query(
    `SELECT d.id AS dossier_id, d.numero_dossier, e.id AS enfant_id, e.nom, e.prenom, e.date_naissance
     FROM acces_dossier a
     JOIN dossiers d ON d.id = a.dossier_id
     JOIN enfants e ON e.id = d.enfant_id
     WHERE a.utilisateur_id = $1
     ORDER BY e.date_naissance DESC`,
    [utilisateurId]
  );
  return result.rows;
};