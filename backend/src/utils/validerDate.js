// Vérifie qu'une chaîne est une vraie date au format AAAA-MM-JJ (refuse par exemple 2026-02-31)
export const estDateValide = (texte) => {
  if (typeof texte !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(texte)) return false;
  const date = new Date(texte);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === texte;
};

// Renvoie la date du jour au format AAAA-MM-JJ
export const dateDuJour = () => new Date().toISOString().slice(0, 10);
