import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/useAuth';
import {
  getData,
  NonConnecteError,
} from '../../services/http';
import '../enregistrement-nouveau-ne/CreationBaby.css';
import './Dossiers.css';
type Parent = {
  id: number;
  nom: string;
  prenom: string;
  telephone: string | null;
  email: string | null;
  adresse: string | null;
  lien: 'mere' | 'pere' | 'tuteur';
};
type Dossier = {
  id: number;
  nom: string;
  prenom: string;
  sexe: 'M' | 'F';
  date_naissance: string;
  lieu_naissance: string | null;
  poids_naissance: string | null;
  taille_naissance: string | null;
  statut_vital: string;
  numero_dossier: string | null;
  parents: Parent[];
};
const LIENS: Record<string, string> = {
  mere: 'Mère',
  pere: 'Père',
  tuteur: 'Tuteur',
};
const STATUTS: Record<string, string> = {
  vivant: 'Vivant',
  mort_ne: 'Mort-né',
  decede: 'Décédé',
};
const formaterDate = (date: string) =>
  new Date(date).toLocaleDateString('fr-FR');
function Ligne({
  libelle,
  valeur,
}: {
  libelle: string;
  valeur?: string | null;
}) {
  return (
    <div className="bb-ligne">
      <dt>{libelle}</dt>
      <dd>{valeur || 'Non renseigné'}</dd>
    </div>
  );
}
export default function DossierEnfant() {
  const { id } = useParams();
  const { utilisateur } = useAuth();
  const [dossier, setDossier] =
    useState<Dossier | null>(null);
  const [chargement, setChargement] =
    useState(true);
  const [erreur, setErreur] = useState('');
  const [nonConnecte, setNonConnecte] =
    useState(false);
  useEffect(() => {
    if (!id) {
      return;
    }

    getData<Dossier>(`/api/enfants/${id}`)
      .then(setDossier)
      .catch((e: unknown) => {
        if (e instanceof NonConnecteError) {
          setNonConnecte(true);
        } else {
          setErreur(
            e instanceof Error
              ? e.message
              : 'Une erreur est survenue'
          );
        }
      })
      .finally(() => {
        setChargement(false);
      });
  }, [id]);
  return (
    <main className="bb-page">
      <section className="bb-carte">
        <Link
          to={
            utilisateur?.role === 'parent'
              ? '/parent/enfants'
              : '/agent/dossiers'
          }
          className="bb-retour"
        >
          ← Retour à la liste
        </Link>
        {chargement && (
          <p className="bb-aide">
            Chargement...
          </p>
        )}
        {nonConnecte && (
          <p className="bb-erreur">
            Vous n'êtes pas connecté.{' '}
            <Link to="/login">
              Se connecter
            </Link>
          </p>
        )}
        {erreur && (
          <p className="bb-erreur">
            {erreur}
          </p>
        )}
        {dossier && (
          <>
            <div className="bb-barre">
              <div>
                <h1>
                  {dossier.prenom}{' '}
                  {dossier.nom}
                </h1>
                <p className="bb-numero">
                  Dossier n°{' '}
                  {dossier.numero_dossier ??
                    'non créé'}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  window.print()
                }
              >
                Imprimer
              </button>
            </div>
            <h2 className="bb-titre-section">
              Informations de l'enfant
            </h2>
            <dl className="bb-infos">
              <Ligne
                libelle="Sexe"
                valeur={
                  dossier.sexe === 'F'
                    ? 'Fille'
                    : 'Garçon'
                }
              />
              <Ligne
                libelle="Date de naissance"
                valeur={formaterDate(
                  dossier.date_naissance
                )}
              />
              <Ligne
                libelle="Lieu de naissance"
                valeur={
                  dossier.lieu_naissance
                }
              />
              <Ligne
                libelle="Poids"
                valeur={
                  dossier.poids_naissance
                    ? `${dossier.poids_naissance} kg`
                    : null
                }
              />
              <Ligne
                libelle="Taille"
                valeur={
                  dossier.taille_naissance
                    ? `${dossier.taille_naissance} cm`
                    : null
                }
              />
              <Ligne
                libelle="Statut"
                valeur={
                  STATUTS[
                    dossier.statut_vital
                  ] ??
                  dossier.statut_vital
                }
              />
            </dl>
            <h2 className="bb-titre-section">
              Parents
            </h2>
            {dossier.parents.length === 0 && (
              <p className="bb-aide">
                Aucun parent enregistré.
              </p>
            )}
            {dossier.parents.map(
              (parent) => (
                <div
                  key={parent.id}
                  className="bb-parent"
                >
                  <h3>
                    {LIENS[parent.lien] ??
                      parent.lien}
                    {' : '}
                    {parent.prenom}{' '}
                    {parent.nom}
                  </h3>
                  <dl className="bb-infos">
                    <Ligne
                      libelle="Téléphone"
                      valeur={
                        parent.telephone
                      }
                    />
                    <Ligne
                      libelle="Email"
                      valeur={
                        parent.email
                      }
                    />
                    <Ligne
                      libelle="Adresse"
                      valeur={
                        parent.adresse
                      }
                    />
                  </dl>
                </div>
              )
            )}
          </>
        )}
      </section>
    </main>
  );
}