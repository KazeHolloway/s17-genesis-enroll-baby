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
