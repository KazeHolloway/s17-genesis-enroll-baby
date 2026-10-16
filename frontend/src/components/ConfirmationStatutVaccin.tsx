import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import {
  ApiError,
  confirmerVaccin,
  getCalendrierVaccinal,
  getEnfants,
  type Echeance,
  type EnfantAgent,
} from "@/services/api";
import { useEspaceParent } from "@/lib/dashboard/useEspaceParent";
import { cn } from "@/lib/utils";

/**
 * Confirmation des statuts vaccinaux.
 *
 * Deux usages, une seule source de vérité (`Echeance`) :
 *  - `lecture` (parent) : liste les doses que la maternité a validées. Le
 *    backend interdit au parent d'écrire (`POST /vaccinations/confirmer` est
 *    réservé à `agent_maternite` et `admin`), le parent ne peut donc que
 *    consulter. C'est ce que le ticket « Confirmation d'un vaccin administré »
 *    permet réellement aujourd'hui.
 *  - `validation` (agent) : confirme une dose avec sa date d'administration et
 *    son numéro de lot. L'API est en `upsert` sur `(enfant_id, calendrier_id)`,
 *    donc une re-confirmation corrige la dose au lieu de dupliquer la ligne.
 *
 * Le signalement « vaccin non administré » demandé par le ticket n'a pas
 * d'endpoint : `confirmerVaccination` n'insère qu'en `statut = 'effectue'`.
 * L'agent doit donc passer par un rendez-vous de suivi, et l'interface le dit
 * explicitement plutôt que d'exposer un bouton inerte.
 */

type Mode = "lecture" | "validation";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function BadgeEcheance({ echeance }: { echeance: Echeance }) {
  if (echeance.statut === "effectue") {
    return <span className="badge badge-honore">Administré</span>;
  }
  if (echeance.statut === "en_retard") {
    return <span className="badge badge-manque">Non administré</span>;
  }
  return <span className="badge badge-planifie">À venir</span>;
}

export default function ConfirmationStatutVaccin({ mode }: { mode: Mode }) {
  const { enfants: espaceParent } = useEspaceParent(mode === "lecture");

  const [enfants, setEnfants] = useState<EnfantAgent[]>([]);
  const [enfantId, setEnfantId] = useState<number | null>(null);
  const [echeancesAgent, setEcheancesAgent] = useState<Echeance[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [succes, setSucces] = useState<string | null>(null);
  const [enCours, setEnCours] = useState<number | null>(null);

  /* Champs de confirmation, par dose : la date d'administration et le lot sont
     propres à chaque vaccination. */
  const [formulaires, setFormulaires] = useState<
    Record<number, { date_administration: string; numero_lot: string }>
  >({});

  /* ---------- Chargement ---------- */
  const chargerEcheances = useCallback(async (id: number) => {
    const reponse = await getCalendrierVaccinal(id);
    setEcheancesAgent(reponse.data?.echeances ?? []);
  }, []);

  /* Le cache partagé change d'identité à chaque mise à jour : le mettre dans
     les dépendances d'un effet rejoue l'effet indéfiniment et relance les
     appels en boucle. On n'observe donc que des valeurs primitives, et les
     données du parent sont lues au rendu plutôt que recopiées dans un état. */
  const espace = mode === "lecture" ? espaceParent[0] : undefined;
  const enfantIdParent = espace?.enfant.id ?? null;

  /* Mémoïsé pour garder une identité stable : un tableau vide littéral
    changerait d'identité à chaque rendu et invaliderait les mémos en aval. */
  const echeances = useMemo<Echeance[]>(
    () => (mode === "lecture" ? espace?.echeances ?? [] : echeancesAgent),
    [mode, espace?.echeances, echeancesAgent],
  );

  useEffect(() => {
    let annule = false;

    async function chargerReferentiel() {
      setChargement(true);
      setErreur(null);
      try {
        if (mode === "validation") {
          const liste = await getEnfants();
          if (annule) return;
          setEnfants(liste ?? []);
          setEnfantId(liste?.[0]?.id ?? null);
          setChargement(false);
          return;
        }

        /* Parent : le calendrier vient de son espace, lu au rendu. Il ne reste
           qu'à sélectionner l'enfant et à clore le chargement. */
        if (!annule) {
          setEnfantId(enfantIdParent);
          setChargement(false);
        }
      } catch (e) {
        if (annule) return;
        setErreur(
          e instanceof ApiError ? e.message : "Impossible de charger les données.",
        );
        setChargement(false);
      }
    }

    void chargerReferentiel();
    return () => {
      annule = true;
    };
  }, [mode, enfantIdParent]);

  /* L'appel est déclenché après un `await` : l'effet n'écrit aucun état de
     façon synchrone, ce qui évite un rendu en cascade. `chargerEcheances` est
     volontairement inliné ici plutôt que réutilisé, parce que l'appeler ferait
     lire cet effet comme une écriture d'état immédiate. */
  useEffect(() => {
    if (mode !== "validation" || !enfantId) return;

    let annule = false;

    void (async () => {
      try {
        const reponse = await getCalendrierVaccinal(enfantId);
        if (annule) return;
        setEcheancesAgent(reponse.data?.echeances ?? []);
        setErreur(null);
      } catch (e: unknown) {
        if (annule) return;
        setErreur(
          e instanceof ApiError
            ? e.message
            : "Impossible de charger le calendrier.",
        );
      } finally {
        if (!annule) setChargement(false);
      }
    })();

    return () => {
      annule = true;
    };
  }, [mode, enfantId]);

  /* ---------- Actions ---------- */
  function majFormulaire(calendrierId: number, champ: string, valeur: string) {
    setFormulaires((prev) => ({
      ...prev,
      [calendrierId]: {
        date_administration:
          prev[calendrierId]?.date_administration ?? new Date().toISOString().slice(0, 10),
        numero_lot: prev[calendrierId]?.numero_lot ?? "",
        ...(champ === "date_administration"
          ? { date_administration: valeur }
          : { numero_lot: valeur }),
      },
    }));
  }

  async function confirmer(echeance: Echeance) {
    if (!enfantId) return;
    setEnCours(echeance.calendrier_id);
    setErreur(null);
    setSucces(null);
    try {
      const formulaire = formulaires[echeance.calendrier_id];
      await confirmerVaccin({
        enfant_id: enfantId,
        calendrier_id: echeance.calendrier_id,
        date_administration:
          formulaire?.date_administration ||
          new Date().toISOString().slice(0, 10),
        numero_lot: formulaire?.numero_lot || undefined,
      });
      await chargerEcheances(enfantId);
      setSucces(`${echeance.vaccin_nom} (dose ${echeance.dose_numero}) enregistré comme administré.`);
    } catch (e) {
      setErreur(
        e instanceof ApiError ? e.message : "Erreur lors de la confirmation.",
      );
    } finally {
      setEnCours(null);
    }
  }

  /* ---------- Données dérivées ---------- */
  const dosesValidees = useMemo(
    () => echeances.filter((e) => e.statut === "effectue"),
    [echeances],
  );
  const dosesEnAttente = useMemo(
    () => echeances.filter((e) => e.statut !== "effectue"),
    [echeances],
  );

  if (chargement) {
    return (
      <p className="rdv-etat" role="status">
        Chargement…
      </p>
    );
  }

  if (mode === "lecture" && espaceParent.length === 0) {
    return (
      <div className="empty-state">
        <p>Aucun enfant rattaché à votre compte.</p>
      </div>
    );
  }

  return (
    <div className="container-rdv">
      <div className="header">
        <h1>{mode === "lecture" ? "Statuts validés" : "Confirmation des statuts"}</h1>
        <p className="header-subtitle">
          {mode === "lecture"
            ? "Vaccins enregistrés comme administrés par la maternité, avec leur date d’administration."
            : "Validez les doses administrées et corrigez une dose si nécessaire."}
        </p>
      </div>

      {erreur && (
        <div className="rdv-alerte" role="alert">
          {erreur}
        </div>
      )}
      {succes && (
        <div className="rdv-alerte rdv-alerte-succes" role="status">
          {succes}
        </div>
      )}

      {mode === "validation" && (
        <section className="form-section">
          <div className="section-header">
            <h2>Enfant concerné</h2>
            <p className="section-description">
              Seuls les enfants de votre établissement sont proposés par l’API.
            </p>
          </div>
          <div className="form-group">
            <label htmlFor="enfant_statut">Enfant</label>
            <select
              id="enfant_statut"
              value={enfantId ?? ""}
              onChange={(e) => setEnfantId(Number(e.target.value))}
            >
              {enfants.map((enfant) => (
                <option key={enfant.id} value={enfant.id}>
                  {enfant.prenom} {enfant.nom} (ID {enfant.id})
                </option>
              ))}
            </select>
          </div>
        </section>
      )}

      {mode === "lecture" && (
        <section className="form-section">
          <div className="section-header">
            <h2>Doses administrées</h2>
            <p className="section-description">
              Ces informations sont saisies et validées par un agent de maternité.
              Elles font foi dans le dossier de votre enfant.
            </p>
          </div>

          {dosesValidees.length === 0 ? (
            <div className="empty-state">
              <p>Aucun vaccin validé pour le moment.</p>
            </div>
          ) : (
            <>
              <div className="rdv-cartes md:hidden">
                {dosesValidees.map((echeance) => (
                  <article key={echeance.calendrier_id} className="rdv-carte">
                    <div className="rdv-carte-tete">
                      <ShieldCheck
                        className="size-4 shrink-0"
                        aria-hidden="true"
                      />
                      <strong>
                        {echeance.vaccin_nom} · dose {echeance.dose_numero}
                      </strong>
                    </div>
                    <p className="rdv-carte-lieu">
                      Administré le {formatDate(echeance.date_administration)}
                    </p>
                  </article>
                ))}
              </div>

              <div className="table-wrapper hidden md:block">
                <table className="table-rdv">
                  <thead>
                    <tr>
                      <th>Vaccin</th>
                      <th>Dose</th>
                      <th>Date prévue</th>
                      <th>Date d’administration</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dosesValidees.map((echeance) => (
                      <tr key={echeance.calendrier_id}>
                        <td>{echeance.vaccin_nom}</td>
                        <td>{echeance.dose_numero}</td>
                        <td>{formatDate(echeance.date_prevue)}</td>
                        <td>{formatDate(echeance.date_administration)}</td>
                        <td>
                          <BadgeEcheance echeance={echeance} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      )}

      {mode === "validation" && (
        <>
          <section className="form-section">
            <div className="section-header">
              <h2>Doses en attente de validation</h2>
              <p className="section-description">
                Un vaccin prévu mais non reçu se signale en créer un rendez-vous de
                suivi : l’API n’expose pas de statut « non administré ».
              </p>
            </div>

            {dosesEnAttente.length === 0 ? (
              <div className="empty-state">
                <p>Toutes les doses du calendrier sont validées.</p>
              </div>
            ) : (
              dosesEnAttente.map((echeance) => {
                const formulaire = formulaires[echeance.calendrier_id];
                return (
                  <article key={echeance.calendrier_id} className="rdv-carte">
                    <div className="rdv-carte-tete">
                      <strong>
                        {echeance.vaccin_nom} · dose {echeance.dose_numero}
                      </strong>
                      <BadgeEcheance echeance={echeance} />
                    </div>
                    <p className="rdv-carte-motif">
                      Prévu le {formatDate(echeance.date_prevue)}
                      {echeance.jours_restants < 0
                        ? ` · ${Math.abs(echeance.jours_restants)} jours de retard`
                        : ""}
                    </p>
                    <div className="form-grid">
                      <div className="form-group">
                        <label
                          htmlFor={`date-${echeance.calendrier_id}`}
                        >
                          Date d’administration
                        </label>
                        <input
                          id={`date-${echeance.calendrier_id}`}
                          type="date"
                          value={formulaire?.date_administration ?? ""}
                          onChange={(e) =>
                            majFormulaire(
                              echeance.calendrier_id,
                              "date_administration",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor={`lot-${echeance.calendrier_id}`}>
                          Numéro de lot
                        </label>
                        <input
                          id={`lot-${echeance.calendrier_id}`}
                          type="text"
                          maxLength={50}
                          placeholder="Optionnel"
                          value={formulaire?.numero_lot ?? ""}
                          onChange={(e) =>
                            majFormulaire(
                              echeance.calendrier_id,
                              "numero_lot",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-primary"
                      disabled={enCours === echeance.calendrier_id}
                      onClick={() => void confirmer(echeance)}
                    >
                      <CheckCircle2 className="size-4" aria-hidden="true" />
                      {enCours === echeance.calendrier_id
                        ? "Enregistrement…"
                        : "Confirmer l’administration"}
                    </button>
                  </article>
                );
              })
            )}
          </section>

          <section className="form-section">
            <div className="section-header">
              <h2>Déjà validées</h2>
              <p className="section-description">
                Corrigez une dose en réenregistrant une nouvelle date.
              </p>
            </div>

            {dosesValidees.length === 0 ? (
              <div className="empty-state">
                <p>Aucune dose validée pour cet enfant.</p>
              </div>
            ) : (
              <ul className="rdv-liste">
                {dosesValidees.map((echeance) => (
                  <li key={echeance.calendrier_id} className="rdv-ligne">
                    <span className="rdv-ligne-fort">
                      {echeance.vaccin_nom} {echeance.dose_numero}
                    </span>
                    <span>{formatDate(echeance.date_administration)}</span>
                    <span className="rdv-ligne-souple">
                      Lot {echeance.code}
                    </span>
                    <span className={cn("badge badge-honore")}>Administré</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
