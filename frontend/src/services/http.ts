const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

// Erreur spéciale : l'utilisateur n'est pas connecté (ou le token a expiré)
export class NonConnecteError extends Error {}

async function requete<T>(chemin: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
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