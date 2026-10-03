import pool from '../config/db.js';

// Récupère l'enfant et la ligne du calendrier visée, avec la date prévue calculée
export const getEnfantEtCalendrier = async (enfantId, calendrierId) => {
  const result = await pool.query(
    `SELECT e.id AS enfant_id, e.date_naissance, e.etablissement_id,
            c.id AS calendrier_id, c.actif, v.nom AS vaccin_nom, c.dose_numero,
            (e.date_naissance + c.age_cible_jours) AS date_prevue
     FROM enfants e
     CROSS JOIN calendrier_vaccinal c
     JOIN vaccins v ON v.id = c.vaccin_id
     WHERE e.id = $1 AND c.id = $2`,
    [enfantId, calendrierId]
  );
  return result.rows[0];
};

// Enregistre (ou met à jour) la vaccination comme administrée
export const confirmerVaccination = async (data) => {
  const result = await pool.query(
    `INSERT INTO vaccinations
       (enfant_id, calendrier_id, date_prevue, statut, date_administration, agent_id, etablissement_id, numero_lot)
     VALUES ($1, $2, $3, 'effectue', $4, $5, $6, $7)
     ON CONFLICT (enfant_id, calendrier_id) DO UPDATE
       SET statut = 'effectue',
           date_administration = EXCLUDED.date_administration,
           agent_id = EXCLUDED.agent_id,
           etablissement_id = EXCLUDED.etablissement_id,
           numero_lot = EXCLUDED.numero_lot
     RETURNING *`,
    [
      data.enfant_id,
      data.calendrier_id,
      data.date_prevue,
      data.date_administration,
      data.agent_id,
      data.etablissement_id,
      data.numero_lot
    ]
  );
  return result.rows[0];
};
