import 'dotenv/config';
import bcrypt from 'bcrypt';
import pool from './config/db.js';

// Établissement : on en prend un existant, sinon on en crée un
let etab = await pool.query('SELECT id FROM etablissements LIMIT 1');
if (etab.rows.length === 0) {
  etab = await pool.query(
    `INSERT INTO etablissements (nom) VALUES ('Maternité pilote') RETURNING id`
  );
}

// Agent de test : créé seulement s'il n'existe pas déjà
const existe = await pool.query(
  `SELECT id FROM utilisateurs WHERE telephone = '+242060000001'`
);
if (existe.rows.length === 0) {
  const hash = await bcrypt.hash('motdepasse1', 10);
  await pool.query(
    `INSERT INTO utilisateurs (nom_complet, telephone, mot_de_passe_hash, role, etablissement_id)
     VALUES ('Agent Test', '+242060000001', $1, 'agent_maternite', $2)`,
    [hash, etab.rows[0].id]
  );
}

console.log('Agent prêt : +242060000001 / motdepasse1');
await pool.end();