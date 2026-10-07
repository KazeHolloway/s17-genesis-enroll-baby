import React, { useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Baby,
  Check,
  ClipboardCheck,
  Copy,
  KeyRound,
  Printer,
  ShieldCheck,
  UserCheck,
  Users,
} from 'lucide-react';
import type { Child, ChildGender } from '../../types/dashboard';
import { PrintableChildDossierModal } from '../PrintableChildDossierModal';

interface AgentNewbornProps {
  onAddChild: (newChild: Child) => void;
  /** Persiste le nouveau-né via `POST /api/enfants/enregistrement`. */
  creer?: (child: Child) => Promise<Child>;
  etablissement?: string;
  onShowToast: (msg: string) => void;
  onCancel?: () => void;
}

const ETAPES = [
  { numero: 1, titre: 'Nouveau-né' },
  { numero: 2, titre: 'Parents' },
  { numero: 3, titre: 'Tuteur' },
  { numero: 4, titre: 'Vérification' },
] as const;

const etiquette =
  'block text-xs font-semibold text-[#103d34] dark:text-emerald-200 mb-1.5';
const champ =
  'w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-white dark:bg-black text-[#103d34] dark:text-emerald-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1b5e52]';
const champCompact =
  'w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-emerald-500/20 bg-white dark:bg-black text-xs font-mono text-[#103d34] dark:text-emerald-100';
const boutonPrimaire =
  'px-5 py-2.5 rounded-xl bg-[#1b5e52] hover:bg-[#144b41] text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-60 transition-colors';
const boutonSecondaire =
  'px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer flex items-center gap-1.5 transition-colors';

const aujourdHui = new Date().toISOString().slice(0, 10);

/** Nombre facultatif borné ; `''` accepté. */
function verifierNombre(
  valeur: string,
  libelle: string,
  min: number,
  max: number,
): string | null {
  if (!valeur.trim()) return null;
  const nombre = Number(valeur);
  if (!Number.isFinite(nombre) || nombre < min || nombre > max) {
    return `${libelle} doit être compris entre ${min} et ${max}.`;
  }
  return null;
}

/** Nom + prénom renseignés ; sinon message d'erreur. */
function verifierNomEtPrenom(nom: string, prenom: string, libelle: string): string | null {
  if (!nom.trim()) return `Le nom de ${libelle} est obligatoire.`;
  if (!prenom.trim()) return `Le prénom de ${libelle} est obligatoire.`;
  return null;
}

function Ligne({ libelle, valeur }: { libelle: string; valeur?: string }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2 border-b border-slate-100 dark:border-white/5 last:border-0">
      <span className="text-[11px] text-slate-400 shrink-0">{libelle}</span>
      <span className="text-xs font-semibold text-[#103d34] dark:text-emerald-100 text-right break-words">
        {valeur?.trim() ? valeur : '—'}
      </span>
    </div>
  );
}

export const AgentNewborn: React.FC<AgentNewbornProps> = ({
  onAddChild,
  creer,
  etablissement,
  onShowToast,
  onCancel,
}) => {
  const [etape, setEtape] = useState(1);
  const [erreur, setErreur] = useState('');
  const [createdChild, setCreatedChild] = useState<Child | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showPrintDossier, setShowPrintDossier] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  /**
   * Horodatage du dernier changement d'étape : le navigateur peut soumettre le
   * formulaire par « activation » du clic qui vient de transformer le bouton
   * « Continuer » en bouton « submit ». On ignore toute soumission arrivant
   * juste après un passage d'étape.
   */
  const dernierPassageEtape = useRef(0);

  // 1. Nouveau-né (colonnes de la table `enfants`)
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [poids, setPoids] = useState('');
  const [taille, setTaille] = useState('');
  const [sexe, setSexe] = useState<ChildGender>('Garçon');
  const [lieuNaissance] = useState(etablissement ?? '');

  // 2. Parents (colonnes de la table `parents`)
  const [nomMere, setNomMere] = useState('');
  const [prenomMere, setPrenomMere] = useState('');
  const [telMere, setTelMere] = useState('');
  const [emailMere, setEmailMere] = useState('');
  const [adresseMere, setAdresseMere] = useState('');
  const [nomPere, setNomPere] = useState('');
  const [prenomPere, setPrenomPere] = useState('');
  const [telPere, setTelPere] = useState('');
  const [emailPere, setEmailPere] = useState('');
  const [adressePere, setAdressePere] = useState('');

  // 3. Tuteur (facultatif)
  const [nomTuteur, setNomTuteur] = useState('');
  const [prenomTuteur, setPrenomTuteur] = useState('');
  const [telTuteur, setTelTuteur] = useState('');
  const [emailTuteur, setEmailTuteur] = useState('');
  const [adresseTuteur, setAdresseTuteur] = useState('');

  const pereRenseigne = Boolean(
    nomPere.trim() ||
      prenomPere.trim() ||
      telPere.trim() ||
      emailPere.trim() ||
      adressePere.trim(),
  );

  const tuteurRenseigne = Boolean(
    nomTuteur.trim() ||
      prenomTuteur.trim() ||
      telTuteur.trim() ||
      emailTuteur.trim() ||
      adresseTuteur.trim(),
  );

  const reinitialiser = () => {
    setEtape(1);
    setErreur('');
    setNom('');
    setPrenom('');
    setDateNaissance('');
    setPoids('');
    setTaille('');
    setSexe('Garçon');
    setNomMere('');
    setPrenomMere('');
    setTelMere('');
    setEmailMere('');
    setAdresseMere('');
    setNomPere('');
    setPrenomPere('');
    setTelPere('');
    setEmailPere('');
    setAdressePere('');
    setNomTuteur('');
    setPrenomTuteur('');
    setTelTuteur('');
    setEmailTuteur('');
    setAdresseTuteur('');
  };

  const validerEtape1 = (): string | null => {
    if (!nom.trim()) return 'Le nom de famille est obligatoire.';
    if (!prenom.trim()) return 'Le prénom est obligatoire.';
    if (!dateNaissance) return 'La date de naissance est obligatoire.';
    if (dateNaissance > aujourdHui)
      return 'La date de naissance ne peut pas être dans le futur.';
    return (
      verifierNombre(poids, 'Le poids', 0, 20) ??
      verifierNombre(taille, 'La taille', 0, 70)
    );
  };

  const validerEtape2 = (): string | null => {
    const erreurMere = verifierNomEtPrenom(nomMere, prenomMere, 'la mère');
    if (erreurMere) return erreurMere;
    if (!telMere.trim())
      return 'Le téléphone de la mère est obligatoire (suivi & rappels).';
    if (pereRenseigne) {
      const erreurPere = verifierNomEtPrenom(nomPere, prenomPere, 'le père');
      if (erreurPere) return erreurPere;
      if (!telPere.trim())
        return 'Le téléphone du père est obligatoire dès que le père est renseigné.';
    }
    return null;
  };

  const validerEtape3 = (): string | null => {
    if (!tuteurRenseigne) return null;
    const erreurTuteur = verifierNomEtPrenom(nomTuteur, prenomTuteur, 'du tuteur');
    if (erreurTuteur) return erreurTuteur;
    if (!telTuteur.trim())
      return 'Le téléphone du tuteur est obligatoire dès que le tuteur est renseigné.';
    return null;
  };

  const suivant = () => {
    const erreurEtape =
      etape === 1
        ? validerEtape1()
        : etape === 2
          ? validerEtape2()
          : validerEtape3();
    if (erreurEtape) {
      setErreur(erreurEtape);
      return;
    }
    setErreur('');
    dernierPassageEtape.current = Date.now();
    setEtape((e) => Math.min(e + 1, 4));
  };

  const precedent = () => {
    setErreur('');
    dernierPassageEtape.current = Date.now();
    setEtape((e) => Math.max(e - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (etape !== 4) return;
    // Soumission fantôme déclenchée par le passage d'étape : on l'ignore.
    if (Date.now() - dernierPassageEtape.current < 500) return;

    const erreurFinale =
      validerEtape1() ?? validerEtape2() ?? validerEtape3();
    if (erreurFinale) {
      setErreur(erreurFinale);
      return;
    }
    if (envoi || !creer) return;
    setErreur('');
    setEnvoi(true);

    const base: Child = {
      id: '',
      nom: nom.trim(),
      prenom: prenom.trim(),
      dateNaissance: new Date(dateNaissance).toLocaleDateString('fr-FR'),
      poids: poids ? `${poids} kg` : '',
      taille: taille ? `${taille} cm` : '',
      sexe,
      lieuNaissance,
      photoUrl: '',
      status: 'en_cours',
      referenceMaternite: '',
      mere: {
        nom: `${prenomMere.trim()} ${nomMere.trim()}`.trim(),
        prenom: prenomMere.trim(),
        nomFamille: nomMere.trim(),
        telephone: telMere.trim(),
        email: emailMere.trim() || undefined,
        adresse: adresseMere.trim() || undefined,
      },
      pere: pereRenseigne
        ? {
            nom: `${prenomPere.trim()} ${nomPere.trim()}`.trim(),
            prenom: prenomPere.trim(),
            nomFamille: nomPere.trim(),
            telephone: telPere.trim(),
            email: emailPere.trim() || undefined,
            adresse: adressePere.trim() || undefined,
          }
        : { nom: '', telephone: '' },
      tuteur: tuteurRenseigne
        ? {
            nom: `${prenomTuteur.trim()} ${nomTuteur.trim()}`.trim(),
            prenom: prenomTuteur.trim(),
            nomFamille: nomTuteur.trim(),
            telephone: telTuteur.trim(),
            email: emailTuteur.trim() || undefined,
            adresse: adresseTuteur.trim() || undefined,
          }
        : undefined,
      etapes: [
        { titre: 'Constat médical d’accouchement effectué', date: 'Aujourd’hui', complete: true },
        { titre: 'Certificat médical de naissance transmis', date: 'Aujourd’hui', complete: true },
        { titre: 'Transmission à l’Officier d’État Civil', date: 'En attente', complete: false },
        { titre: 'Délivrance de l’acte d’état civil', date: 'En attente signature', complete: false },
      ],
    };

    try {
      const enregistre = await creer(base);
      setCreatedChild(enregistre);
      onAddChild(enregistre);
      onShowToast(
        `Naissance enregistrée. Code d'accès parent ${enregistre.codeAccesParent ?? '—'}.`,
      );
    } catch (erreurEnregistrement) {
      onShowToast(
        erreurEnregistrement instanceof Error
          ? erreurEnregistrement.message
          : "Enregistrement impossible : vérifiez les champs saisis.",
      );
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-[#103d34] dark:text-[#f0fdf9]">
          Déclarer une nouvelle naissance (Volet Médical)
        </h2>
        <p className="text-xs text-[#526f67] dark:text-emerald-200/70">
          Saisie immédiate à la maternité pour transmission sécurisée à l'Officier d'État Civil.
        </p>
      </div>

      {/* Progression des 3 étapes + vérification */}
      <ol className="flex flex-wrap items-center gap-2">
        {ETAPES.map((item) => {
          const actif = item.numero === etape;
          const fait = item.numero < etape;
          return (
            <li key={item.numero} className="flex items-center gap-2">
              <span
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-colors ${
                  actif
                    ? 'bg-[#1b5e52] text-white border-[#1b5e52]'
                    : fait
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#1b7e5c] dark:text-emerald-300 border-emerald-500/30'
                      : 'bg-white dark:bg-black text-slate-400 border-slate-200 dark:border-white/10'
                }`}
              >
                <span className="font-mono">
                  {fait ? <Check className="w-3 h-3" /> : item.numero}
                </span>
                {item.titre}
              </span>
              {item.numero < ETAPES.length && (
                <span className="h-px w-4 bg-slate-200 dark:bg-white/10" />
              )}
            </li>
          );
        })}
      </ol>

      <form
        onSubmit={handleSubmit}
        className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-6"
      >
        {etape === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/10">
              <Baby className="w-4 h-4 text-[#1b7e5c] dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-[#103d34] dark:text-emerald-100 uppercase tracking-wider">
                1. Informations du nouveau-né
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={etiquette}>Nom de famille *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ngoma"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className={champ}
                />
              </div>

              <div>
                <label className={etiquette}>Prénom de l'enfant *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: David"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  className={champ}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={etiquette}>Date de naissance *</label>
                <input
                  type="date"
                  required
                  max={aujourdHui}
                  value={dateNaissance}
                  onChange={(e) => setDateNaissance(e.target.value)}
                  className={champ}
                />
              </div>

              <div>
                <label className={etiquette}>Sexe *</label>
                <div className="flex items-center gap-4 pt-2">
                  <label className="flex items-center gap-1.5 text-xs text-[#103d34] dark:text-emerald-200 cursor-pointer">
                    <input
                      type="radio"
                      name="agent_sexe"
                      value="Garçon"
                      checked={sexe === 'Garçon'}
                      onChange={() => setSexe('Garçon')}
                      className="text-[#1b5e52]"
                    />
                    <span>Garçon</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-[#103d34] dark:text-emerald-200 cursor-pointer">
                    <input
                      type="radio"
                      name="agent_sexe"
                      value="Fille"
                      checked={sexe === 'Fille'}
                      onChange={() => setSexe('Fille')}
                      className="text-[#1b5e52]"
                    />
                    <span>Fille</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Poids (kg)</label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="20"
                  value={poids}
                  onChange={(e) => setPoids(e.target.value)}
                  className={champCompact}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Taille (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="70"
                  value={taille}
                  onChange={(e) => setTaille(e.target.value)}
                  className={champCompact}
                />
              </div>
            </div>

            {lieuNaissance && (
              <p className="text-[11px] text-slate-400">
                Établissement de naissance :{' '}
                <span className="font-semibold text-[#526f67] dark:text-emerald-200/80">
                  {lieuNaissance}
                </span>
              </p>
            )}
          </div>
        )}

        {etape === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/10">
              <Users className="w-4 h-4 text-[#1b7e5c] dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-[#103d34] dark:text-emerald-100 uppercase tracking-wider">
                2. Informations des parents
              </h3>
            </div>

            <p className="text-[11px] text-slate-400">
              Colonnes de la table <span className="font-mono">parents</span> :
              nom, prénom, téléphone, email, adresse. La mère est obligatoire ;
              le bloc père est facultatif mais doit être complet s'il est
              renseigné.
            </p>

            {/* Mère */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4">
              <span className="text-xs font-bold text-[#1b7e5c] dark:text-emerald-300">
                Mère *
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={etiquette}>Nom *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ngoma"
                    value={nomMere}
                    onChange={(e) => setNomMere(e.target.value)}
                    className={champ}
                  />
                </div>
                <div>
                  <label className={etiquette}>Prénom *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Sylvie"
                    value={prenomMere}
                    onChange={(e) => setPrenomMere(e.target.value)}
                    className={champ}
                  />
                </div>
                <div>
                  <label className={etiquette}>
                    Téléphone (pour le suivi & les rappels) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+242 06 123 45 67"
                    value={telMere}
                    onChange={(e) => setTelMere(e.target.value)}
                    className={champ}
                  />
                </div>
                <div>
                  <label className={etiquette}>Email</label>
                  <input
                    type="email"
                    placeholder="Ex: sylvie.ngoma@mail.cd"
                    value={emailMere}
                    onChange={(e) => setEmailMere(e.target.value)}
                    className={champ}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={etiquette}>Adresse</label>
                  <input
                    type="text"
                    placeholder="Ex: 12, av. Kasa-Vubu, Brazzaville"
                    value={adresseMere}
                    onChange={(e) => setAdresseMere(e.target.value)}
                    className={champ}
                  />
                </div>
              </div>
            </div>

            {/* Père */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4">
              <span className="text-xs font-bold text-[#1b7e5c] dark:text-emerald-300">
                Père (facultatif)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={etiquette}>Nom</label>
                  <input
                    type="text"
                    placeholder="Ex: Ngoma"
                    value={nomPere}
                    onChange={(e) => setNomPere(e.target.value)}
                    className={champ}
                  />
                </div>
                <div>
                  <label className={etiquette}>Prénom</label>
                  <input
                    type="text"
                    placeholder="Ex: Jean"
                    value={prenomPere}
                    onChange={(e) => setPrenomPere(e.target.value)}
                    className={champ}
                  />
                </div>
                <div>
                  <label className={etiquette}>Téléphone</label>
                  <input
                    type="tel"
                    placeholder="+242 06 123 45 67"
                    value={telPere}
                    onChange={(e) => setTelPere(e.target.value)}
                    className={champ}
                  />
                </div>
                <div>
                  <label className={etiquette}>Email</label>
                  <input
                    type="email"
                    placeholder="Ex: jean.ngoma@mail.cd"
                    value={emailPere}
                    onChange={(e) => setEmailPere(e.target.value)}
                    className={champ}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={etiquette}>Adresse</label>
                  <input
                    type="text"
                    placeholder="Ex: 12, av. Kasa-Vubu, Brazzaville"
                    value={adressePere}
                    onChange={(e) => setAdressePere(e.target.value)}
                    className={champ}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {etape === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/10">
              <UserCheck className="w-4 h-4 text-[#1b7e5c] dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-[#103d34] dark:text-emerald-100 uppercase tracking-wider">
                3. Informations du tuteur
              </h3>
            </div>

            <p className="text-[11px] text-slate-400">
              Facultatif : laissez ce bloc vide si aucun tuteur légal n'est à
              déclarer. Un bloc partiellement rempli est refusé.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={etiquette}>Nom du tuteur</label>
                <input
                  type="text"
                  placeholder="Ex: Ilunga"
                  value={nomTuteur}
                  onChange={(e) => setNomTuteur(e.target.value)}
                  className={champ}
                />
              </div>

              <div>
                <label className={etiquette}>Prénom du tuteur</label>
                <input
                  type="text"
                  placeholder="Ex: Joseph"
                  value={prenomTuteur}
                  onChange={(e) => setPrenomTuteur(e.target.value)}
                  className={champ}
                />
              </div>

              <div>
                <label className={etiquette}>Téléphone du tuteur</label>
                <input
                  type="tel"
                  placeholder="+242 06 123 45 67"
                  value={telTuteur}
                  onChange={(e) => setTelTuteur(e.target.value)}
                  className={champ}
                />
              </div>

              <div>
                <label className={etiquette}>Email du tuteur</label>
                <input
                  type="email"
                  placeholder="Ex: joseph.ngoma@mail.cd"
                  value={emailTuteur}
                  onChange={(e) => setEmailTuteur(e.target.value)}
                  className={champ}
                />
              </div>

              <div>
                <label className={etiquette}>Adresse du tuteur</label>
                <input
                  type="text"
                  placeholder="Ex: 12, av. Kasa-Vubu, Kinshasa"
                  value={adresseTuteur}
                  onChange={(e) => setAdresseTuteur(e.target.value)}
                  className={champ}
                />
              </div>
            </div>
          </div>
        )}

        {etape === 4 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/10">
              <ClipboardCheck className="w-4 h-4 text-[#1b7e5c] dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-[#103d34] dark:text-emerald-100 uppercase tracking-wider">
                4. Vérification avant enregistrement
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-[#f7fbf9] dark:bg-black/40">
                <div className="flex items-center justify-between gap-2 pb-2 mb-1 border-b border-slate-200/70 dark:border-white/10">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-[#1b7e5c] dark:text-emerald-300">
                    <Baby className="w-3.5 h-3.5" /> Nouveau-né
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setErreur('');
                      setEtape(1);
                    }}
                    className="text-[11px] font-semibold text-[#1b5e52] dark:text-emerald-400 underline cursor-pointer"
                  >
                    Modifier
                  </button>
                </div>
                <Ligne libelle="Nom" valeur={nom} />
                <Ligne libelle="Prénom" valeur={prenom} />
                <Ligne
                  libelle="Date de naissance"
                  valeur={
                    dateNaissance
                      ? new Date(dateNaissance).toLocaleDateString('fr-FR')
                      : ''
                  }
                />
                <Ligne libelle="Sexe" valeur={sexe} />
                <Ligne libelle="Poids" valeur={poids ? `${poids} kg` : ''} />
                <Ligne libelle="Taille" valeur={taille ? `${taille} cm` : ''} />
                <Ligne libelle="Établissement" valeur={lieuNaissance} />
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-[#f7fbf9] dark:bg-black/40">
                  <div className="flex items-center justify-between gap-2 pb-2 mb-1 border-b border-slate-200/70 dark:border-white/10">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[#1b7e5c] dark:text-emerald-300">
                      <Users className="w-3.5 h-3.5" /> Parents
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setErreur('');
                        setEtape(2);
                      }}
                      className="text-[11px] font-semibold text-[#1b5e52] dark:text-emerald-400 underline cursor-pointer"
                    >
                      Modifier
                    </button>
                  </div>
                  <Ligne
                    libelle="Mère"
                    valeur={`${prenomMere} ${nomMere}`.trim()}
                  />
                  <Ligne libelle="Téléphone mère" valeur={telMere} />
                  <Ligne libelle="Email mère" valeur={emailMere} />
                  <Ligne libelle="Adresse mère" valeur={adresseMere} />
                  <Ligne
                    libelle="Père"
                    valeur={
                      pereRenseigne
                        ? `${prenomPere} ${nomPere}`.trim()
                        : ''
                    }
                  />
                  <Ligne libelle="Téléphone père" valeur={telPere} />
                  <Ligne libelle="Email père" valeur={emailPere} />
                  <Ligne libelle="Adresse père" valeur={adressePere} />
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-[#f7fbf9] dark:bg-black/40">
                  <div className="flex items-center justify-between gap-2 pb-2 mb-1 border-b border-slate-200/70 dark:border-white/10">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[#1b7e5c] dark:text-emerald-300">
                      <UserCheck className="w-3.5 h-3.5" /> Tuteur
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setErreur('');
                        setEtape(3);
                      }}
                      className="text-[11px] font-semibold text-[#1b5e52] dark:text-emerald-400 underline cursor-pointer"
                    >
                      Modifier
                    </button>
                  </div>
                  {tuteurRenseigne ? (
                    <>
                      <Ligne
                        libelle="Tuteur"
                        valeur={`${prenomTuteur} ${nomTuteur}`.trim()}
                      />
                      <Ligne libelle="Téléphone" valeur={telTuteur} />
                      <Ligne libelle="Email" valeur={emailTuteur} />
                      <Ligne libelle="Adresse" valeur={adresseTuteur} />
                    </>
                  ) : (
                    <p className="text-[11px] text-slate-400 pt-1">
                      Aucun tuteur déclaré (facultatif).
                    </p>
                  )}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-emerald-200/70 text-left">
              Vérifiez les informations avant l'enregistrement : une fois
              validé, le dossier est transmis à l'Officier d'État Civil et le
              code d'accès parent ne sera affiché qu'une seule fois.
            </p>
          </div>
        )}

        {erreur && (
          <p className="text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/30 rounded-xl px-3 py-2">
            {erreur}
          </p>
        )}

        <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex flex-wrap items-center gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
            >
              Annuler
            </button>
          )}

          <div className="ml-auto flex items-center gap-2">
            {etape > 1 && (
              <button type="button" onClick={precedent} className={boutonSecondaire}>
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Précédent</span>
              </button>
            )}

            {etape < 4 ? (
              <button
                key="continuer"
                type="button"
                onClick={suivant}
                className={boutonPrimaire}
              >
                <span>Continuer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                key="enregistrer"
                type="submit"
                disabled={envoi}
                className={boutonPrimaire}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{envoi ? 'Enregistrement…' : 'Enregistrer la naissance'}</span>
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Success Dialog with Parent Code & Printable Options (Ticket 1, 5) */}
      {createdChild && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-2xl border border-emerald-500/30 overflow-hidden flex flex-col p-6 sm:p-7 space-y-5 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-mono">
                Réf : {createdChild.referenceMaternite}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#103d34] dark:text-[#f0fdf9]">
                Constat d'accouchement validé !
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                L'enfant {createdChild.prenom} {createdChild.nom} est officiellement inscrit dans le registre de maternité.
              </p>
            </div>

            {/* Generated Parent Access Code Card (Ticket 1) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#ebf5f0] dark:bg-[#121c19] border-2 border-emerald-500/40 text-center space-y-2.5">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#103d34] dark:text-emerald-300">
                <KeyRound className="w-4 h-4 text-emerald-600" />
                <span>Code d'accès unique généré pour le parent</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl sm:text-3xl font-mono font-bold text-[#103d34] dark:text-emerald-300 tracking-wider">
                  {createdChild.codeAccesParent}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (createdChild.codeAccesParent) {
                      navigator.clipboard.writeText(createdChild.codeAccesParent);
                      setCopiedCode(true);
                      setTimeout(() => setCopiedCode(false), 3000);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-black border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  title="Copier le code"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedCode ? 'Copié !' : 'Copier'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-emerald-200/80 leading-relaxed max-w-sm mx-auto">
                Inscrivez ce code sur le carnet ou remettez-le aux parents. Il leur permet de se connecter instantanément à leur espace sans démarches administratives complexes.
              </p>
            </div>

            {/* Printable Documents (Ticket 5) */}
            <div className="text-left">
              <button
                type="button"
                onClick={() => setShowPrintDossier(true)}
                className="p-3.5 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-white/10 hover:border-emerald-500/40 transition-colors flex items-center gap-3 cursor-pointer group shadow-2xs"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <strong className="text-xs text-[#103d34] dark:text-emerald-100 block">Dossier papier complet</strong>
                  <span className="text-[10px] text-slate-400">Carnet pour parents sans smartphone</span>
                </div>
              </button>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setCreatedChild(null);
                  reinitialiser();
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
              >
                Déclarer un autre enfant
              </button>

              <button
                type="button"
                onClick={() => {
                  setCreatedChild(null);
                  reinitialiser();
                  if (onCancel) onCancel();
                }}
                className="px-6 py-2.5 rounded-xl bg-[#1b5e52] hover:bg-[#144b41] text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
              >
                Retourner au registre
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Modals */}
      {showPrintDossier && createdChild && (
        <PrintableChildDossierModal
          isOpen={showPrintDossier}
          onClose={() => setShowPrintDossier(false)}
          child={createdChild}
        />
      )}
    </div>
  );
};
