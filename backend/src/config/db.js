import pg from "pg"
import dotenv from "dotenv"
import path from "path"
dotenv.config()
const { Pool, types } = pg

// Les colonnes de type DATE (code 1082) sont renvoyées en texte AAAA-MM-JJ
// Sans ça, pg les convertit en objet Date et le fuseau horaire décale la date d'un jour
types.setTypeParser(1082, (valeur) => valeur)

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

export default pool