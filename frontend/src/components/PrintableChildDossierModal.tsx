import React from 'react';
import { X, Printer, ShieldCheck, Syringe, Calendar } from 'lucide-react';
import type { Child, VaccineItem } from '../types/dashboard';

interface PrintableChildDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  child: Child;
  vaccines?: VaccineItem[];
}

export const PrintableChildDossierModal: React.FC<PrintableChildDossierModalProps> = ({
  isOpen,
  onClose,
  child,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const codeAcces = child.codeAccesParent || 'MOU-2025-88';

  const pevSchedule = [
    { dose: 'BCG (Tuberculose)', moment: 'À la naissance', voie: 'Intradermique', prevue: child.dateNaissance, statut: 'Fait à la maternité' },
    { dose: 'Polio 0 (VPO)', moment: 'À la naissance', voie: 'Orale (2 gouttes)', prevue: child.dateNaissance, statut: 'Fait à la maternité' },
    { dose: 'Penta 1 + VPO 1 + PCV 1 + Rota 1', moment: '6 semaines', voie: 'IM + Orale', prevue: '24 mai 2025', statut: 'À faire en CSI / PMI' },
    { dose: 'Penta 2 + VPO 2 + PCV 2 + Rota 2', moment: '10 semaines', voie: 'IM + Orale', prevue: '21 juin 2025', statut: 'À faire en CSI / PMI' },
    { dose: 'Penta 3 + VPI + PCV 3', moment: '14 semaines', voie: 'IM (injectable)', prevue: '15 oct. 2025', statut: 'À faire en CSI / PMI' },
    { dose: 'Vitamine A + Déparasitage', moment: '6 mois', voie: 'Orale', prevue: '12 nov. 2025', statut: 'À faire en CSI / PMI' },
    { dose: 'Rougeole (VAR 1) + Fièvre Jaune (VAA)', moment: '9 mois', voie: 'Sous-cutanée', prevue: '14 jan. 2026', statut: 'À faire en CSI / PMI' },
    { dose: 'MénA + Rappel Rougeole (VAR 2)', moment: '15-18 mois', voie: 'IM', prevue: 'Octobre 2026', statut: 'À faire en CSI / PMI' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#0c0c0c] text-[#111827] dark:text-[#f3f4f6] rounded-3xl shadow-2xl border border-slate-200 dark:border-emerald-500/30 overflow-hidden flex flex-col my-auto max-h-[96vh]">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="p-4 sm:p-5 bg-[#123830] text-white flex items-center justify-between gap-3 border-b border-emerald-500/20 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold">
                Dossier de Santé Imprimé & Carnet Papier Autonome
              </h3>
              <p className="text-xs text-emerald-200/80">
                Parcours papier pour parents sans smartphone · Consultation et tampons hors-ligne
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Lancer l'impression"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer le dossier complet</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Physical Dossier Content */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-8 print:p-0 print:m-0 print:overflow-visible">
          
          {/* PAGE 1: Identity & Civil Status */}
          <div className="p-6 sm:p-8 rounded-2xl border-2 border-slate-300 dark:border-white/15 bg-white dark:bg-[#0a0a0a] space-y-6 shadow-sm print:border-black print:shadow-none print:break-after-page">
            
            {/* Header */}
            <div className="border-b-2 border-[#123830] dark:border-emerald-500/30 pb-4 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-700 dark:text-emerald-400 block">
                  PROGRAMME NATIONAL DE SANTÉ DU NOUVEAU-NÉ
                </span>
                <h1 className="text-2xl font-bold font-serif text-[#123830] dark:text-emerald-200">
                  CARNET DE SANTÉ DU NOUVEAU-NÉ
                </h1>
                <p className="text-xs text-slate-500">
                  Dossier physique officiel délivré à la naissance · Conservé par la famille
                </p>
              </div>

              {/* Access Code Box for Offline Parents */}
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border-2 border-emerald-600/40 text-center min-w-[150px]">
                <span className="text-[9px] uppercase font-bold text-slate-500 block">Code d'accès parent</span>
                <span className="text-base font-mono font-bold text-[#123830] dark:text-emerald-300 block">{codeAcces}</span>
                <span className="text-[9px] text-slate-400">À conserver précieusement</span>
              </div>
            </div>

            {/* Offline Use Notice for parents without phone */}
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800/40 text-xs text-[#134e43] dark:text-emerald-200 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Notice d'utilisation sans smartphone ni connexion internet :</strong>
                <p className="text-[11px] mt-0.5 text-slate-600 dark:text-emerald-300/80">
                  Ce document papier fait foi auprès de tous les centres de santé (CSI), dispensaires et mairies. Présentez-le à chaque consultation pour que l'agent de santé y appose son cachet et sa signature.
                </p>
              </div>
            </div>

            {/* Child Data */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 dark:bg-white/5 p-4 rounded-xl">
              <div>
                <span className="text-slate-400 block text-[10px]">Nom de l’enfant</span>
                <strong className="text-sm uppercase text-slate-800 dark:text-white">{child.nom}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Prénom</span>
                <strong className="text-sm text-slate-800 dark:text-white">{child.prenom}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Sexe</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{child.sexe}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Date & Heure de naissance</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{child.dateNaissance} à {child.heureNaissance || '08:24'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Poids & Taille</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{child.poids} · {child.taille}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Maternité de naissance</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{child.lieuNaissance}</span>
              </div>
            </div>

            {/* Parents Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 border rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Mère de l'enfant</span>
                <p className="font-bold">{child.mere.nom}</p>
                <p className="text-slate-500 text-[11px]">Téléphone : {child.mere.telephone}</p>
                <p className="text-slate-500 text-[11px]">Profession : {child.mere.profession || 'Enseignante'}</p>
              </div>
              <div className="p-3 border rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Père de l'enfant</span>
                <p className="font-bold">{child.pere.nom}</p>
                <p className="text-slate-500 text-[11px]">Téléphone : {child.pere.telephone}</p>
                <p className="text-slate-500 text-[11px]">Profession : {child.pere.profession || 'Comptable'}</p>
              </div>
            </div>

            {/* Section 3: Legal Civil Status deadline (<30 days) */}
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-900/40 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span>DÉMARCHE IMPÉRATIVE : Déclaration en Mairie sous 30 jours</span>
                </h4>
                <span className="font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900 text-[10px]">
                  Délai légal obligatoire
                </span>
              </div>
              <p className="text-[11px] text-amber-800 dark:text-amber-300">
                Vous devez présenter la <strong>Déclaration de Naissance</strong> remise par la maternité ainsi que vos pièces d'identité à la mairie de votre arrondissement avant l'échéance des 30 jours pour obtenir gratuitement l'acte d'état civil de votre enfant.
              </p>
              <div className="flex items-center gap-4 pt-1 font-mono text-[11px]">
                <span>N° Référence Maternité : <strong>{child.referenceMaternite}</strong></span>
                <span>N° Acte Officiel : <strong>{child.numeroActe || 'À compléter par l’officier'}</strong></span>
              </div>
            </div>
          </div>

          {/* PAGE 2: Complete PEV Vaccination Chart for Stamps & Signatures */}
          <div className="p-6 sm:p-8 rounded-2xl border-2 border-slate-300 dark:border-white/15 bg-white dark:bg-[#0a0a0a] space-y-4 shadow-sm print:border-black print:shadow-none">
            <div className="border-b pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold font-serif text-[#123830] dark:text-emerald-200 flex items-center gap-2">
                  <Syringe className="w-5 h-5 text-emerald-600" />
                  <span>CALENDRIER VACCINAL COMPLET DU PROGRAMME ÉLARGI (PEV)</span>
                </h2>
                <p className="text-xs text-slate-500">
                  À faire tamponner et signer par le professionnel de santé à chaque injection
                </p>
              </div>
            </div>

            {/* Printable Vaccination Table */}
            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-white/10 border-b text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase">
                    <th className="p-2.5">Vaccin & Doses</th>
                    <th className="p-2.5">Âge cible</th>
                    <th className="p-2.5">Voie</th>
                    <th className="p-2.5">Date effectuée</th>
                    <th className="p-2.5">N° de Lot</th>
                    <th className="p-2.5 text-center">Tampon / Signature de l'agent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                  {pevSchedule.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/5">
                      <td className="p-2.5 font-bold text-slate-800 dark:text-white">{item.dose}</td>
                      <td className="p-2.5">{item.moment}</td>
                      <td className="p-2.5 text-slate-500">{item.voie}</td>
                      <td className="p-2.5 font-mono text-[11px]">
                        {idx < 2 ? item.prevue : '_____ / _____ / 202___'}
                      </td>
                      <td className="p-2.5 font-mono text-[11px]">
                        {idx === 0 ? 'BCG-2025-A18' : idx === 1 ? 'VPO-884-BZV' : '________________'}
                      </td>
                      <td className="p-2.5 text-center">
                        {idx < 2 ? (
                          <div className="inline-block p-1 border border-emerald-500/50 rounded text-[9px] font-bold text-emerald-700 bg-emerald-50">
                            ✓ Tampon Maternité
                          </div>
                        ) : (
                          <div className="h-8 border-b border-dashed border-slate-300 w-28 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Emergency & Health Guidelines */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 space-y-1">
                <span className="font-bold text-slate-700 dark:text-slate-200 block text-[11px]">
                  Signes d'alerte néonatale (Consulter d'urgence) :
                </span>
                <p className="text-[11px] text-slate-500 leading-snug">
                  • Fièvre (&gt; 38°C) ou bébé anormalement froid · Refus de téter · Respiration très rapide ou difficile · Convulsions · Ictère sévère (jaunisse).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 space-y-1">
                <span className="font-bold text-slate-700 dark:text-slate-200 block text-[11px]">
                  Contacts & Établissement de rattachement :
                </span>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Maternité Blanche Gomez : <strong>+242 06 600 00 00</strong><br />
                  SAMU National : <strong>15</strong> · Urgences Pédiatriques CHU : <strong>+242 05 500 00 00</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-slate-50 dark:bg-black/50 border-t border-slate-200 dark:border-white/10 flex items-center justify-between print:hidden">
          <p className="text-xs text-slate-500">
            Dossier imprimable haute-résolution · Format A4 standard (2 pages)
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-white/20 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Fermer
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1b5e52] hover:bg-[#144b41] text-white flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer le carnet papier complet</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
