import pg from "pg"
import dotenv from "dotenv"
import path from "path"
dotenv.config()
const { Pool, types } = pg

// Les colonnes de type DATE (code 1082) sont renvoyées en texte AAAA-MM-JJ
// Sans ça, pg les convertit en objet Date et le fuseau horaire décale la date d'un jour
types.setTypeParser(1082, (valeur) => valeur)

// En ligne (Neon, Render), une seule adresse DATABASE_URL suffit
// La connexion doit alors être chiffrée (SSL), sinon Neon la refuse
// En local, on garde les variables séparées DB_HOST, DB_PORT, etc.
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    })
  : new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });

export default pool