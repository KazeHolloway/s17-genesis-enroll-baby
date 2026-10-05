import type { MouseEventHandler } from "react";

export type StatutCountdown = 'en_cours' | 'delai_expire' | 'declaree';

export interface CountdownDeclaration {
  statut: StatutCountdown;
  jours_restants: number;
  message: string;
}

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