import crypto from 'crypto';

// Alphabet sans caractères ambigus (ni 0, O, 1, I) pour faciliter la saisie du parent
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

// Génère un code d'accès aléatoire au format XXXX-XXXX-XXXX
export const genererCodeAcces = () => {
  let code = '';
  for (let i = 0; i < 12; i++) {
    // randomInt est cryptographiquement sûr, contrairement à Math.random
    code += ALPHABET[crypto.randomInt(ALPHABET.length)];
    // Ajoute un tiret après chaque groupe de 4 caractères
    if (i % 4 === 3 && i < 11) code += '-';
  }
  return code;
};

// Normalise le code saisi (majuscules, sans tiret ni espace) puis calcule son empreinte SHA-256
export const hacherCodeAcces = (code) => {
  const propre = String(code).toUpperCase().replace(/[^A-Z0-9]/g, '');
  return crypto.createHash('sha256').update(propre).digest('hex');
};