import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, ArrowRight, ArrowLeft, Baby, Users, ShieldCheck, Sparkles, KeyRound, Copy, Printer, FileText } from 'lucide-react';
import type { Child, ChildGender } from '../../types/dashboard';
import { PrintableChildDossierModal } from '../PrintableChildDossierModal';
import { PrintableDeclarationModal } from '../PrintableDeclarationModal';

interface ChildRegisterWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newChild: Child) => void;
}

export const ChildRegisterWizard: React.FC<ChildRegisterWizardProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [createdChild, setCreatedChild] = useState<Child | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showPrintDossier, setShowPrintDossier] = useState(false);
  const [showPrintDeclaration, setShowPrintDeclaration] = useState(false);

  // Step 1: Enfant
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [dateNaissance, setDateNaissance] = useState('2026-10-01');
  const [heureNaissance] = useState('06:30');
  const [poids, setPoids] = useState('3.4');
  const [taille, setTaille] = useState('50');
  const [sexe, setSexe] = useState<ChildGender>('Garçon');
  const [lieuNaissance, setLieuNaissance] = useState('Maternité Blanche Gomez, Brazzaville');

  // Step 2: Parents
  const [nomMere, setNomMere] = useState('Awa Moussana');
  const [telMere, setTelMere] = useState('+242 06 12 34 56');
  const [nomPere, setNomPere] = useState('Charles Moussana');
  const [telPere, setTelPere] = useState('+242 05 98 76 54');

  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleNextFromStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim() || !prenom.trim() || !lieuNaissance.trim()) {
      setErrorMsg('Veuillez renseigner le nom, prénom et lieu de naissance.');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handleNextFromStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomMere.trim() || !telMere.trim()) {
      setErrorMsg('Veuillez renseigner les coordonnées de la mère.');
      return;
    }
    setErrorMsg('');
    setStep(3);
  };

  const handleFinalSubmit = () => {
    const formattedDate = dateNaissance
      ? new Date(dateNaissance).toLocaleDateString('fr-FR')
      : '01/10/2026';

    const codeGen = `${(nom.trim().slice(0, 3) || 'PAR').toUpperCase()}-${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 90)}`;

    const newChild: Child = {
      id: `child-${Date.now()}`,
      nom: nom.trim(),
      prenom: prenom.trim(),
      dateNaissance: formattedDate,
      heureNaissance: heureNaissance || '08:00',
      poids: `${poids} kg`,
      taille: `${taille} cm`,
      sexe,
      lieuNaissance: lieuNaissance.trim(),
      photoUrl: '/src/assets/images/baby_moussa_avatar_1791208716424.jpg',
      status: 'en_cours',
      referenceMaternite: `MAT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      codeAccesParent: codeGen,
      delaiDeclarationJours: 30,
      numeroActe: 'Déclaration transmise',
      mere: {
        nom: nomMere.trim(),
        telephone: telMere.trim(),
      },
      pere: {
        nom: nomPere.trim() || 'Non spécifié',
        telephone: telPere.trim() || 'Non spécifié',
      },
      prochaineVaccination: {
        date: 'À planifier',
        nom: 'BCG + Polio 0',
        joursRestants: 7,
      },
      etapes: [
        { titre: 'Informations enfant renseignées', date: 'Aujourd’hui', complete: true },
        { titre: 'Fiche transmise à la maternité', date: 'Aujourd’hui', complete: true },
        { titre: 'Validation par la sage-femme', date: 'En attente', complete: false },
        { titre: 'Émission de l’acte d’état civil', date: 'Sous 30 jours', complete: false },
      ],
    };

    setCreatedChild(newChild);
    onSuccess(newChild);
    setStep(4);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-2xl border border-[#134e43]/20 dark:border-emerald-500/30 overflow-hidden flex flex-col transition-colors">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#12493e] to-[#0f3d34] dark:from-black dark:to-[#0a1815] text-white flex items-center justify-between border-b border-transparent dark:border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300">
              <Baby className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Créer le compte de votre enfant
              </h3>
              <p className="text-xs text-emerald-200/80">
                Enroll Baby · Enregistrement du nouveau-né
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Stepper: Compact on mobile (<sm), full on desktop (sm+) */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-[#f8faf7] dark:bg-black border-b border-slate-200 dark:border-white/10">
          {/* Mobile compact stepper (<sm) */}
          <div className="sm:hidden space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-emerald-700 dark:text-emerald-400 font-mono">
                Étape {step} / 3
              </span>
              <span className="text-[#103d34] dark:text-emerald-200">
                {step === 1 && 'Informations nouveau-né'}
                {step === 2 && 'Coordonnées des parents'}
                {step === 3 && 'Vérification & Validation'}
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1b5e52] dark:bg-emerald-400 transition-all duration-300 rounded-full"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Desktop Stepper (sm+) */}
          <div className="hidden sm:flex items-center justify-between text-xs sm:text-sm font-medium">
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === 1
                    ? 'bg-[#1b5e52] dark:bg-emerald-400 text-white dark:text-black shadow-xs'
                    : step > 1
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-[#1b5e52] dark:text-emerald-300'
                    : 'bg-slate-200 dark:bg-white/10 text-slate-500'
                }`}
              >
                {step > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
              </span>
              <span className={step === 1 ? 'font-bold text-[#103d34] dark:text-emerald-200' : 'text-slate-500 dark:text-slate-400'}>
                Informations enfant
              </span>
            </div>

            <div className="w-8 sm:w-12 h-px bg-slate-200 dark:bg-white/10" />

            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === 2
                    ? 'bg-[#1b5e52] dark:bg-emerald-400 text-white dark:text-black shadow-xs'
                    : step > 2
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-[#1b5e52] dark:text-emerald-300'
                    : 'bg-slate-200 dark:bg-white/10 text-slate-500'
                }`}
              >
                {step > 2 ? <Check className="w-3.5 h-3.5" /> : '2'}
              </span>
              <span className={step === 2 ? 'font-bold text-[#103d34] dark:text-emerald-200' : 'text-slate-500 dark:text-slate-400'}>
                Parents
              </span>
            </div>

            <div className="w-8 sm:w-12 h-px bg-slate-200 dark:bg-white/10" />

            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === 3
                    ? 'bg-[#1b5e52] dark:bg-emerald-400 text-white dark:text-black shadow-xs'
                    : 'bg-slate-200 dark:bg-white/10 text-slate-500'
                }`}
              >
                3
              </span>
              <span className={step === 3 ? 'font-bold text-[#103d34] dark:text-emerald-200' : 'text-slate-500 dark:text-slate-400'}>
                Vérification
              </span>
            </div>
          </div>
        </div>

        {/* Wizard Form Area */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs font-medium border border-red-200 dark:border-red-900/50">
              {errorMsg}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form
                key="step-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleNextFromStep1}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#103d34] dark:text-emerald-200 mb-1.5">
                      Nom de famille de l'enfant *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Moussana"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-white dark:bg-black text-[#103d34] dark:text-emerald-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1b5e52] dark:focus:ring-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#103d34] dark:text-emerald-200 mb-1.5">
                      Prénom de l'enfant *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Moussa"
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-white dark:bg-black text-[#103d34] dark:text-emerald-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1b5e52] dark:focus:ring-emerald-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#103d34] dark:text-emerald-200 mb-1.5">
                      Date de naissance *
                    </label>
                    <input
                      type="date"
                      required
                      value={dateNaissance}
                      onChange={(e) => setDateNaissance(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-white dark:bg-black text-[#103d34] dark:text-emerald-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1b5e52] dark:focus:ring-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#103d34] dark:text-emerald-200 mb-1.5">
                      Sexe *
                    </label>
                    <div className="flex items-center gap-6 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer text-sm text-[#103d34] dark:text-emerald-100">
                        <input
                          type="radio"
                          name="sexe"
                          value="Garçon"
                          checked={sexe === 'Garçon'}
                          onChange={() => setSexe('Garçon')}
                          className="w-4 h-4 text-[#1b5e52] focus:ring-[#1b5e52]"
                        />
                        <span>Garçon</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-sm text-[#103d34] dark:text-emerald-100">
                        <input
                          type="radio"
                          name="sexe"
                          value="Fille"
                          checked={sexe === 'Fille'}
                          onChange={() => setSexe('Fille')}
                          className="w-4 h-4 text-[#1b5e52] focus:ring-[#1b5e52]"
                        />
                        <span>Fille</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#103d34] dark:text-emerald-200 mb-1.5">
                      Poids à la naissance (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={poids}
                      onChange={(e) => setPoids(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-white dark:bg-black text-[#103d34] dark:text-emerald-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1b5e52]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#103d34] dark:text-emerald-200 mb-1.5">
                      Taille (cm)
                    </label>
                    <input
                      type="number"
                      value={taille}
                      onChange={(e) => setTaille(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-white dark:bg-black text-[#103d34] dark:text-emerald-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1b5e52]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#103d34] dark:text-emerald-200 mb-1.5">
                    Lieu de naissance *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Maternité Blanche Gomez, Brazzaville"
                    value={lieuNaissance}
                    onChange={(e) => setLieuNaissance(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-white dark:bg-black text-[#103d34] dark:text-emerald-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1b5e52] dark:focus:ring-emerald-400"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#1b5e52] hover:bg-[#144b41] text-white text-sm font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <span>Suivant</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form
                key="step-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleNextFromStep2}
                className="space-y-4"
              >
                <div className="p-3.5 rounded-2xl bg-[#ebf5f0] dark:bg-[#121c19] border border-[#134e43]/20 dark:border-emerald-500/30 flex items-center gap-2 text-xs text-[#134e43] dark:text-emerald-200">
                  <Users className="w-4 h-4 flex-shrink-0" />
                  <span>Ces coordonnées permettent l'envoi des rappels et de l'acte d'état civil.</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#103d34] dark:text-emerald-200 mb-1.5">
                      Nom complet de la mère *
                    </label>
                    <input
                      type="text"
                      required
                      value={nomMere}
                      onChange={(e) => setNomMere(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-white dark:bg-black text-[#103d34] dark:text-emerald-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1b5e52]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#103d34] dark:text-emerald-200 mb-1.5">
                      Téléphone de la mère *
                    </label>
                    <input
                      type="tel"
                      required
                      value={telMere}
                      onChange={(e) => setTelMere(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-white dark:bg-black text-[#103d34] dark:text-emerald-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1b5e52]"
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
                      value={nomPere}
                      onChange={(e) => setNomPere(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-white dark:bg-black text-[#103d34] dark:text-emerald-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1b5e52]"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-white dark:bg-black text-[#103d34] dark:text-emerald-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1b5e52]"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 text-xs font-semibold text-[#134e43] dark:text-emerald-300 hover:underline flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Retour</span>
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#1b5e52] hover:bg-[#144b41] text-white text-sm font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <span>Vérification</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.form>
            )}

            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div className="p-4 rounded-2xl bg-white dark:bg-[#121c19] border border-[#134e43]/15 dark:border-emerald-500/30 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10">
                    <span className="text-xs uppercase font-mono text-[#1b7e5c] dark:text-emerald-400">
                      Récapitulatif Enfant
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      Nouveau dossier
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Nom complet</span>
                      <strong className="text-[#103d34] dark:text-emerald-100 font-semibold">
                        {prenom} {nom} ({sexe})
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Naissance</span>
                      <strong className="text-[#103d34] dark:text-emerald-100 font-semibold">
                        {dateNaissance} à {heureNaissance}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Constantes</span>
                      <strong className="text-[#103d34] dark:text-emerald-100 font-semibold">
                        {poids} kg · {taille} cm
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Lieu de naissance</span>
                      <strong className="text-[#103d34] dark:text-emerald-100 font-semibold">
                        {lieuNaissance}
                      </strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-white/10 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Mère</span>
                      <strong className="text-[#103d34] dark:text-emerald-100">{nomMere} ({telMere})</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Père</span>
                      <strong className="text-[#103d34] dark:text-emerald-100">{nomPere} ({telPere})</strong>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#ebf5f0] dark:bg-black border border-[#134e43]/20 dark:border-emerald-500/30 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <p className="text-xs text-[#294d43] dark:text-emerald-200">
                    En validant, un identifiant provisoire unique sera attribué et synchronisé avec la maternité.
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2 text-xs font-semibold text-[#134e43] dark:text-emerald-300 hover:underline flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Modifier</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    className="px-6 py-2.5 rounded-xl bg-[#1b5e52] hover:bg-[#144b41] dark:bg-emerald-500 dark:text-black dark:hover:bg-emerald-400 text-white text-sm font-bold flex items-center gap-2 shadow-md cursor-pointer transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Confirmer & Enregistrer</span>
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && createdChild && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-5 text-center"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                  <Check className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-[#103d34] dark:text-[#f0fdf9]">
                    Dossier créé avec succès !
                  </h3>
                  <p className="text-xs text-[#526f67] dark:text-emerald-200/70">
                    Le dossier de {createdChild.prenom} {createdChild.nom} est maintenant enregistré.
                  </p>
                </div>

                {/* Parent Access Code Display matching Ticket 1 Criteria */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#ebf5f0] dark:bg-[#121c19] border-2 border-emerald-500/40 text-center space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-emerald-600" />
                    <span>Code d'accès unique parent généré</span>
                  </span>
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
                      title="Copier le code d'accès"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedCode ? 'Copié !' : 'Copier'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-emerald-200/80 leading-relaxed max-w-md mx-auto">
                    Conservez précieusement ce code : il permet d'accéder directement au dossier et aux prochaines échéances de l'enfant depuis la page d'accueil (onglet "Code Parent").
                  </p>
                </div>

                {/* Printable Options for Paper Pathway (Ticket 4 & 5) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  <button
                    type="button"
                    onClick={() => setShowPrintDeclaration(true)}
                    className="p-3.5 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-white/10 hover:border-emerald-500/40 transition-colors flex items-center gap-3 cursor-pointer group shadow-2xs"
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="text-xs text-[#103d34] dark:text-emerald-100 block">Déclaration imprimable</strong>
                      <span className="text-[10px] text-slate-400">Pour l'État Civil (Délai 30j)</span>
                    </div>
                  </button>

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
                      <span className="text-[10px] text-slate-400">Pour parents sans smartphone</span>
                    </div>
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-3 rounded-xl bg-[#1b5e52] hover:bg-[#144b41] text-white text-xs sm:text-sm font-bold shadow-md cursor-pointer transition-colors"
                  >
                    Fermer et voir le dossier
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Printable Modals for Ticket 4 & Ticket 5 */}
      {showPrintDossier && createdChild && (
        <PrintableChildDossierModal
          isOpen={showPrintDossier}
          onClose={() => setShowPrintDossier(false)}
          child={createdChild}
        />
      )}
      {showPrintDeclaration && createdChild && (
        <PrintableDeclarationModal
          isOpen={showPrintDeclaration}
          onClose={() => setShowPrintDeclaration(false)}
          child={createdChild}
        />
      )}
    </div>
  );
};
