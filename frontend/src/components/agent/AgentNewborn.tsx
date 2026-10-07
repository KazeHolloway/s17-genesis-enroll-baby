import React, { useState } from 'react';
import { Baby, Users, ShieldCheck, KeyRound, Copy, Printer, Check } from 'lucide-react';
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

export const AgentNewborn: React.FC<AgentNewbornProps> = ({
  onAddChild,
  creer,
  etablissement,
  onShowToast,
  onCancel,
}) => {
  const [createdChild, setCreatedChild] = useState<Child | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showPrintDossier, setShowPrintDossier] = useState(false);
  const [envoi, setEnvoi] = useState(false);

  // Enfant
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [heureNaissance, setHeureNaissance] = useState('');
  const [poids, setPoids] = useState('');
  const [taille, setTaille] = useState('');
  const [perimetreCranien, setPerimetreCranien] = useState('');
  const [apgar1, setApgar1] = useState('');
  const [apgar5] = useState('');
  const [sexe, setSexe] = useState<ChildGender>('Garçon');
  const [lieuNaissance] = useState(etablissement ?? '');

  // Parents
  const [nomMere, setNomMere] = useState('');
  const [telMere, setTelMere] = useState('');
  const [nomPere, setNomPere] = useState('');
  const [telPere, setTelPere] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim() || !prenom.trim() || !nomMere.trim() || !dateNaissance) {
      onShowToast('Veuillez renseigner le nom, le prénom, la date de naissance et le nom de la mère.');
      return;
    }
    if (envoi || !creer) return;
    setEnvoi(true);

    const base: Child = {
      id: '',
      nom: nom.trim(),
      prenom: prenom.trim(),
      dateNaissance: new Date(dateNaissance).toLocaleDateString('fr-FR'),
      heureNaissance,
      poids: poids ? `${poids} kg` : '',
      taille: taille ? `${taille} cm` : '',
      sexe,
      lieuNaissance,
      photoUrl: '',
      status: 'en_cours',
      referenceMaternite: '',
      mere: { nom: nomMere.trim(), telephone: telMere.trim() },
      pere: {
        nom: nomPere.trim(),
        telephone: telPere.trim(),
      },
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
    } catch (erreur) {
      onShowToast(
        erreur instanceof Error ? erreur.message : "Enregistrement impossible : vérifiez les champs saisis.",
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

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-6">
        {/* Section 1: Nouveau-né */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/10">
            <Baby className="w-4 h-4 text-[#1b7e5c] dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-[#103d34] dark:text-emerald-100 uppercase tracking-wider">
              1. Informations du nouveau-né
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#103d34] dark:text-emerald-200 mb-1.5">
                Nom de famille *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Ngoma"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-white dark:bg-black text-[#103d34] dark:text-emerald-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1b5e52]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#103d34] dark:text-emerald-200 mb-1.5">
                Prénom de l'enfant *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: David"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-white dark:bg-black text-[#103d34] dark:text-emerald-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1b5e52]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#103d34] dark:text-emerald-200 mb-1.5">
                Date de naissance *
              </label>
              <input
                type="date"
                required
                value={dateNaissance}
                onChange={(e) => setDateNaissance(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-white dark:bg-black text-[#103d34] dark:text-emerald-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1b5e52]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#103d34] dark:text-emerald-200 mb-1.5">
                Heure exacte *
              </label>
              <input
                type="time"
                required
                value={heureNaissance}
                onChange={(e) => setHeureNaissance(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-white dark:bg-black text-[#103d34] dark:text-emerald-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1b5e52]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#103d34] dark:text-emerald-200 mb-1.5">
                Sexe *
              </label>
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

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Poids (kg)</label>
              <input
                type="number"
                step="0.05"
                value={poids}
                onChange={(e) => setPoids(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-emerald-500/20 bg-white dark:bg-black text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Taille (cm)</label>
              <input
                type="number"
                value={taille}
                onChange={(e) => setTaille(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-emerald-500/20 bg-white dark:bg-black text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Périmètre crânien (cm)</label>
              <input
                type="number"
                value={perimetreCranien}
                onChange={(e) => setPerimetreCranien(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-emerald-500/20 bg-white dark:bg-black text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Score APGAR</label>
              <input
                type="text"
                value={`${apgar1} / ${apgar5}`}
                onChange={(e) => setApgar1(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-emerald-500/20 bg-white dark:bg-black text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Parents */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/10">
            <Users className="w-4 h-4 text-[#1b7e5c] dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-[#103d34] dark:text-emerald-100 uppercase tracking-wider">
              2. Informations des parents
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#103d34] dark:text-emerald-200 mb-1.5">
                Nom complet de la mère *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Sylvie Ngoma"
                value={nomMere}
                onChange={(e) => setNomMere(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-white dark:bg-black text-[#103d34] dark:text-emerald-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1b5e52]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#103d34] dark:text-emerald-200 mb-1.5">
                Téléphone de la mère (pour le suivi & les rappels) *
              </label>
              <input
                type="tel"
                required
                value={telMere}
                onChange={(e) => setTelMere(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-white dark:bg-black text-[#103d34] dark:text-emerald-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1b5e52]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#103d34] dark:text-emerald-200 mb-1.5">
                Nom complet du père
              </label>
              <input
                type="text"
                placeholder="Ex: Jean Ngoma"
                value={nomPere}
                onChange={(e) => setNomPere(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-white dark:bg-black text-[#103d34] dark:text-emerald-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1b5e52]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#103d34] dark:text-emerald-200 mb-1.5">
                Téléphone du père
              </label>
              <input
                type="tel"
                value={telPere}
                onChange={(e) => setTelPere(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-white dark:bg-black text-[#103d34] dark:text-emerald-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1b5e52]"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              Annuler
            </button>
          )}

          <button
            type="submit"
            disabled={envoi}
            className="ml-auto px-6 py-2.5 rounded-xl bg-[#1b5e52] hover:bg-[#144b41] text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-60"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{envoi ? 'Enregistrement…' : 'Enregistrer la naissance'}</span>
          </button>
        </div>
      </form>

      {/* Success Dialog with Parent Code & Printable Options (Ticket 1, 4, 5) */}
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
                  setNom('');
                  setPrenom('');
                  setNomMere('');
                  setNomPere('');
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
              >
                Déclarer un autre enfant
              </button>

              <button
                type="button"
                onClick={() => {
                  setCreatedChild(null);
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
