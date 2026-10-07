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
    /** Nom complet affiché (« Sylvie Ngoma »). */
    nom: string;
    /** Prénom saisi au formulaire. */
    prenom?: string;
    /** Nom de famille seul (« Ngoma »), pour l'API. */
    nomFamille?: string;
    telephone: string;
    email?: string;
    adresse?: string;
    profession?: string;
    nationalite?: string;
  };
  pere: {
    /** Nom complet affiché (« Jean Ngoma »). */
    nom: string;
    prenom?: string;
    nomFamille?: string;
    telephone: string;
    email?: string;
    adresse?: string;
    profession?: string;
    nationalite?: string;
  };
  /** Tuteur légal : facultatif, ignoré si aucun champ n'est renseigné. */
  tuteur?: {
    nom: string;
    prenom?: string;
    nomFamille?: string;
    telephone: string;
    email?: string;
    adresse?: string;
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
  role: string;
  etablissement: string;
  matricule: string;
  ville: string;
  /** Champs de la console super admin (aucun équivalent API). */
  id?: string;
  email?: string;
  telephone?: string;
  service?: string;
  actif?: boolean;
  dateCreation?: string;
}

/** Indicateurs calculés depuis `GET /api/statistiques` et le registre agent. */
export interface AgentKpi {
  naissances: number;
  naissancesVivantes: number;
  tauxSurvie: string;
  dossiers: number;
  dossiersComplets: number;
  doses: number;
  dosesAdministrees: number;
  deces: number;
  mortNes: number;
  garcons: number;
  filles: number;
  parMois: Array<{
    mois: string;
    naissances: number;
    garcons: number;
    filles: number;
    mort_nes: number;
    deces: number;
  }>;
}
