import pool from '../config/db.js';

// Liste le calendrier vaccinal actif (référence PEV)
export const getCalendrierActif = async () => {
  const result = await pool.query(
    `SELECT c.id, c.vaccin_id, v.code, v.nom AS vaccin_nom, c.dose_numero,
            c.age_cible_jours, c.version, c.date_effet, c.actif
     FROM calendrier_vaccinal c
     JOIN vaccins v ON v.id = c.vaccin_id
     WHERE c.actif = true
     ORDER BY c.age_cible_jours, v.nom, c.dose_numero`
  );
  return result.rows;
};

// Calcule les échéances vaccinales d'un enfant à partir de sa date de naissance
export const getEcheancesEnfant = async (enfantId) => {
  const result = await pool.query(
    `SELECT c.id AS calendrier_id, v.code, v.nom AS vaccin_nom, c.dose_numero, c.age_cible_jours,
            (e.date_naissance + c.age_cible_jours) AS date_prevue,
            (e.date_naissance + c.age_cible_jours) - CURRENT_DATE AS jours_restants,
            CASE
              WHEN vac.statut = 'effectue' THEN 'effectue'
              WHEN (e.date_naissance + c.age_cible_jours) < CURRENT_DATE THEN 'en_retard'
              ELSE 'a_venir'
            END AS statut,
            vac.date_administration
     FROM enfants e
     CROSS JOIN calendrier_vaccinal c
     JOIN vaccins v ON v.id = c.vaccin_id
     LEFT JOIN vaccinations vac ON vac.enfant_id = e.id AND vac.calendrier_id = c.id
     WHERE e.id = $1 AND c.actif = true
     ORDER BY date_prevue, v.nom, c.dose_numero`,
    [enfantId]
  );
  return result.rows;
};

// Vérifie qu'un utilisateur a le droit de consulter les données d'un enfant
export const peutVoirEnfant = async (utilisateur, enfantId) => {
  let result;
  if (utilisateur.role === 'admin') {
    result = await pool.query('SELECT 1 FROM enfants WHERE id = $1', [enfantId]);
  } else if (utilisateur.role === 'agent_maternite') {
    // Un agent ne voit que les enfants de son établissement
    result = await pool.query(
      'SELECT 1 FROM enfants WHERE id = $1 AND etablissement_id = $2',
      [enfantId, utilisateur.etablissement_id]
    );
  } else {
    // Un parent ne voit que les enfants de ses dossiers
    result = await pool.query(
      `SELECT 1 FROM acces_dossier a
       JOIN dossiers d ON d.id = a.dossier_id
       WHERE a.utilisateur_id = $1 AND d.enfant_id = $2`,
      [utilisateur.id, enfantId]
    );
  }
  return result.rows.length > 0;
};

// Ajoute une ligne au calendrier (admin)
export const createEntree = async ({ vaccin_id, dose_numero, age_cible_jours, version, date_effet }) => {
  const result = await pool.query(
    `INSERT INTO calendrier_vaccinal (vaccin_id, dose_numero, age_cible_jours, version, date_effet)
     VALUES ($1, $2, $3, COALESCE($4, 1), COALESCE($5, CURRENT_DATE))
     RETURNING *`,
    [vaccin_id, dose_numero, age_cible_jours, version, date_effet]
  );
  return result.rows[0];
};

// Modifie l'âge cible ou l'activation d'une ligne du calendrier (admin)
export const updateEntree = async (id, age_cible_jours, actif) => {
  const result = await pool.query(
    `UPDATE calendrier_vaccinal
     SET age_cible_jours = COALESCE($2, age_cible_jours),
         actif = COALESCE($3, actif)
     WHERE id = $1
     RETURNING *`,
    [id, age_cible_jours, actif]
  );
  return result.rows[0];
};