import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarCheck2,
  FileText,
  Printer,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/contexts/useAuth";
import { useEspaceParent } from "@/lib/dashboard/useEspaceParent";
import { ageLabel, toDisplayDate } from "@/lib/dashboard/adapterParent";
import { ouvrirHtmlImprimable } from "@/lib/imprimable";
import {
  getDeclarationImprimable,
  getDossierImprimable,
} from "@/services/api";
import type { ParentEspace } from "@/services/api";

/**
 * Dossier d'un enfant côté parent (`/parent/enfants/:id`).
 *
 * Les données viennent de l'espace parent déjà chargé par le layout (une seule
 * requête partagée, jamais un `GET /api/parents/espace` par page). La page
 * ajoute l'accès aux documents : dossier complet et déclaration de naissance,
 * rendus en HTML prêt à imprimer par le backend.
 */
export default function ParentChildDetail() {
  const { id } = useParams();
  const { utilisateur } = useAuth();
  const { enfants, chargement, erreur } = useEspaceParent(
    utilisateur?.role === "parent",
  );
  const [enCours, setEnCours] = useState<"" | "dossier" | "declaration">("");

  const espace = enfants.find((e) => e.enfant.id === Number(id));

  const ouvrir = async (type: "dossier" | "declaration") => {
    if (!espace) return;
    setEnCours(type);
    try {
      const html =
        type === "dossier"
          ? await getDossierImprimable(espace.dossier.id)
          : await getDeclarationImprimable(espace.dossier.id);
      ouvrirHtmlImprimable(html);
    } catch {
      /* Message générique : le bouton reste cliquable pour réessayer. */
    } finally {
      setEnCours("");
    }
  };

  return (
    <div className="space-y-6">
      <Link
        to="/parent/enfants"
        className="inline-flex min-h-11 items-center gap-2 rounded-xl text-sm font-semibold text-[var(--app-action)] transition-colors hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Retour à mes enfants
      </Link>

      {chargement && (
        <p className="text-sm text-[var(--app-muted)]" role="status">
          Chargement du dossier…
        </p>
      )}

      {!chargement && erreur && (
        <div className="app-card p-6" role="alert">
          <p className="text-sm text-[var(--app-muted)]">{erreur}</p>
        </div>
      )}

      {!chargement && !erreur && !espace && (
        <div className="app-card p-6 text-center text-sm text-[var(--app-muted)]">
          Cet enfant n’est pas rattaché à votre compte.
        </div>
      )}

      {!chargement && !erreur && espace && (
        <CarteDossier
          espace={espace}
          enCours={enCours}
          onOuvrir={ouvrir}
        />
      )}
    </div>
  );
}

function CarteDossier({
  espace,
  enCours,
  onOuvrir,
}: {
  espace: ParentEspace;
  enCours: "" | "dossier" | "declaration";
  onOuvrir: (type: "dossier" | "declaration") => void;
}) {
  const { enfant, dossier, declaration } = espace;

  return (
    <div className="space-y-6">
      {/* ---------- Identité de l'enfant ---------- */}
      <section className="app-card space-y-5 p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-full border-2 border-[var(--app-action)]/30 font-serif text-xl font-bold text-[var(--app-action)]">
            {enfant.prenom.charAt(0)}
            {enfant.nom.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-serif text-xl font-bold text-[var(--app-heading)]">
              {enfant.prenom} {enfant.nom}
            </h1>
            <p className="mt-1 text-sm text-[var(--app-muted)]">
              Né(e) le {toDisplayDate(enfant.date_naissance)} ·{" "}
              {ageLabel(enfant.date_naissance)}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="app-chip">
                <ShieldCheck className="size-3.5" aria-hidden="true" />
                Dossier {dossier.numero}
              </span>
              <span className="app-chip">{dossier.statut}</span>
            </div>
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-3 border-t border-[var(--app-border-soft)] pt-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-[var(--app-faint)]">Lieu de naissance</dt>
            <dd className="mt-0.5 text-sm font-semibold text-[var(--app-heading)]">
              {enfant.lieu_naissance || "Non renseigné"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--app-faint)]">Établissement</dt>
            <dd className="mt-0.5 text-sm font-semibold text-[var(--app-heading)]">
              {enfant.etablissement || "Non renseigné"}
            </dd>
          </div>
        </dl>
      </section>

      {/* ---------- Déclaration à l'état civil ---------- */}
      {declaration && (
        <section className="app-card space-y-3 p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <CalendarCheck2
              className="size-4 text-[var(--app-action)]"
              aria-hidden="true"
            />
            <h2 className="text-base font-bold text-[var(--app-heading)]">
              Déclaration à l’état civil
            </h2>
          </div>
          <p className="text-sm text-[var(--app-muted)]">{declaration.message}</p>
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-[var(--app-faint)]">Statut</dt>
              <dd className="mt-0.5 text-sm font-semibold text-[var(--app-heading)]">
                {declaration.statut === "declaree"
                  ? "Déclarée"
                  : declaration.statut === "delai_expire"
                    ? "Délai dépassé"
                    : "En cours"}
              </dd>
            </div>
            {declaration.date_limite && (
              <div>
                <dt className="text-xs text-[var(--app-faint)]">Date limite</dt>
                <dd className="mt-0.5 text-sm font-semibold text-[var(--app-heading)]">
                  {toDisplayDate(declaration.date_limite)}
                </dd>
              </div>
            )}
          </dl>
        </section>
      )}

      {/* ---------- Documents ---------- */}
      <section className="app-card space-y-3 p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-[var(--app-action)]" aria-hidden="true" />
          <h2 className="text-base font-bold text-[var(--app-heading)]">
            Documents du dossier
          </h2>
        </div>
        <p className="text-sm text-[var(--app-muted)]">
          Les documents s’ouvrent dans un onglet, prêts à imprimer.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => onOuvrir("dossier")}
            disabled={enCours !== ""}
            className="app-action w-full justify-center sm:w-auto"
          >
            <Printer className="size-4" aria-hidden="true" />
            {enCours === "dossier"
              ? "Préparation…"
              : "Dossier complet (imprimable)"}
          </button>
          <button
            type="button"
            onClick={() => onOuvrir("declaration")}
            disabled={enCours !== ""}
            className="app-action-outline w-full justify-center sm:w-auto"
          >
            <FileText className="size-4" aria-hidden="true" />
            {enCours === "declaration"
              ? "Préparation…"
              : "Déclaration de naissance"}
          </button>
        </div>
      </section>
    </div>
  );
}