// Remplace les caractères spéciaux du HTML pour empêcher l'injection de code (XSS)
export const echapperHtml = (valeur) =>
  String(valeur ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');