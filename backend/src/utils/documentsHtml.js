import { echapperHtml as h } from "./echapperHtml.js";
import { formaterDate } from "./formaterDate.js";

// Libellés lisibles pour la version papier
const SEXES = { M: "Masculin", F: "Féminin" };
const LIENS = { mere: "Mère", pere: "Père", tuteur: "Tuteur" };
const SITUATIONS = {
  en_attente: "En attente de déclaration",
  delai_expire: "Délai de 30 jours dépassé",
  declaree: "Déclarée",
};

// Construit une page HTML prête à imprimer (déclaration ou certificat numérique)
export const construireDocument = ({
  titre,
  dossier,
  parents,
  declaration,
  mentions,
  avecSignatures,
}) => {
  const lignesParents =
    parents.length > 0
      ? parents
          .map(
            (p) => `
          <tr>
            <td>${h(LIENS[p.lien] || p.lien)}</td>
            <td>${h(p.prenom)} ${h(p.nom)}</td>
            <td>${h(p.telephone || "—")}</td>
          </tr>`,
          )
          .join("")
      : `
          <tr>
            <td colspan="3">Aucun parent enregistré</td>
          </tr>`;

  const paragraphesMentions = mentions
    .map(
      (m) => `
      <p class="note">${h(m)}</p>`,
    )
    .join("");

  const signatures = avecSignatures
    ? `
      <section>
        <h2>Signatures</h2>
        <table>
          <tr>
            <td class="signature">Signature de la sage-femme</td>
            <td class="signature">Cachet de l’établissement</td>
          </tr>
        </table>
      </section>`
    : "";

  return `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="Squad 6 Genesis">
    <title>${h(titre)} - ${h(dossier.numero_dossier)}</title>
    <style>
      body { font-family: Arial, sans-serif; color: #1a1a1a; margin: 2rem auto; max-width: 800px; line-height: 1.4; }
      h1 { font-size: 1.5rem; margin-bottom: 0.25rem; }
      h2 { font-size: 1.1rem; border-bottom: 2px solid #333; padding-bottom: 0.25rem; margin-top: 1.5rem; }
      table { width: 100%; border-collapse: collapse; margin-top: 0.5rem; }
      th, td { border: 1px solid #999; padding: 0.4rem 0.6rem; text-align: left; font-size: 0.95rem; }
      th { background: #eee; }
      .note { font-size: 0.85rem; color: #444; }
      .signature { height: 90px; vertical-align: top; width: 50%; }
      /* Masque le bouton d'impression sur la feuille imprimée */
      @media print { .no-print { display: none; } body { margin: 0; } }
    </style>
  </head>
  <body>
    <header>
      <h1>${h(titre)}</h1>
      <p>Numéro de dossier : <strong>${h(dossier.numero_dossier)}</strong></p>
      <p>Numéro de déclaration : <strong>${h(dossier.declaration_numero || "—")}</strong></p>
      <button class="no-print" onclick="window.print()">Imprimer</button>
    </header>
    <main>
      <section>
        <h2>Nouveau-né</h2>
        <table>
          <tr><th>Nom</th><td>${h(dossier.nom)}</td></tr>
          <tr><th>Prénom</th><td>${h(dossier.prenom)}</td></tr>
          <tr><th>Sexe</th><td>${h(SEXES[dossier.sexe] || dossier.sexe)}</td></tr>
          <tr><th>Date de naissance</th><td>${h(formaterDate(dossier.date_naissance))}</td></tr>
          <tr><th>Lieu de naissance</th><td>${h(dossier.lieu_naissance || "—")}</td></tr>
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
        <h2>Délai de déclaration à l’état civil</h2>
        <table>
          <tr><th>Situation</th><td>${h(SITUATIONS[declaration.statut])}</td></tr>
          <tr><th>Date limite (30 jours)</th><td>${h(formaterDate(declaration.date_limite))}</td></tr>
          <tr><th>Date de déclaration</th><td>${h(formaterDate(declaration.date_declaration))}</td></tr>
        </table>
      </section>${signatures}
    </main>
    <footer>${paragraphesMentions}
      <p class="note">Édité le ${h(formaterDate(new Date().toISOString().slice(0, 10)))} - ${h(dossier.etablissement_nom)}</p>
    </footer>
  </body>
</html>`;
};
