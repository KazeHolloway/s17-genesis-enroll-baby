import rateLimit from 'express-rate-limit';

/**
 * Limite les tentatives de connexion et d'inscription.
 *
 * Seuls les échecs sont comptés : une session valide qui recharge une page ne
 * doit pas être bloquée au bout de quelques rafraîchissements.
 */
export const limiteurAuth = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  skip: () => process.env.NODE_ENV === 'test',
  message: { success: false, message: 'Trop de tentatives, réessayez plus tard' },
});

/**
 * Garde-fou large sur l'espace Parent.
 *
 * Le quota précédent était partagé avec le login et comptait les succès, ce
 * qui faisait sortir l'utilisateur de son propre espace au dixième chargement.
 * La lecture est normale : seule la répétition abusive est bloquée, et par IP.
 */
export const limiteurEspace = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  skip: () => process.env.NODE_ENV === 'test',
  message: { success: false, message: 'Trop de requêtes, réessayez dans un instant' },
});
