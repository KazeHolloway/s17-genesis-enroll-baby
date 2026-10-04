export type StatutCountdown = 'en_cours' | 'delai_expire' | 'declaree';

export interface CountdownDeclaration {
  statut: StatutCountdown;
  jours_restants: number;
  message: string;
}