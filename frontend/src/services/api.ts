import type { CountdownDeclaration } from '../lib/types';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

async function appeler<T>(
  chemin: string,
  opts: { token?: string; method?: string; body?: unknown } = {}
): Promise<T> {
  const res = await fetch(`${API}${chemin}`, {
    method: opts.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(opts.token ? { Authorization: `Bearer ${opts.token}` } : {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? 'Une erreur est survenue');
  return json.data as T;
}

export function login(telephone: string, mot_de_passe: string) {
  return appeler<{ token: string }>('/auth/login', {
    method: 'POST',
    body: { telephone, mot_de_passe },
  });
}

export function getMoi(token: string) {
  return appeler<{ dossiers: { dossier_id: number }[] }>('/auth/moi', { token });
}

export function getCountdownDeclaration(dossierId: number, token: string) {
  return appeler<CountdownDeclaration>(
    `/declarations/dossier/${dossierId}/compte-a-rebours`,
    { token }
  );
}