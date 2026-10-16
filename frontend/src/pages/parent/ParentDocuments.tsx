import { useState } from "react";
import {
  BadgeCheck,
  FileText,
  Printer,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/useAuth";
import { useEspaceParent } from "@/lib/dashboard/useEspaceParent";
import { toDisplayDate } from "@/lib/dashboard/adapterParent";
import { ouvrirHtmlImprimable } from "@/lib/imprimable";
import {
  certificatUrlAbsolu,
  getDeclarationDossier,
  getDeclarationImprimable,
  getDossierImprimable,
} from "@/services/api";
import type { ParentEspace } from "@/services/api";

/**
 * Espace documents du parent.
 *
 * Les pièces sont générées par le backend à partir du dossier réel :
 *  - le dossier complet (état civil, parents, calendrier vaccinal),
 *  - la déclaration de naissance à imprimer et signer,
 *  - le certificat numérique, quand la naissance est déclarée.
 * Rien n'est enregistré côté client : chaque document est recalculé à la demande.
 */
export default function ParentDocuments() {
  const { utilisateur } = useAuth();
  const { enfants, chargement, erreur } = useEspaceParent(
    utilisateur?.role === "parent",
  );
  const [enPreparation, setEnPreparation] = useState<number | null>(null);

  const ouvrirDossier = async (espace: ParentEspace) => {
    setEnPreparation(espace.dossier.id);
    try {
      const html = await getDossierImprimable(espace.dossier.id);
      ouvrirHtmlImprimable(html);
    } catch {
      /* Les erreurs du backend (401, dossier introuvable) restent silencieuses :
         le bouton reste disponible pour réessayer. */
    } finally {
      setEnPreparation(null);
    }
  };

  const ouvrirDeclaration = async (espace: ParentEspace) => {
    setEnPreparation(espace.dossier.id);
    try {
      const html = await getDeclarationImprimable(espace.dossier.id);
      ouvrirHtmlImprimable(html);
    } catch {
      /* Idem : silencieux pour ne pas couper la navigation. */
    } finally {
      setEnPreparation(null);
    }
  };

  const ouvrirCertificat = async (espace: ParentEspace) => {
    try {
      const reponse = await getDeclarationDossier(espace.dossier.id);
      const url = reponse.data.certificat_url;
      if (url) window.open(certificatUrlAbsolu(url), "_blank");
    } catch {
      /* Silencieux : le certificat n'est pas encore générable. */
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[var(--app-heading)]">
          Documents
        </h1>
        <p className="mt-1 text-sm text-[var(--app-muted)]">
          Les pièces de votre dossier : acte et déclaration de naissance, fiche
          de vaccination.
        </p>
      </div>

      {chargement && (
        <p className="text-sm text-[var(--app-muted)]" role="status">
          Chargement des documents…
        </p>
      )}

      {!chargement && erreur && (
        <div className="app-card p-6" role="alert">
          <p className="text-sm text-[var(--app-muted)]">{erreur}</p>
        </div>
      )}

      {!chargement && !erreur && enfants.length === 0 && (
        <div className="app-card p-6 text-center text-sm text-[var(--app-muted)]">
          Aucun enfant rattaché à votre compte pour le moment.
        </div>
      )}

      {!chargement &&
        !erreur &&
        enfants.map((espace) => (
          <section
            key={espace.dossier.id}
            className="app-card space-y-4 p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-serif text-lg font-bold text-[var(--app-heading)]">
                  {espace.enfant.prenom} {espace.enfant.nom}
                </h2>
                <p className="mt-0.5 text-sm text-[var(--app-muted)]">
                  Dossier {espace.dossier.numero} · né(e) le{" "}
                  {toDisplayDate(espace.enfant.date_naissance)}
                </p>
              </div>
              <span className="app-chip">
                <ShieldCheck className="size-3.5" aria-hidden="true" />
                {espace.dossier.statut}
              </span>
            </div>

            <ul className="space-y-2">
              <LigneDocument
                icone={FileText}
                titre="Dossier du nouveau-né"
                description="Identité, parents, état civil et calendrier vaccinal."
                label={
                  enPreparation === espace.dossier.id
                    ? "Préparation…"
                    : "Voir le dossier"
                }
                surPresse={() => void ouvrirDossier(espace)}
                desactive={enPreparation === espace.dossier.id}
              />
              <LigneDocument
                icone={Printer}
                titre="Déclaration de naissance"
                description="À imprimer pour la mairie, à signer par la sage-femme."
                label={
                  enPreparation === espace.dossier.id
                    ? "Préparation…"
                    : "Voir la déclaration"
                }
                surPresse={() => void ouvrirDeclaration(espace)}
                desactive={enPreparation === espace.dossier.id}
              />
              <LigneDocument
                icone={
                  espace.declaration?.statut === "declaree"
                    ? BadgeCheck
                    : XCircle
                }
                titre="Certificat numérique"
                description={
                  espace.declaration?.statut === "declaree"
                    ? "Disponible après déclaration à l’état civil."
                    : "Généré une fois la naissance déclarée à la mairie."
                }
                label={
                  espace.declaration?.statut === "declaree" ? "Ouvrir" : "—"
                }
                surPresse={() => void ouvrirCertificat(espace)}
                desactive={
                  espace.declaration?.statut !== "declaree" ||
                  enPreparation === espace.dossier.id
                }
              />
            </ul>
          </section>
        ))}
    </div>
  );
}

function LigneDocument({
  icone: Icone,
  titre,
  description,
  label,
  surPresse,
  desactive,
}: {
  icone: typeof FileText;
  titre: string;
  description: string;
  label: string;
  surPresse: () => void;
  desactive?: boolean;
}) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-xl border border-[var(--app-border-soft)] p-3">
      <div className="flex min-w-0 items-start gap-3">
        <span className="app-icon-tile shrink-0">
          <Icone className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--app-heading)]">
            {titre}
          </p>
          <p className="mt-0.5 text-xs text-[var(--app-muted)]">{description}</p>
        </div>
      </div>
      {label !== "—" ? (
        <button
          type="button"
          onClick={surPresse}
          disabled={desactive}
          className="app-action-outline shrink-0 !rounded-lg !px-3 !py-1.5 !text-xs"
        >
          {label}
        </button>
      ) : (
        <span className="shrink-0 text-xs text-[var(--app-faint)]">—</span>
      )}
    </li>
  );
}