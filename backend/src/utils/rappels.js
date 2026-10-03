import { formaterDate } from './formaterDate.js';

// Nombre de jours avant l'échéance à partir duquel un rappel s'affiche
const FENETRE_JOURS = 14;

// Résume la situation de la déclaration à l'état civil à partir d'une ligne SQL
export const construireDeclaration = (ligne) => {
  const joursRestants = ligne.jours_restants_declaration;
  let statut = 'en_attente';
  if (ligne.declaration_statut === 'declaree') {
    statut = 'declaree';
  } else if (joursRestants < 0) {
    statut = 'delai_expire';
  }
  return {
    statut,
    date_limite: ligne.date_limite_declaration,
    jours_restants: statut === 'declaree' ? null : joursRestants,
    date_declaration: ligne.date_declaration || null
  };
};

// Construit les rappels d'un enfant à partir de ses échéances vaccinales et de sa déclaration
export const construireRappels = (ligne, declaration, echeances) => {
  // Pas de rappel si l'enfant n'est pas vivant
  if (ligne.statut_vital !== 'vivant') return [];

  const rappels = [];

  // Rappels de vaccination : échéances en retard ou proches, pas encore effectuées
  echeances
    .filter((e) => e.statut !== 'effectue' && e.jours_restants <= FENETRE_JOURS)
    .forEach((e) => {
      const nomVaccin = `${e.vaccin_nom} (dose ${e.dose_numero})`;
      rappels.push({
        type: 'vaccin',
        enfant_id: ligne.enfant_id,
        enfant_prenom: ligne.prenom,
        titre: `Vaccin ${nomVaccin}`,
        date_echeance: e.date_prevue,
        jours_restants: e.jours_restants,
        statut: e.statut,
        prochaine_demarche: e.statut === 'en_retard'
          ? `Prendre contact avec l’établissement de santé pour faire administrer le vaccin ${nomVaccin}`
          : `Se présenter à l’établissement de santé pour le vaccin ${nomVaccin} avant le ${formaterDate(e.date_prevue)}`
      });
    });

  // Rappel de déclaration à l'état civil tant qu'elle n'est pas enregistrée
  if (declaration.statut !== 'declaree') {
    const expire = declaration.statut === 'delai_expire';
    rappels.push({
      type: 'declaration',
      enfant_id: ligne.enfant_id,
      enfant_prenom: ligne.prenom,
      titre: 'Déclaration de naissance à l’état civil',
      date_echeance: declaration.date_limite,
      jours_restants: declaration.jours_restants,
      statut: expire ? 'en_retard' : 'a_venir',
      prochaine_demarche: expire
        ? 'Le délai de 30 jours est dépassé : une déclaration tardive peut être nécessaire, rapprochez-vous de l’état civil'
        : `Déclarer la naissance à l’état civil avant le ${formaterDate(declaration.date_limite)}`
    });
  }

  // Les échéances les plus urgentes (ou dépassées) en premier
  return rappels.sort((a, b) => a.jours_restants - b.jours_restants);
};