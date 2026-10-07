/**
 * Exécute les fichiers `migrations/*.sql` dans l'ordre alphabétique.
 *
 *   npm run migrate
 *
 * Les migrations sont écrites en idempotent (`IF NOT EXISTS`), donc les
 * relancer ne modifie rien de ce qui existe déjà.
 */
import 'dotenv/config';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pool from '../config/db.js';

const dossier = path.join(path.dirname(fileURLToPath(import.meta.url)), 'migrations');

const fichiers = (await readdir(dossier))
  .filter((nom) => nom.endsWith('.sql'))
  .sort();

for (const fichier of fichiers) {
  const sql = await readFile(path.join(dossier, fichier), 'utf8');
  await pool.query(sql);
  console.log(`Migration appliquée : ${fichier}`);
}

await pool.end();
