import type { MouseEventHandler } from "react";

/* ---------- Formulaire d'enregistrement du nouveau-né ---------- */

export type BabyData = {
  nom: string;
  prenom: string;
  sexe: string;
  taille_naissance: number;
  poids_naissance: number;
  date_naissance: string;
  lieu_naissance: string;
  statut_vital: string;
};

export type dataParent = {
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  adresse: string;
  lien: "mere" | "pere" | "tuteur";
};

export type EnregistrementBaby = {
  enfant: BabyData;
  parents: dataParent[];
};

/* ---------- Bouton générique (landing) ---------- */

export interface CustomButtonProps {
  title: string;
  styles?: string;
  handleClick?: MouseEventHandler<HTMLButtonElement>;
  btnType?: "button" | "submit";
}

export interface BabyData {
  nom: string;
  prenom: string;
  sexe: string;
  taille_naissance: number;
  poids_naissance: number;
  statut_vital: string;
  date_naissance: string;
  lieu_naissance: string;
}

export interface dataParent {
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  adresse: string;
  lien: "mere" | "pere";
}