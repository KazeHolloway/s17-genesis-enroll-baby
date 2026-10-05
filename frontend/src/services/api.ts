// src/services/api.ts

import type { Vaccine } from "../lib/types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Erreur ${res.status}`);
  }

  return res.json();
}

// --- Auth ---
export const login = (credentials: { phone: string; password: string }) =>
  request<{ token: string; user: object }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      telephone: credentials.phone,
      mot_de_passe: credentials.password,
    }),
  });

export const register = (payload: {
  code_acces: string;
  nom: string;
  telephone: string;
  email?: string;
  mot_de_passe: string;
}) =>
  request<{ token: string; user: object }>("/parents/inscription", {
    method: "POST",
    body: JSON.stringify(payload),
  });

// --- Enfants / Vaccins ---
export const getChildren = (parentId: string) =>
  request<object[]>(`/parent/${parentId}/children`);

export const getVaccines = (childId: string) =>
  request<Vaccine[]>(`/child/${childId}/vaccines`);

export const markVaccineDone = (vaccineId: string, date: string) =>
  request<Vaccine>(`/vaccine/${vaccineId}/complete`, {
    method: "PATCH",
    body: JSON.stringify({ date_effectuee: date }),
  });

// --- Notifications ---
export const getNotifications = (userId: string) =>
  request<object[]>(`/user/${userId}/notifications`);
