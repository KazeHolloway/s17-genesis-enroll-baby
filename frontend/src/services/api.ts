import type { CountdownDeclaration } from "../lib/types";

const API_URL = "http://localhost:5000";

export default API_URL;

async function appeler<T>(
  chemin: string,
  opts: { token?: string; method?: string; body?: unknown } = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${chemin}`, {
    method: opts.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(opts.token
        ? { Authorization: `Bearer ${opts.token}` }
        : {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message ?? "Une erreur est survenue");
  }

  return json.data as T;
}

export function login(telephone: string, mot_de_passe: string) {
  return appeler<{ token: string }>("/api/auth/login", {
    method: "POST",
    body: { telephone, mot_de_passe },
  });
}

export function getMoi(token: string) {
  return appeler<{ dossiers: { dossier_id: number }[] }>(
    "/api/auth/moi",
    { token }
  );
}

export function getCountdownDeclaration(
  dossierId: number,
  token: string
) {
  return appeler<CountdownDeclaration>(
    `/api/declarations/dossier/${dossierId}/compte-a-rebours`,
    { token }
  );
}

export async function postData(endpoint: string, data: object) {
  try {
    const reponse = await fetch(API_URL + endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!reponse.ok) {
      throw new Error("Erreur lors de la requête");
    }

    const result = await reponse.json();
    return result;
  } catch (error) {
    throw error;
  }
}