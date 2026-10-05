import pool from "../config/db.js";

// Créer un rendez-vous (l'établissement est repris de l'enfant)
export const createRendezVous = async (data) => {
  const result = await pool.query(
    `INSERT INTO rendez_vous (enfant_id, etablissement_id, vaccination_id, date_rdv, motif)
     SELECT e.id, e.etablissement_id, $2::integer, $3::timestamptz, $4::varchar
     FROM enfants e
     WHERE e.id = $1
     RETURNING *`,
    [
      data.enfant_id,
      data.vaccination_id ?? null,
      data.date_rdv,
      data.motif ?? null,
    ],
  );
  return result.rows[0];
};

// Un rendez-vous par son id
export const getRendezVousById = async (id) => {
  const result = await pool.query(`SELECT * FROM rendez_vous WHERE id = $1`, [
    id,
  ]);
  return result.rows[0];
};

// Tous les rendez-vous d'un enfant
export const getRendezVousByEnfant = async (enfantId) => {
  const result = await pool.query(
    `SELECT * FROM rendez_vous WHERE enfant_id = $1 ORDER BY date_rdv`,
    [enfantId],
  );
  return result.rows;
};

// Modifier un rendez-vous (date, motif ou statut : planifie, honore, manque, annule)
export const updateRendezVous = async (id, data) => {
  const result = await pool.query(
    `UPDATE rendez_vous
     SET date_rdv = COALESCE($1, date_rdv),
         motif    = COALESCE($2, motif),
         statut   = COALESCE($3, statut)
     WHERE id = $4
     RETURNING *`,
    [data.date_rdv, data.motif, data.statut, id],
  );
  return result.rows[0];
};

// Rappels d'un parent : rendez-vous planifiés dans les prochaines 24 h
export const getRappelsParent = async (utilisateurId) => {
  const result = await pool.query(
    `SELECT r.id, r.date_rdv, r.motif, e.id AS enfant_id, e.prenom AS enfant_prenom
     FROM rendez_vous r
     JOIN enfants e ON e.id = r.enfant_id
     JOIN dossiers d ON d.enfant_id = e.id
     JOIN acces_dossier a ON a.dossier_id = d.id
     WHERE a.utilisateur_id = $1
       AND r.statut = 'planifie'
       AND r.date_rdv > now()
       AND r.date_rdv <= now() + interval '24 hours'
     ORDER BY r.date_rdv`,
    [utilisateurId],
  );
  return result.rows;
};
