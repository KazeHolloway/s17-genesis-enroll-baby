import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { postData, NonConnecteError } from '../../services/http';
import './CreationBaby.css';
import '../dossiers-enfants/Dossiers.css';
const ETAPES = [
  { num: 1, titre: "Informations du nouveau-né" },
  { num: 2, titre: "Informations des parents" },
  { num: 3, titre: "Vérification" },
] as const;
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
const LIBELLE_SEXE: Record<string, string> = {
  F: 'Fille',
  M: 'Garçon',
};
const LIBELLE_STATUT: Record<string, string> = {
  vivant: 'Vivant',
  mort_ne: 'Mort-né',
  decede: 'Décédé',
};
function validerEnfant(fd: FormData): {
  enfant: EnfantPayload;
  erreur?: string;
} {
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
  if (
    !enfant.nom ||
    !enfant.prenom ||
    !enfant.sexe ||
    !enfant.date_naissance
  ) {
    return {
      enfant,
      erreur:
        "Veuillez renseigner tous les champs obligatoires de l'enfant.",
    };
  }
  if (
    enfant.poids_naissance !== undefined &&
    Number.isNaN(enfant.poids_naissance)
  ) {
    return {
      enfant,
      erreur: 'Le poids de naissance est invalide.',
    };
  }
  if (
    enfant.taille_naissance !== undefined &&
    Number.isNaN(enfant.taille_naissance)
  ) {
    return {
      enfant,
      erreur: 'La taille de naissance est invalide.',
    };
  }
  return { enfant };
}
function collecterParents(fd: FormData): {
  parents: ParentPayload[];
  erreur?: string;
} {
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
      return {
        parents,
        erreur:
          `${titre} : le nom et le prénom sont obligatoires`,
      };
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
    return {
      parents,
      erreur:
        'Renseignez au moins un parent (mère, père ou tuteur)',
    };
  }
  return { parents };
}
export default function CreationBaby() {
  const formRef = useRef<HTMLFormElement>(null);
  const [etape, setEtape] = useState(1);
  const [erreur, setErreur] = useState('');
  const [enCours, setEnCours] = useState(false);
  const [resultat, setResultat] = useState<Reponse | null>(null);
  const [resume, setResume] = useState<{
    enfant: EnfantPayload;
    parents: ParentPayload[];
  } | null>(null);
  function allerSuivant() {
    const fd = new FormData(formRef.current ?? undefined);
    if (etape === 1) {
      const { erreur: erreurEnfant } = validerEnfant(fd);
      if (erreurEnfant) {
        setErreur(erreurEnfant);
        return;
      }
    }
    if (etape === 2) {
      const { parents, erreur: erreurParents } = collecterParents(fd);
      if (erreurParents) {
        setErreur(erreurParents);
        return;
      }
      setResume({ enfant: validerEnfant(fd).enfant, parents });
    }
    setErreur('');
    setEtape((s) => Math.min(s + 1, 3));
  }
  function retour() {
    setErreur('');
    setEtape((s) => Math.max(s - 1, 1));
  }
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    // Une touche Entrée ne doit pas sauter les étapes : on avance au lieu
    // d'enregistrer avant d'avoir affiché la vérification.
    if (etape < ETAPES.length) {
      allerSuivant();
      return;
    }
    setErreur('');
    const fd = new FormData(formRef.current ?? undefined);
    const { enfant, erreur: erreurEnfant } =
      validerEnfant(fd);
    if (erreurEnfant) {
      setErreur(erreurEnfant);
      setEtape(1);
      return;
    }
    const { parents, erreur: erreurParents } =
      collecterParents(fd);
    if (erreurParents) {
      setErreur(erreurParents);
      setEtape(2);
      return;
    }
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
        ref={formRef}
        className="bb-carte"
        onSubmit={handleSubmit}
      >
        <h1>Enregistrer un nouveau-né</h1>
        <ol className="bb-etapes">
          {ETAPES.map(({ num, titre }) => (
            <li
              key={num}
              className={`bb-etape ${etape === num ? 'active' : ''} ${etape > num ? 'fait' : ''}`}
            >
              <span className="bb-etape-num">{num}</span>
              <span>{titre}</span>
            </li>
          ))}
        </ol>
        <fieldset
          className={`bb-bloc ${etape === 1 ? '' : 'bb-etape-hidden'}`}
        >
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
        <div
          className={`${etape === 2 ? '' : 'bb-etape-hidden'}`}
        >
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
        </div>
        {etape === 3 && resume && (
          <div className="bb-resume">
            <p className="bb-resume-titre" style={{ gridColumn: '1 / -1' }}>
              Nouveau-né
            </p>
            <div className="bb-resume-item">
              <span>Nom complet</span>
              <span>
                {resume.enfant.prenom} {resume.enfant.nom}
              </span>
            </div>
            <div className="bb-resume-item">
              <span>Sexe</span>
              <span>
                {LIBELLE_SEXE[resume.enfant.sexe] ?? resume.enfant.sexe}
              </span>
            </div>
            <div className="bb-resume-item">
              <span>Date de naissance</span>
              <span>{resume.enfant.date_naissance}</span>
            </div>
            <div className="bb-resume-item">
              <span>Statut</span>
              <span>
                {LIBELLE_STATUT[resume.enfant.statut_vital] ??
                  resume.enfant.statut_vital}
              </span>
            </div>
            {resume.enfant.lieu_naissance && (
              <div className="bb-resume-item">
                <span>Lieu de naissance</span>
                <span>{resume.enfant.lieu_naissance}</span>
              </div>
            )}
            {resume.enfant.poids_naissance !== undefined && (
              <div className="bb-resume-item">
                <span>Poids</span>
                <span>{resume.enfant.poids_naissance} kg</span>
              </div>
            )}
            {resume.enfant.taille_naissance !== undefined && (
              <div className="bb-resume-item">
                <span>Taille</span>
                <span>{resume.enfant.taille_naissance} cm</span>
              </div>
            )}
            <p className="bb-resume-titre" style={{ gridColumn: '1 / -1' }}>
              Parents
            </p>
            {resume.parents.map((parent) => (
              <div
                key={parent.lien}
                className="bb-resume-item"
                style={{ gridColumn: '1 / -1' }}
              >
                <span>{LIENS.find((l) => l.cle === parent.lien)?.titre}</span>
                <span>
                  {parent.prenom} {parent.nom}
                  {parent.telephone ? ` — ${parent.telephone}` : ''}
                  {parent.email ? ` — ${parent.email}` : ''}
                  {parent.adresse ? ` — ${parent.adresse}` : ''}
                </span>
              </div>
            ))}
          </div>
        )}
        {erreur && (
          <p className="bb-erreur">
            {erreur}
          </p>
        )}
        {etape < 3 ? (
          <div className="bb-navigation">
            {etape > 1 ? (
              <button
                type="button"
                onClick={retour}
                className="bb-retour"
              >
                ← Retour
              </button>
            ) : (
              <span />
            )}
            <button
              type="button"
              onClick={allerSuivant}
            >
              Suivant →
            </button>
          </div>
        ) : (
          <button
            type="submit"
            disabled={enCours}
            className="bb-confirmer"
          >
            {enCours
              ? 'Enregistrement...'
              : "Valider l'enregistrement"}
          </button>
        )}
      </form>
    </main>
  );
}