import * as ImprimableModel from '../models/imprimableModel.js';
import * as CalendrierModel from '../models/calendrierModel.js';
import { construireDeclaration } from '../utils/rappels.js';
import { echapperHtml as h } from '../utils/echapperHtml.js';
import { formaterDate } from '../utils/formaterDate.js';

// Libellés lisibles pour la version papier
const SEXES = { M: 'Masculin', F: 'Féminin' };
const LIENS = { mere: 'Mère', pere: 'Père', tuteur: 'Tuteur' };
const STATUTS_VITAUX = { vivant: 'Vivant', mort_ne: 'Mort-né', decede: 'Décédé' };
const STATUTS_VACCIN = { a_venir: 'À venir', en_retard: 'En retard', effectue: 'Effectué' };
const STATUTS_DECLARATION = {
  en_attente: 'En attente de déclaration',
  delai_expire: 'Délai de 30 jours dépassé',
  declaree: 'Déclarée'
};

// Construit la page HTML prête à imprimer
const construirePage = (dossier, parents, echeances, declaration) => {
  const lignesParents = parents.length > 0
    ? parents.map((p) => `
          <tr>
            <td>${h(LIENS[p.lien] || p.lien)}</td>
            <td>${h(p.prenom)} ${h(p.nom)}</td>
            <td>${h(p.telephone || '—')}</td>
          </tr>`).join('')
    : `
          <tr>
            <td colspan="3">Aucun parent enregistré</td>
          </tr>`;

  const lignesVaccins = echeances.map((e) => `
          <tr>
            <td>${h(e.vaccin_nom)}</td>
            <td>${h(e.dose_numero)}</td>
            <td>${h(formaterDate(e.date_prevue))}</td>
            <td>${h(STATUTS_VACCIN[e.statut] || e.statut)}</td>
            <td>${h(formaterDate(e.date_administration))}</td>
          </tr>`).join('');

  return `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="Squad 6 Genesis">
    <title>Dossier ${h(dossier.numero_dossier)} - Enroll Baby</title>
    <style>
      body { font-family: Arial, sans-serif; color: #1a1a1a; margin: 2rem auto; max-width: 800px; line-height: 1.4; }
      h1 { font-size: 1.5rem; margin-bottom: 0.25rem; }
      h2 { font-size: 1.1rem; border-bottom: 2px solid #333; padding-bottom: 0.25rem; margin-top: 1.5rem; }
      table { width: 100%; border-collapse: collapse; margin-top: 0.5rem; }
      th, td { border: 1px solid #999; padding: 0.4rem 0.6rem; text-align: left; font-size: 0.95rem; }
      th { background: #eee; }
      .note { font-size: 0.85rem; color: #444; }
      /* Masque le bouton d'impression sur la feuille imprimée */
      @media print { .no-print { display: none; } body { margin: 0; } }
    </style>
  </head>
  <body>
    <header>
      <h1>Dossier du nouveau-né</h1>
      <p>Numéro de dossier : <strong>${h(dossier.numero_dossier)}</strong></p>
      <button class="no-print" onclick="window.print()">Imprimer</button>
    </header>
    <main>
      <section>
        <h2>Informations du nouveau-né</h2>
        <table>
          <tr><th>Nom</th><td>${h(dossier.nom)}</td></tr>
          <tr><th>Prénom</th><td>${h(dossier.prenom)}</td></tr>
          <tr><th>Sexe</th><td>${h(SEXES[dossier.sexe] || dossier.sexe)}</td></tr>
          <tr><th>Date de naissance</th><td>${h(formaterDate(dossier.date_naissance))}</td></tr>
          <tr><th>Lieu de naissance</th><td>${h(dossier.lieu_naissance || '—')}</td></tr>
          <tr><th>Poids / taille à la naissance</th><td>${h(dossier.poids_naissance ?? '—')} kg / ${h(dossier.taille_naissance ?? '—')} cm</td></tr>
          <tr><th>Statut vital</th><td>${h(STATUTS_VITAUX[dossier.statut_vital] || dossier.statut_vital)}</td></tr>
          <tr><th>Établissement</th><td>${h(dossier.etablissement_nom)}, ${h(dossier.etablissement_ville)}</td></tr>
        </table>
      </section>
      <section>
        <h2>Parents</h2>
        <table>
          <tr><th>Lien</th><th>Nom et prénom</th><th>Téléphone</th></tr>${lignesParents}
        </table>
      </section>
      <section>
        <h2>Déclaration de naissance à l’état civil</h2>
        <table>
          <tr><th>Situation</th><td>${h(STATUTS_DECLARATION[declaration.statut])}</td></tr>
          <tr><th>Date limite (30 jours)</th><td>${h(formaterDate(declaration.date_limite))}</td></tr>
          <tr><th>Numéro de déclaration</th><td>${h(dossier.declaration_numero || '—')}</td></tr>
          <tr><th>Date de déclaration</th><td>${h(formaterDate(declaration.date_declaration))}</td></tr>
        </table>
        <p class="note">La déclaration signée par la sage-femme reste le document officiel. Présentez-la à la mairie avec le numéro de dossier.</p>
      </section>
      <section>
        <h2>Calendrier vaccinal</h2>
        <table>
          <tr><th>Vaccin</th><th>Dose</th><th>Date prévue</th><th>Statut</th><th>Date d’administration</th></tr>${lignesVaccins}
        </table>
      </section>
    </main>
    <footer>
      <p class="note">Édité le ${h(formaterDate(new Date().toISOString().slice(0, 10)))} - ${h(dossier.etablissement_nom)}${dossier.etablissement_telephone ? ` - ${h(dossier.etablissement_telephone)}` : ''}</p>
    </footer>
  </body>
</html>`;
};

// GET /api/imprimable/dossier/:dossierId
export const getDossierImprimable = async (req, res) => {
  try {
    const dossierId = Number(req.params.dossierId);
    if (!Number.isInteger(dossierId)) {
      return res.status(400).json({ success: false, message: 'Identifiant invalide' });
    }

    const dossier = await ImprimableModel.getDossierComplet(dossierId);

    // Même réponse si le dossier n'existe pas ou si l'accès est refusé
    const autorise = dossier && await CalendrierModel.peutVoirEnfant(req.user, dossier.enfant_id);
    if (!autorise) {
      return res.status(404).json({ success: false, message: 'Dossier introuvable' });
    }

    const [parents, echeances] = await Promise.all([
      ImprimableModel.getParentsEnfant(dossier.enfant_id),
      CalendrierModel.getEcheancesEnfant(dossier.enfant_id)
    ]);

    const declaration = construireDeclaration(dossier);

    res.status(200).type('html').send(construirePage(dossier, parents, echeances, declaration));
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la génération du dossier imprimable' });
  }
};