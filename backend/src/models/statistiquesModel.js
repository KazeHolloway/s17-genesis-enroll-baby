import pool from '../config/db.js';

// Compte les naissances et les décès par mois sur une période, pour un établissement ou pour tous
export const getStatsParMois = async (debut, fin, etablissementId) => {
  const result = await pool.query(
    `SELECT to_char(date_naissance, 'YYYY-MM') AS mois,
            count(*)::int AS naissances,
            (count(*) FILTER (WHERE sexe = 'M'))::int AS garcons,
            (count(*) FILTER (WHERE sexe = 'F'))::int AS filles,
            (count(*) FILTER (WHERE statut_vital = 'mort_ne'))::int AS mort_nes,
            (count(*) FILTER (WHERE statut_vital = 'decede'))::int AS deces
     FROM enfants
     WHERE date_naissance BETWEEN $1 AND $2
       AND ($3::int IS NULL OR etablissement_id = $3)
     GROUP BY mois
     ORDER BY mois`,
    [debut, fin, etablissementId]
  );
  return result.rows;
};