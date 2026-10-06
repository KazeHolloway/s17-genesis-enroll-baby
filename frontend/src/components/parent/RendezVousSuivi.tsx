import React, { useState } from 'react';
import './rendezvous.css';
import {
  Bell,
  Plus,
  ArrowLeft,
  CalendarCheck,
} from 'lucide-react';
import type { Child } from '../../types/dashboard';

export type StatutRdv = 'planifie' | 'honore' | 'manque' | 'annule';

export interface RendezVous {
  id: number;
  enfant_id: number;
  enfant_nom?: string;
  enfant_prenom?: string;
  etablissement_id: number;
  etablissement_nom?: string;
  date_rdv: string;
  motif: string;
  statut: StatutRdv;
}

export interface Rappel {
  id: number;
  enfant_id: number;
  enfant_nom?: string;
  type: 'vaccin';
  date_echeance: string;
  date_affichage: string;
  statut: 'a_venir' | 'affiche' | 'lu' | 'clos';
}

interface RendezVousSuiviProps {
  childrenList?: Child[];
  onBack?: () => void;
  onShowToast?: (msg: string) => void;
}

export const RendezVousSuivi: React.FC<RendezVousSuiviProps> = ({
  childrenList = [],
  onBack,
  onShowToast,
}) => {
  // Pre-seed realistic initial appointments
  const [rdvs, setRdvs] = useState<RendezVous[]>([
    {
      id: 1,
      enfant_id: 1,
      enfant_prenom: 'Moussa',
      enfant_nom: 'Moussana',
      etablissement_id: 1,
      etablissement_nom: 'Maternité Blanche Gomez, Brazzaville',
      date_rdv: '2025-10-15T09:30',
      motif: 'Vaccination VPI - 2ème dose & Pesée',
      statut: 'planifie',
    },
    {
      id: 2,
      enfant_id: 2,
      enfant_prenom: 'Awa',
      enfant_nom: 'Kouassi',
      etablissement_id: 2,
      etablissement_nom: 'CSI Ouenze, Brazzaville',
      date_rdv: '2025-10-18T10:00',
      motif: 'Vaccination Pentavalent - 1ère dose',
      statut: 'planifie',
    },
    {
      id: 3,
      enfant_id: 1,
      enfant_prenom: 'Moussa',
      enfant_nom: 'Moussana',
      etablissement_id: 1,
      etablissement_nom: 'Maternité Blanche Gomez, Brazzaville',
      date_rdv: '2025-04-12T08:00',
      motif: 'BCG + Polio 0 (Vaccins de naissance)',
      statut: 'honore',
    },
  ]);

  // Pre-seed 24h reminders
  const [rappels, setRappels] = useState<Rappel[]>([
    {
      id: 1,
      enfant_id: 1,
      enfant_nom: 'Moussa Moussana',
      type: 'vaccin',
      date_echeance: '2025-10-15',
      date_affichage: '2025-10-14',
      statut: 'a_venir',
    },
    {
      id: 2,
      enfant_id: 2,
      enfant_nom: 'Awa Kouassi',
      type: 'vaccin',
      date_echeance: '2025-10-18',
      date_affichage: '2025-10-17',
      statut: 'a_venir',
    },
    {
      id: 3,
      enfant_id: 1,
      enfant_nom: 'Moussa Moussana',
      type: 'vaccin',
      date_echeance: '2025-04-12',
      date_affichage: '2025-04-11',
      statut: 'lu',
    },
  ]);

  const [formData, setFormData] = useState({
    enfant_id: '1',
    etablissement_id: '1',
    date_rdv: '2025-11-05',
    heure_rdv: '09:00',
    motif: 'Vaccination Pentavalent - 2ème dose',
  });

  const etablissementsMap: Record<number, string> = {
    1: 'Maternité Blanche Gomez, Brazzaville',
    2: 'Centre de Santé Intégré Ouenze',
    3: 'PMI Centrale Bacongo',
    4: 'Hôpital Général de Talangaï',
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const heure = formData.heure_rdv || '09:00';
    const dateTime = formData.date_rdv + 'T' + heure;

    const childIdNum = parseInt(formData.enfant_id, 10) || 1;
    const etabIdNum = parseInt(formData.etablissement_id, 10) || 1;

    // Find matched child name if exists
    const matchedChild = childrenList[childIdNum - 1] || childrenList.find((c) => c.id === `child-${childIdNum}`);
    const childPrenom = matchedChild?.prenom || 'Enfant';
    const childNom = matchedChild?.nom || `#${childIdNum}`;
    const etabName = etablissementsMap[etabIdNum] || `Établissement #${etabIdNum}`;

    const nouveauRdv: RendezVous = {
      id: rdvs.length + 1,
      enfant_id: childIdNum,
      enfant_prenom: childPrenom,
      enfant_nom: childNom,
      etablissement_id: etabIdNum,
      etablissement_nom: etabName,
      date_rdv: dateTime,
      motif: formData.motif,
      statut: 'planifie',
    };

    // Calculate 24h prior reminder
    const rdvDateObj = new Date(formData.date_rdv);
    const reminderDateObj = new Date(rdvDateObj);
    reminderDateObj.setDate(reminderDateObj.getDate() - 1);
    const dateAffichageStr = reminderDateObj.toISOString().split('T')[0];

    const nouveauRappel: Rappel = {
      id: rappels.length + 1,
      enfant_id: childIdNum,
      enfant_nom: `${childPrenom} ${childNom}`,
      type: 'vaccin',
      date_echeance: formData.date_rdv,
      date_affichage: dateAffichageStr,
      statut: 'a_venir',
    };

    setRdvs((prev) => [nouveauRdv, ...prev]);
    setRappels((prev) => [nouveauRappel, ...prev]);

    if (onShowToast) {
      onShowToast(`Rendez-vous enregistré ! Rappel SMS automatique programmé pour le ${new Date(dateAffichageStr).toLocaleDateString('fr-FR')} (24h avant).`);
    }

    setFormData({
      enfant_id: '1',
      etablissement_id: '1',
      date_rdv: '',
      heure_rdv: '09:00',
      motif: '',
    });
  };

  const formatDateTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  const getStatutBadge = (statut: StatutRdv) => {
    const classes: Record<StatutRdv, string> = {
      planifie: 'badge badge-planifie',
      honore: 'badge badge-honore',
      manque: 'badge badge-manque',
      annule: 'badge badge-annule',
    };
    const labels: Record<StatutRdv, string> = {
      planifie: 'Planifié',
      honore: 'Honoré',
      manque: 'Manqué',
      annule: 'Annulé',
    };
    return <span className={classes[statut]}>{labels[statut]}</span>;
  };

  const getRappelBadge = (statut: Rappel['statut']) => {
    const classes: Record<Rappel['statut'], string> = {
      a_venir: 'badge badge-rappel-attente',
      affiche: 'badge badge-rappel-attente',
      lu: 'badge badge-rappel-envoye',
      clos: 'badge badge-rappel-annule',
    };
    const labels: Record<Rappel['statut'], string> = {
      a_venir: 'À venir (24h avant)',
      affiche: 'Affiché',
      lu: 'Envoyé / Lu',
      clos: 'Clos',
    };
    return <span className={classes[statut]}>{labels[statut]}</span>;
  };

  const getEnfantNom = (rdv: RendezVous) => {
    if (rdv.enfant_nom || rdv.enfant_prenom) {
      return `${rdv.enfant_prenom || ''} ${rdv.enfant_nom || ''}`.trim();
    }
    return `ID: ${rdv.enfant_id}`;
  };

  return (
    <div className="container-rdv">
      {/* Optional Return Header if navigated from inside another view */}
      {onBack && (
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-white/10">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#134e43] dark:text-emerald-300 hover:text-emerald-500 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-white dark:bg-[#121c19] border border-[#134e43]/15 dark:border-emerald-500/30 flex items-center justify-center">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span>Retour au calendrier</span>
          </button>
          <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/30">
            Module Rendez-vous 24h
          </span>
        </div>
      )}

      {/* Header section matching user design */}
      <div className="header">
        <div className="header-icon">
          <CalendarCheck className="w-8 h-8" />
        </div>
        <h1>Rendez-vous de suivi - Rappels de vaccination</h1>
        <p className="header-subtitle">
          Planifiez les rendez-vous de vaccination et suivez l'envoi des rappels automatiques 24h avant la date prévue pour protéger la santé de chaque enfant.
        </p>
      </div>

      {/* 1. Form Section */}
      <section className="form-section">
        <div className="section-header">
          <h2>Enregistrer un rendez-vous de vaccination</h2>
          <p className="section-description">
            Renseignez les informations du rendez-vous pour permettre le déclenchement automatique du rappel 24 heures avant.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="enfant_id">Enfant bénéficiaire *</label>
              <select
                id="enfant_id"
                name="enfant_id"
                value={formData.enfant_id}
                onChange={handleChange}
                required
              >
                <option value="1">1 - Moussa Moussana</option>
                <option value="2">2 - Awa Kouassi</option>
                <option value="3">3 - David Mampouya</option>
                <option value="4">Autre Enfant (ID personnalisé)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="etablissement_id">Centre / Établissement médical *</label>
              <select
                id="etablissement_id"
                name="etablissement_id"
                value={formData.etablissement_id}
                onChange={handleChange}
                required
              >
                <option value="1">1 - Maternité Blanche Gomez, Brazzaville</option>
                <option value="2">2 - Centre de Santé Intégré Ouenze</option>
                <option value="3">3 - PMI Centrale Bacongo</option>
                <option value="4">4 - Hôpital Général de Talangaï</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date_rdv">Date du rendez-vous *</label>
              <input
                type="date"
                id="date_rdv"
                name="date_rdv"
                value={formData.date_rdv}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="heure_rdv">Heure du rendez-vous *</label>
              <input
                type="time"
                id="heure_rdv"
                name="heure_rdv"
                value={formData.heure_rdv}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group span-2">
              <label htmlFor="motif">Motif de la consultation / Vaccin prévu *</label>
              <textarea
                id="motif"
                name="motif"
                value={formData.motif}
                onChange={handleChange}
                required
                placeholder="Ex: Vaccination Pentavalent 2ème dose + pesée"
              />
            </div>
          </div>

          <div className="actions-row">
            <button type="submit" className="btn-primary">
              <span className="inline-flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>Enregistrer le rendez-vous</span>
              </span>
            </button>

            <span className="text-xs text-slate-500 dark:text-slate-400">
              * Génère immédiatement le rappel SMS 24h avant l'échéance.
            </span>
          </div>
        </form>
      </section>

      {/* 2. Rendez-vous List Section */}
      <section className="form-section">
        <div className="section-header">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2>Liste des rendez-vous ({rdvs.length})</h2>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              {rdvs.filter((r) => r.statut === 'planifie').length} à venir
            </span>
          </div>
          <p className="section-description">
            Vue synthétique des rendez-vous planifiés, honorés, manqués ou annulés.
          </p>
        </div>

        {/* Mobile Cards (md:hidden) */}
        <div className="md:hidden space-y-3">
          {rdvs.length === 0 ? (
            <div className="empty-state">
              <p>Aucun rendez-vous enregistré</p>
            </div>
          ) : (
            rdvs.map((rdv) => (
              <div
                key={rdv.id}
                className="p-3.5 rounded-2xl bg-[#f9fcfa] dark:bg-[#121c19] border border-slate-200/80 dark:border-emerald-500/20 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-[#103d34] dark:text-emerald-100">
                      {getEnfantNom(rdv)}
                    </h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">
                      {rdv.motif}
                    </span>
                  </div>
                  {getStatutBadge(rdv.statut)}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-200/60 dark:border-white/5">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Date & Heure</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {formatDateTime(rdv.date_rdv)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Établissement</span>
                    <span className="text-slate-700 dark:text-slate-300 truncate block">
                      {rdv.etablissement_nom || `ID: ${rdv.etablissement_id}`}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table (hidden md:block) */}
        <div className="hidden md:block table-wrapper">
          <table className="table-rdv">
            <thead>
              <tr>
                <th>ID</th>
                <th>Enfant</th>
                <th>Établissement</th>
                <th>Date et heure</th>
                <th>Motif</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {rdvs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-state">
                    Aucun rendez-vous enregistré
                  </td>
                </tr>
              ) : (
                rdvs.map((rdv) => (
                  <tr key={rdv.id}>
                    <td className="font-mono text-xs">{rdv.id}</td>
                    <td className="font-semibold text-[#103d34] dark:text-emerald-100">
                      {getEnfantNom(rdv)}
                    </td>
                    <td>{rdv.etablissement_nom || `ID: ${rdv.etablissement_id}`}</td>
                    <td>{formatDateTime(rdv.date_rdv)}</td>
                    <td>{rdv.motif}</td>
                    <td>{getStatutBadge(rdv.statut)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <small className="footer-note">
          * Le rappel automatique est déclenché 24 heures avant la date prévue du rendez-vous par notification et SMS.
        </small>
      </section>

      {/* 3. Rappels programmés Section */}
      <section className="form-section">
        <div className="section-header">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2>Rappels programmés (Déclenchement 24h avant)</h2>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
              <Bell className="w-4 h-4 text-emerald-500" />
              <span>Système actif</span>
            </div>
          </div>
          <p className="section-description">
            Automatisation des relances SMS et notifications aux familles 24h avant chaque vaccination.
          </p>
        </div>

        {/* Mobile View: Rappels Cards (md:hidden) */}
        <div className="md:hidden space-y-3">
          {rappels.length === 0 ? (
            <div className="empty-state">
              <p>Aucun rappel programmé pour le moment</p>
            </div>
          ) : (
            rappels.map((rappel) => (
              <div
                key={rappel.id}
                className="p-3.5 rounded-2xl bg-[#f9fcfa] dark:bg-[#121c19] border border-slate-200/80 dark:border-emerald-500/20 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-bold text-[#103d34] dark:text-emerald-100">
                    {rappel.enfant_nom || `Enfant ID: ${rappel.enfant_id}`}
                  </strong>
                  {getRappelBadge(rappel.statut)}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-200/60 dark:border-white/5">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Date d'échéance RDV</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {new Date(rappel.date_echeance).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Date d'envoi rappel (-24h)</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      {new Date(rappel.date_affichage).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table (hidden md:block) */}
        <div className="hidden md:block table-wrapper">
          <table className="table-rdv">
            <thead>
              <tr>
                <th>ID</th>
                <th>Enfant</th>
                <th>Type</th>
                <th>Date d'échéance RDV</th>
                <th>Date d'affichage (Rappel 24h)</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {rappels.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-state">
                    Aucun rappel programmé pour le moment
                  </td>
                </tr>
              ) : (
                rappels.map((rappel) => (
                  <tr key={rappel.id}>
                    <td className="font-mono text-xs">{rappel.id}</td>
                    <td className="font-semibold text-[#103d34] dark:text-emerald-100">
                      {rappel.enfant_nom || `ID: ${rappel.enfant_id}`}
                    </td>
                    <td>Vaccination PEV</td>
                    <td>{new Date(rappel.date_echeance).toLocaleDateString('fr-FR')}</td>
                    <td className="font-semibold text-emerald-700 dark:text-emerald-300">
                      {new Date(rappel.date_affichage).toLocaleDateString('fr-FR')}
                    </td>
                    <td>{getRappelBadge(rappel.statut)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default RendezVousSuivi;
