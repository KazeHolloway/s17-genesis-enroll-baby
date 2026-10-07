/**
 * Ouverture des documents imprimables générés côté serveur.
 *
 * Les routes « imprimable / dossier » et « declarations / dossier /
 * imprimable » répondent du HTML qui exige une en-tête Authorization : un simple
 * window.open(url) ne peut pas la porter. On récupère donc la page via le client
 * API (fetch + Bearer), on la convertit en objet Blob et on l'ouvre dans un onglet.
 */
export function ouvrirHtmlImprimable(html: string): void {
  const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
  const fenetre = window.open(url, "_blank");
  /* Le Blob doit rester lisible le temps que la page s'affiche ; libération
     différée pour ne pas casser l'onglet ouvert. */
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  if (!fenetre) {
    console.warn("Pop-up bloquée : réessayez en autorisant les fenêtres.", url);
  }
}