export type ChildGender = 'Garçon' | 'Fille';

export interface Child {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  heureNaissance?: string;
  poids: string;
  taille: string;
  sexe: ChildGender;
  lieuNaissance: string;
  photoUrl: string;
  status: 'complet' | 'en_cours' | 'attente_acte';
  referenceMaternite: string;
  codeAccesParent?: string;
  delaiDeclarationJours?: number;
  numeroActe?: string;
  mere: {
    nom: string;
    telephone: string;
    profession?: string;
    nationalite?: string;
  };
  pere: {
    nom: string;
    telephone: string;
    profession?: string;
    nationalite?: string;
  };
  prochaineVaccination?: {
    date: string;
    nom: string;
    joursRestants: number;
  };
  etapes: Array<{
    titre: string;
    date: string;
    complete: boolean;
  }>;
}

export interface VaccineItem {
  id: string;
  childId: string;
  nom: string;
  dose: string;
  ageRecommande: string;
  datePrevue: string;
  dateEffective?: string;
  statut: 'administre' | 'a_venir' | 'en_retard';
  lieu?: string;
  professionnel?: string;
  lotNumero?: string;
}

export interface DocumentItem {
  id: string;
  childId: string;
  titre: string;
  type: 'certificat_naissance' | 'carnet_sante' | 'acte_naissance' | 'attestation_maternite';
  date: string;
  taille: string;
  format: 'PDF';
  reference: string;
  signataire: string;
  url?: string;
}

export interface NotificationItem {
  id: string;
  titre: string;
  message: string;
  date: string;
  lu: boolean;
  type: 'vaccin' | 'etat_civil' | 'systeme' | 'maternite';
  badge?: string;
}

export interface AgentUser {
  nom: string;
  role: 'Sage-femme' | 'Officier État Civil' | 'Médecin Chef';
  etablissement: string;
  matricule: string;
  ville: string;
}
