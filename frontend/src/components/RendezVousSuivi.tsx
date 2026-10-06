import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarClock, CheckCircle2, Clock3, Plus, XCircle } from "lucide-react";
import {
  ApiError,
  creerRendezVous,
  getEnfants,
  getEtablissements,
  getRappelsRendezVous,
  getRendezVousEnfant,
  majRendezVous,
  type EnfantAgent,
  type Etablissement,
  type RappelRendezVous,
  type RendezVous,
} from "@/services/api";
import { useEspaceParent } from "@/lib/dashboard/useEspaceParent";
import { useAuth } from "@/contexts/useAuth";
import { cn } from "@/lib/utils";
import "@/styles/rendezvous.css";

/**
 * Rendez-vous de vaccination et rappels 24 h.
 *
 * Le composant sert deux rôles, avec le même rendu :
 *  - `agent` : planifie un rendez-vous et met à jour son statut ;
 *  - `parent` : consultation seule de ses rendez-vous et des rappels actifs.
 *
 * Point important sur les rappels. Le ticket « Rendez-vous de suivi » demande
 * un rappel généré 24 h avant la date prévue, mis à jour si le rendez-vous
 * change. Le backend ne stocke aucun rappel : `GET /api/rendez-vous/rappels`
 * liste à la volée les rendez-vous `planifie` situés dans les prochaines 24 h.
 * Conséquence utile : un rendez-vous annulé disparaît de la liste, un
 * rendez-vous déplacé revient avec sa nouvelle fenêtre, sans travail
 * supplémentaire. On affiche donc un compte à rebours plutôt qu'une date
 * d'envoi, puisque cette date n'existe pas côté serveur.
 */

type Mode = "agent" | "parent";

const STATUTS: { valeur: RendezVous["statut"]; libelle: string }[] = [
  { valeur: "planifie", libelle: "Planifié" },
  { valeur: "honore", libelle: "Honoré" },
  { valeur: "manque", libelle: "Manqué" },
  { valeur: "annule", libelle: "Annulé" },
];

function libelleStatut(statut: RendezVous["statut"]): string {
  return STATUTS.find((s) => s.valeur === statut)?.libelle ?? statut;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Compte à rebours du rappel, en minutes. Le serveur ne renvoie que la date du
 * rendez-vous, la fenêtre des 24 h est donc recalculée ici à l'affichage.
 */
function minutesRestantes(dateRdv: string): number {
  return Math.round((new Date(dateRdv).getTime() - Date.now()) / 60000);
}

function rappelCompteARebours(dateRdv: string): string {
  const minutes = minutesRestantes(dateRdv);
  if (minutes <= 0) return "échéance atteinte";
  const heures = Math.floor(minutes / 60);
  if (heures >= 1) return `dans ${heures} h`;
  return `dans ${minutes} min`;
}

export default function RendezVousSuivi({ mode }: { mode: Mode }) {
  const { utilisateur } = useAuth();
  const { enfants: espaceParent } = useEspaceParent(mode === "parent");

  /* ---------------- Agent : référentiels de sélection ---------------- */
  const [enfants, setEnfants] = useState<EnfantAgent[]>([]);
  const [etablissements, setEtablissements] = useState<Etablissement[]>([]);

  /* ---------------- Parent : rendez-vous ---------------- */
  const [rdvs, setRdvs] = useState<RendezVous[]>([]);
  const [rappels, setRappels] = useState<RappelRendezVous[]>([]);

  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [enregistrement, setEnregistrement] = useState(false);
  const [succes, setSucces] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    enfant_id: "",
    date_rdv: "",
    heure_rdv: "",
    motif: "",
  });

  /* L'agent choisit un enfant, le parent n'en choisit pas : son enfant est
     déduit de l'espace. `enfantSelectionne` est donc l'identifiant courant dans
     les deux cas. */
  const enfantSelectionne =
    mode === "agent"
      ? Number(formData.enfant_id) || null
      : (espaceParent[0]?.enfant.id ?? null);

  const enfantParent = mode === "parent" ? espaceParent[0]?.enfant : undefined;

  const nomEnfant = useMemo(() => {
    if (mode === "agent") {
      const enfant = enfants.find((e) => e.id === enfantSelectionne);
      return enfant ? `${enfant.prenom} ${enfant.nom}` : null;
    }
    return enfantParent ? `${enfantParent.prenom} ${enfantParent.nom}` : null;
  }, [mode, enfants, enfantSelectionne, enfantParent]);

  /* L'établissement suit l'enfant : le serveur le déduit à la création, on
     l'affiche donc en lecture seule pour que l'agent sache où le rendez-vous
     sera enregistré. */
  const etablissementNom = useMemo(() => {
    const id =
      mode === "agent"
        ? enfants.find((e) => e.id === enfantSelectionne)?.etablissement_id
        : null;
    return etablissements.find((e) => e.id === id)?.nom ?? null;
  }, [mode, enfants, etablissements, enfantSelectionne]);

  /* ---------------- Chargement ---------------- */
  const chargerRendezVous = useCallback(async (enfantId: number) => {
    const reponse = await getRendezVousEnfant(enfantId);
    setRdvs(reponse.data ?? []);
  }, []);

  /* Le cache partagé change d'identité à chaque mise à jour : le mettre dans
     les dépendances rejoue l'effet à chaque rafraîchissement et relance les
     appels en boucle. On n'observe que des valeurs primitives. */
  const enfantIdParent = enfantParent?.id ?? null;

  useEffect(() => {
    let annule = false;

    async function charger() {
      setChargement(true);
      setErreur(null);
      try {
        if (mode === "agent") {
          const [listeEnfants, listeEtablissements] = await Promise.all([
            getEnfants(),
            getEtablissements(),
          ]);
          if (annule) return;
          setEnfants(listeEnfants ?? []);
          setEtablissements(listeEtablissements.data ?? []);
          setChargement(false);
          return;
        }

        /* Parent : les rappels 24 h sont un endpoint dédié, les rendez-vous
           passent par le calendrier de chaque enfant. */
        const reponseRappels = await getRappelsRendezVous();
        if (annule) return;
        setRappels(reponseRappels.data ?? []);

        if (enfantIdParent) {
          await chargerRendezVous(enfantIdParent);
        } else {
          setRdvs([]);
        }
        if (!annule) setChargement(false);
      } catch (e) {
        if (annule) return;
        setErreur(
          e instanceof ApiError ? e.message : "Impossible de charger les données.",
        );
        setChargement(false);
      }
    }

    void charger();
    return () => {
      annule = true;
    };
  }, [mode, utilisateur?.id, enfantIdParent, chargerRendezVous]);

  /* L'agent recharge la liste dès qu'il change d'enfant sélectionné. */
  useEffect(() => {
    if (mode !== "agent" || !enfantSelectionne) return;

    let annule = false;

    void (async () => {
      try {
        const reponse = await getRendezVousEnfant(enfantSelectionne);
        if (annule) return;
        setRdvs(reponse.data ?? []);
        setErreur(null);
      } catch (e: unknown) {
        if (annule) return;
        setErreur(
          e instanceof ApiError
            ? e.message
            : "Impossible de charger les rendez-vous.",
        );
      }
    })();

    return () => {
      annule = true;
    };
  }, [mode, enfantSelectionne]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!enfantSelectionne) return;

    setEnregistrement(true);
    setErreur(null);
    setSucces(null);
    try {
      const heure = formData.heure_rdv || "09:00";
      await creerRendezVous({
        enfant_id: enfantSelectionne,
        date_rdv: `${formData.date_rdv}T${heure}:00`,
        motif: formData.motif || null,
      });
      await chargerRendezVous(enfantSelectionne);
      setFormData({ enfant_id: "", date_rdv: "", heure_rdv: "", motif: "" });
      setSucces("Rendez-vous enregistré.");
    } catch (e) {
      setErreur(
        e instanceof ApiError ? e.message : "Erreur lors de l'enregistrement.",
      );
    } finally {
      setEnregistrement(false);
    }
  }

  async function changerStatut(id: number, statut: RendezVous["statut"]) {
    setErreur(null);
    try {
      await majRendezVous(id, { statut });
      if (enfantSelectionne) await chargerRendezVous(enfantSelectionne);
    } catch (e) {
      setErreur(
        e instanceof ApiError ? e.message : "Erreur lors de la mise à jour.",
      );
    }
  }

  /* ---------------- Rendu ---------------- */
  if (chargement) {
    return (
      <p className="rdv-etat" role="status">
        Chargement…
      </p>
    );
  }

  const sansEnfant =
    mode === "agent" ? enfants.length === 0 : espaceParent.length === 0;

  return (
    <div className="container-rdv">
      <div className="header">
        <h1>Rendez-vous de suivi</h1>
        <p className="header-subtitle">
          {mode === "agent"
            ? "Planifiez les rendez-vous de vaccination et suivez les rappels envoyés 24 h avant."
            : "Consultez les rendez-vous de vaccination de votre enfant et les rappels qui vous attendent."}
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

      {sansEnfant && (
        <div className="empty-state">
          <p>Aucun enfant disponible pour le moment.</p>
        </div>
      )}

      {/* ---------- Rappels 24 h ---------- */}
      {mode === "parent" && rappels.length > 0 && (
        <section className="form-section">
          <div className="section-header">
            <h2>Rappels à venir</h2>
            <p className="section-description">
              Votre rappel s’affiche 24 heures avant le rendez-vous. Il suit
              automatiquement toute modification faite par la maternité.
            </p>
          </div>
          <div className="rdv-cartes md:hidden">
            {rappels.map((rappel) => (
              <article key={rappel.id} className="rdv-carte">
                <div className="rdv-carte-tete">
                  <Clock3 className="size-4 shrink-0" aria-hidden="true" />
                  <strong>{rappel.enfant_prenom}</strong>
                  <span className="rdv-compte-a-rebours">
                    {rappelCompteARebours(rappel.date_rdv)}
                  </span>
                </div>
                <p className="rdv-carte-lieu">{formatDateTime(rappel.date_rdv)}</p>
                {rappel.motif && (
                  <p className="rdv-carte-motif">{rappel.motif}</p>
                )}
              </article>
            ))}
          </div>
          <ul className="rdv-liste hidden md:block">
            {rappels.map((rappel) => (
              <li key={rappel.id} className="rdv-ligne">
                <span className="rdv-ligne-fort">{rappel.enfant_prenom}</span>
                <span>{formatDateTime(rappel.date_rdv)}</span>
                <span className="rdv-ligne-souple">{rappel.motif ?? "—"}</span>
                <span className="badge badge-rappel-attente">
                  {rappelCompteARebours(rappel.date_rdv)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ---------- Formulaire (agent) ---------- */}
      {mode === "agent" && !sansEnfant && (
        <section className="form-section">
          <div className="section-header">
            <h2>Enregistrer un rendez-vous</h2>
            <p className="section-description">
              Le rappel de 24 h est calculé à partir de la date du rendez-vous.
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="enfant_id">Enfant *</label>
                <select
                  id="enfant_id"
                  name="enfant_id"
                  value={formData.enfant_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choisir un enfant…</option>
                  {enfants.map((enfant) => (
                    <option key={enfant.id} value={enfant.id}>
                      {enfant.prenom} {enfant.nom} (ID {enfant.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                {/* Information déduite du backend, pas une saisie : `createRendezVous`
                    prend l'établissement de l'enfant et ignore tout champ transmis. */}
                <label htmlFor="etablissement_info">Établissement</label>
                <input
                  id="etablissement_info"
                  type="text"
                  value={etablissementNom ?? "Sélectionnez un enfant"}
                  readOnly
                  tabIndex={-1}
                />
              </div>

              <div className="form-group">
                <label htmlFor="date_rdv">Date du rendez-vous *</label>
                <input
                  type="date"
                  id="date_rdv"
                  name="date_rdv"
                  value={formData.date_rdv}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="heure_rdv">Heure *</label>
                <input
                  type="time"
                  id="heure_rdv"
                  name="heure_rdv"
                  value={formData.heure_rdv}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group span-2">
                <label htmlFor="motif">Motif *</label>
                <textarea
                  id="motif"
                  name="motif"
                  value={formData.motif}
                  onChange={handleChange}
                  required
                  placeholder="Ex. Vaccination VPI 1"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={enregistrement}>
              <Plus className="size-4" aria-hidden="true" />
              {enregistrement ? "Enregistrement…" : "Enregistrer"}
            </button>
          </form>
        </section>
      )}

      {/* ---------- Liste des rendez-vous ---------- */}
      {!sansEnfant && (
        <section className="form-section">
          <div className="section-header">
            <h2>Rendez-vous</h2>
            <p className="section-description">
              {nomEnfant ? `Dossier de ${nomEnfant}.` : "Sélectionnez un enfant."}
            </p>
          </div>

          {rdvs.length === 0 ? (
            <div className="empty-state">
              <p>Aucun rendez-vous enregistré.</p>
            </div>
          ) : (
            <>
              {/* Cartes tactiles sur téléphone, tableau à partir de md. */}
              <div className="rdv-cartes md:hidden">
                {rdvs.map((rdv) => (
                  <article key={rdv.id} className="rdv-carte">
                    <div className="rdv-carte-tete">
                      <CalendarClock
                        className="size-4 shrink-0"
                        aria-hidden="true"
                      />
                      <strong>{formatDateTime(rdv.date_rdv)}</strong>
                      <span className={`badge badge-${rdv.statut}`}>
                        {libelleStatut(rdv.statut)}
                      </span>
                    </div>
                    {rdv.motif && <p className="rdv-carte-motif">{rdv.motif}</p>}
                    {mode === "agent" && (
                      <div className="rdv-carte-actions">
                        <button
                          type="button"
                          className="rdv-btn"
                          onClick={() => changerStatut(rdv.id, "honore")}
                        >
                          <CheckCircle2 className="size-4" aria-hidden="true" />
                          Honoré
                        </button>
                        <button
                          type="button"
                          className="rdv-btn"
                          onClick={() => changerStatut(rdv.id, "manque")}
                        >
                          <XCircle className="size-4" aria-hidden="true" />
                          Manqué
                        </button>
                      </div>
                    )}
                  </article>
                ))}
              </div>

              <div className="table-wrapper hidden md:block">
                <table className="table-rdv">
                  <thead>
                    <tr>
                      <th>Date et heure</th>
                      <th>Motif</th>
                      <th>Statut</th>
                      {mode === "agent" && <th>Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {rdvs.map((rdv) => (
                      <tr key={rdv.id}>
                        <td>{formatDateTime(rdv.date_rdv)}</td>
                        <td>{rdv.motif ?? "—"}</td>
                        <td>
                          <span className={`badge badge-${rdv.statut}`}>
                            {libelleStatut(rdv.statut)}
                          </span>
                        </td>
                        {mode === "agent" && (
                          <td>
                            <div className={cn("actions-row")}>
                              <button
                                type="button"
                                className="rdv-btn"
                                onClick={() => changerStatut(rdv.id, "honore")}
                              >
                                Honoré
                              </button>
                              <button
                                type="button"
                                className="rdv-btn"
                                onClick={() => changerStatut(rdv.id, "manque")}
                              >
                                Manqué
                              </button>
                              <button
                                type="button"
                                className="rdv-btn"
                                onClick={() => changerStatut(rdv.id, "annule")}
                              >
                                Annulé
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}
