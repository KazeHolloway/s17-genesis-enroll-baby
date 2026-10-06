import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { postData, NonConnecteError } from '../../services/http';
import './CreationBaby.css';
import '../dossiers-enfants/Dossiers.css';
const LIENS = [
  { cle: 'mere', titre: 'Mère' },
  { cle: 'pere', titre: 'Père' },
  { cle: 'tuteur', titre: 'Tuteur' },
] as const;
type ParentPayload = {
  nom: string;
  prenom: string;
  telephone?: string;
  email?: string;
  adresse?: string;
  lien: 'mere' | 'pere' | 'tuteur';
};
type EnfantPayload = {
  nom: string;
  prenom: string;
  sexe: string;
  date_naissance: string;
  lieu_naissance?: string;
  poids_naissance?: number;
  taille_naissance?: number;
  statut_vital: string;
};
type Reponse = {
  enfant: {
    prenom: string;
    nom: string;
  };
  dossier: {
    numero_dossier: string;
    code_acces: string;
  };
};
const texte = (fd: FormData, champ: string) =>
  String(fd.get(champ) ?? '').trim();
export default function CreationBaby() {
  const [erreur, setErreur] = useState('');
  const [enCours, setEnCours] = useState(false);
  const [resultat, setResultat] = useState<Reponse | null>(null);
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setErreur('');
    const fd = new FormData(event.currentTarget);
    // -----------------------------
    // 1. Récupération des parents
    // -----------------------------
    const parents: ParentPayload[] = [];
    for (const { cle, titre } of LIENS) {
      const nom = texte(fd, `${cle}_nom`);
      const prenom = texte(fd, `${cle}_prenom`);
      // Bloc complètement vide : on l'ignore.
      if (!nom && !prenom) {
        continue;
      }
      // Si un seul des deux est renseigné,
      // le bloc est considéré comme invalide.
      if (!nom || !prenom) {
        setErreur(
          `${titre} : le nom et le prénom sont obligatoires`
        );
        return;
      }
      parents.push({
        nom,
        prenom,
        telephone:
          texte(fd, `${cle}_telephone`) || undefined,
        email:
          texte(fd, `${cle}_email`) || undefined,
        adresse:
          texte(fd, `${cle}_adresse`) || undefined,
        lien: cle,
      });
    }
    if (parents.length === 0) {
      setErreur(
        'Renseignez au moins un parent (mère, père ou tuteur)'
      );
      return;
    }
    // -----------------------------
    // 2. Récupération de l'enfant
    // -----------------------------
    const poids = texte(fd, 'poids_naissance');
    const taille = texte(fd, 'taille_naissance');
    const enfant: EnfantPayload = {
      nom: texte(fd, 'nom'),
      prenom: texte(fd, 'prenom'),
      sexe: texte(fd, 'sexe'),
      date_naissance: texte(fd, 'date_naissance'),
      lieu_naissance:
        texte(fd, 'lieu_naissance') || undefined,
      poids_naissance: poids ? Number(poids) : undefined,
      taille_naissance: taille ? Number(taille) : undefined,
      statut_vital:
        texte(fd, 'statut_vital') || 'vivant',
    };
    // -----------------------------
    // 3. Validation complémentaire
    // -----------------------------
    if (
      !enfant.nom ||
      !enfant.prenom ||
      !enfant.sexe ||
      !enfant.date_naissance
    ) {
      setErreur(
        "Veuillez renseigner tous les champs obligatoires de l'enfant."
      );
      return;
    }
    if (
      enfant.poids_naissance !== undefined &&
      Number.isNaN(enfant.poids_naissance)
    ) {
      setErreur('Le poids de naissance est invalide.');
      return;
    }
    if (
      enfant.taille_naissance !== undefined &&
      Number.isNaN(enfant.taille_naissance)
    ) {
      setErreur('La taille de naissance est invalide.');
      return;
    }
    // -----------------------------
    // 4. Envoi au backend
    // -----------------------------
    setEnCours(true);
    try {
      const reponse = await postData<Reponse>(
        '/api/enfants/enregistrement',
        {
          enfant,
          parents,
        }
      );
      setResultat(reponse);
    } catch (e) {
      if (e instanceof NonConnecteError) {
        setErreur(
          'Vous devez être connecté en tant qu’agent de maternité. Reconnectez-vous puis réessayez.'
        );
      } else {
        setErreur(
          e instanceof Error
            ? e.message
            : "Impossible d'enregistrer le nouveau-né."
        );
      }
    } finally {
      setEnCours(false);
    }
  }
  // -----------------------------
  // Écran après réussite
  // -----------------------------
  if (resultat) {
    return (
      <main className="bb-page">
        <section className="bb-carte bb-succes">
          <h1>Nouveau-né enregistré</h1>
          <p>
            Dossier de{' '}
            <strong>
              {resultat.enfant.prenom} {resultat.enfant.nom}
            </strong>
          </p>
          <p>Numéro de dossier</p>
          <p className="bb-code">
            {resultat.dossier.numero_dossier}
          </p>
          <p>Code d'accès à remettre au parent</p>
          <p className="bb-code">
            {resultat.dossier.code_acces}
          </p>
          <p className="bb-alerte">
            Notez ce code maintenant : il ne sera plus jamais
            affiché.
          </p>
          <div className="bb-actions">
            <button
              type="button"
              onClick={() => window.print()}
            >
              Imprimer
            </button>
            <button
              type="button"
              onClick={() => setResultat(null)}
            >
              Enregistrer un autre
            </button>
            <Link
              to="/agent/dossiers"
              className="bb-bouton"
            >
              Voir la liste
            </Link>
          </div>
        </section>
      </main>
    );
  }
  return (
    <main className="bb-page">
      <form
        className="bb-carte"
        onSubmit={handleSubmit}
      >
        <h1>Enregistrer un nouveau-né</h1>
        <fieldset className="bb-bloc">
          <legend>Informations de l'enfant</legend>
          <div className="bb-grille">
            <label>
              Nom *
              <input name="nom" required />
            </label>
            <label>
              Prénom *
              <input name="prenom" required />
            </label>
            <label>
              Sexe *
              <select
                name="sexe"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Sélectionner
                </option>
                <option value="F">
                  Fille
                </option>
                <option value="M">
                  Garçon
                </option>
              </select>
            </label>
            <label>
              Date de naissance *
              <input
                name="date_naissance"
                type="date"
                required
                max={
                  new Date()
                    .toISOString()
                    .slice(0, 10)
                }
              />
            </label>
            <label>
              Lieu de naissance
              <input name="lieu_naissance" />
            </label>
            <label>
              Statut
              <select
                name="statut_vital"
                defaultValue="vivant"
              >
                <option value="vivant">
                  Vivant
                </option>
                <option value="mort_ne">
                  Mort-né
                </option>
                <option value="decede">
                  Décédé
                </option>
              </select>
            </label>
            <label>
              Poids (kg)
              <input
                name="poids_naissance"
                type="number"
                step="0.01"
                min="0"
              />
            </label>
            <label>
              Taille (cm)
              <input
                name="taille_naissance"
                type="number"
                step="0.1"
                min="0"
              />
            </label>
          </div>
        </fieldset>
        <p className="bb-aide">
          Renseignez au moins un parent. Les blocs
          laissés vides sont ignorés.
        </p>
        {LIENS.map(({ cle, titre }) => (
          <fieldset
            className="bb-bloc"
            key={cle}
          >
            <legend>{titre}</legend>
            <div className="bb-grille">
              <label>
                Nom
                <input name={`${cle}_nom`} />
              </label>
              <label>
                Prénom
                <input name={`${cle}_prenom`} />
              </label>
              <label>
                Téléphone
                <input
                  name={`${cle}_telephone`}
                  type="tel"
                  placeholder="+242 06 123 45 67"
                />
              </label>
              <label>
                Email
                <input
                  name={`${cle}_email`}
                  type="email"
                />
              </label>
              <label className="bb-large">
                Adresse
                <input name={`${cle}_adresse`} />
              </label>
            </div>
          </fieldset>
        ))}
        {erreur && (
          <p className="bb-erreur">
            {erreur}
          </p>
        )}
        <button
          type="submit"
          disabled={enCours}
        >
          {enCours
            ? 'Enregistrement...'
            : 'Valider'}
        </button>
      </form>
    </main>
  );
}