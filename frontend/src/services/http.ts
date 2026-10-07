const API_URL =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.PROD
    ? 'https://s17-genesis-enroll-baby.onrender.com'
    : 'http://localhost:5000');

// Erreur spéciale : l'utilisateur n'est pas connecté (ou le token a expiré)
export class NonConnecteError extends Error {}

const FORME_JWT = /^eyJ[\w-]+\.[\w-]+\.[\w-]+$/;

// Cherche le token de connexion dans le navigateur, quel que soit son nom
function lireToken(): string | null {
  for (const stockage of [localStorage, sessionStorage]) {
    for (let i = 0; i < stockage.length; i++) {
      const cle = stockage.key(i);
      const valeur = cle ? stockage.getItem(cle) : null;
      if (!valeur) continue;
      if (FORME_JWT.test(valeur)) return valeur;
      try {
        const objet = JSON.parse(valeur);
        if (typeof objet === 'string' && FORME_JWT.test(objet)) return objet;
        const candidat = objet?.token ?? objet?.accessToken ?? objet?.state?.token;
        if (typeof candidat === 'string' && FORME_JWT.test(candidat)) return candidat;
      } catch {
        // valeur qui n'est pas du JSON : on l'ignore
      }
    }
  }
  return null;
}

async function requete<T>(chemin: string, options: RequestInit = {}): Promise<T> {
  const token = lireToken();
  const reponse = await fetch(`${API_URL}${chemin}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const donnees = await reponse.json().catch(() => ({}));

  if (reponse.status === 401) {
    throw new NonConnecteError(donnees.message ?? 'Veuillez vous connecter');
  }
  if (!reponse.ok) {
    throw new Error(donnees.message ?? 'Une erreur est survenue');
  }
  return donnees as T;
}

export function getData<T>(chemin: string) {
  return requete<T>(chemin);
}

export function postData<T>(chemin: string, corps: unknown) {
  return requete<T>(chemin, { method: 'POST', body: JSON.stringify(corps) });
}