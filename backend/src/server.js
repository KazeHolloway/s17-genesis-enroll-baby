import app from './app.js';
import pool from './config/db.js';

const PORT = process.env.PORT || 5000;

//Teste de  la connexion à la BDD avant de lancer le serveur
pool.query('SELECT NOW()')
  .then(() => {
    console.log('Connexion à la base de données PostgreSQL réussie!');
    
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port http://localhost:${PORT} `);
    });
  })
  .catch((err) => {
    console.error('Erreur de connexion à la base de données :', err.message);
  });