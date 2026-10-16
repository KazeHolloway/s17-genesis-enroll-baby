import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getData,
  NonConnecteError,
} from '../../services/http';
import '../enregistrement-nouveau-ne/CreationBaby.css';
type Enfant = {
  id: number;
  nom: string;
  prenom: string;
  sexe: 'M' | 'F';
  date_naissance: string;
  statut_vital: string;
};
const STATUTS: Record<string, string> = {
  vivant: 'Vivant',
  mort_ne: 'Mort-né',
  decede: 'Décédé',
};
const formaterDate = (date: string) =>
  new Date(date).toLocaleDateString('fr-FR');
export default function ListeEnfants() {
  const [enfants, setEnfants] = useState<Enfant[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [nonConnecte, setNonConnecte] = useState(false);
  useEffect(() => {
    getData<Enfant[]>('/api/enfants')
      .then(setEnfants)
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
  }, []);
  return (
    <main className="bb-page">
      <section className="bb-carte">
        <div className="bb-barre">
          <h1>Nouveau-nés enregistrés</h1>
          <Link
            to="/agent/nouveau-ne"
            className="bb-bouton"
          >
            + Enregistrer un nouveau-né
          </Link>
        </div>
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
        {!chargement &&
          !nonConnecte &&
          !erreur &&
          enfants.length === 0 && (
            <p className="bb-aide">
              Aucun nouveau-né enregistré pour le
              moment.
            </p>
          )}
        <ul className="bb-liste">
          {enfants.map((enfant) => (
            <li
              key={enfant.id}
              className="bb-enfant"
            >
              <div>
                <h2>
                  {enfant.prenom} {enfant.nom}
                </h2>
                <p>
                  {enfant.sexe === 'F'
                    ? 'Fille'
                    : 'Garçon'}{' '}
                  · né(e) le{' '}
                  {formaterDate(
                    enfant.date_naissance
                  )}
                </p>
                <span className="bb-badge">
                  {STATUTS[
                    enfant.statut_vital
                  ] ?? enfant.statut_vital}
                </span>
              </div>
              <Link
                to={`/agent/dossiers/${enfant.id}`}
                className="bb-bouton"
              >
                Voir le dossier
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}