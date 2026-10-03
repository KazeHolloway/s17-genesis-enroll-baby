// Transforme une date AAAA-MM-JJ en JJ/MM/AAAA pour l'affichage
export const formaterDate = (date) => (date ? String(date).split('-').reverse().join('/') : '—');