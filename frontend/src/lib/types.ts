import type { MouseEventHandler } from "react";

export interface CustomButtonProps {
  title: string;
  styles?: string;
  handleClick?: MouseEventHandler<HTMLButtonElement>;
  btnType?: "button" | "submit";
}

export interface Parent {
  name: string;
  phone: string;
  email: string;
  nbreEnfants: number;
}

export type VaccineStatus = "realise" | "avenir" | "retard";

export interface Vaccine {
  id: string;
  nom: string;
  mois: number;
  dose: number;
  date_prevue: string;
  date_effectuee?: string;
  etablissement?: string;
  statut: VaccineStatus;
}

export interface Child {
  id: string;
  nom: string;
  date_naissance: string;
  vaccins: Vaccine[];
}
