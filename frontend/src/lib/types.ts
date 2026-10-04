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