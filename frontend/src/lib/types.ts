import type { MouseEventHandler } from "react";

/* ---------- Formulaire d'enregistrement du nouveau-né ---------- */

/**
 * `sexe` est un `string` et non `"M" | "F"` ici : le `<select>` du formulaire
 * renvoie toujours une chaîne. La validation est faite côté API, qui répond
 * `400` avec un message en français si la valeur n'est pas M ou F.
 */
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
  lien: "mere" | "pere" | "tuteur";
}

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

export type CountdownDeclaration = {
  statut: "en_cours" | "delai_expire" | "declaree";
  jours_restants: number;
  message: string;
};