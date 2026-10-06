import React, { useState } from 'react';
import './confirmation.css';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Syringe,
  ArrowLeft,
  CalendarCheck,
} from 'lucide-react';
import type { Child } from '../../types/dashboard';

export type StatutVaccination = 'a_venir' | 'effectue' | 'en_retard' | 'non_administre';

export interface VaccinationPrevue {
  id: number;
  enfant_id: number;
  enfant_nom?: string;
  enfant_prenom?: string;
  calendrier_id?: number;
  vaccin_nom?: string;
  dose_numero?: number;
  date_prevue: string;
  statut: StatutVaccination;
  date_administration?: string | null;
  updated_at?: string;
}

const JOUR_MS = 24 * 60 * 60 * 1000;
const INSTANT_DE_REFERENCE = Date.now();

const dansXJours = (jours: number) =>
  new Date(INSTANT_DE_REFERENCE + jours * JOUR_MS).toISOString();

const VACCINATIONS_INITIALES: VaccinationPrevue[] = [
  {
    id: 1,
    enfant_id: 1,
    enfant_prenom: 'Moussa',
    enfant_nom: 'Moussana',
    vaccin_nom: 'BCG (Tuberculose)',
    dose_numero: 1,
    date_prevue: dansXJours(-170),
    statut: 'effectue',
    date_administration: dansXJours(-170),
  },
  {
    id: 2,
    enfant_id: 1,
    enfant_prenom: 'Moussa',
    enfant_nom: 'Moussana',
    vaccin_nom: 'VPI (Poliomyélite injectable)',
    dose_numero: 2,
    date_prevue: dansXJours(10),
    statut: 'a_venir',
  },
  {
    id: 3,
    enfant_id: 2,
    enfant_prenom: 'Aminata',
    enfant_nom: 'Diallo',
    vaccin_nom: 'BCG',
    dose_numero: 1,
    date_prevue: dansXJours(2),
    statut: 'a_venir',
  },
  {
    id: 4,
    enfant_id: 2,
    enfant_prenom: 'Aminata',
    enfant_nom: 'Diallo',
    vaccin_nom: 'DTP',
    dose_numero: 1,
    date_prevue: dansXJours(10),
    statut: 'a_venir',
  },
  {
    id: 5,
    enfant_id: 3,
    enfant_prenom: 'Khalil',
    enfant_nom: 'Mba',
    vaccin_nom: 'Polio Oral',
    dose_numero: 1,
    date_prevue: dansXJours(-3),
    statut: 'en_retard',
  },
];

interface ConfirmationStatutVaccinProps {
  childrenList?: Child[];
  onBack?: () => void;
  onNavigateToRdv?: () => void;
  onShowToast?: (msg: string) => void;
}

export const ConfirmationStatutVaccin: React.FC<ConfirmationStatutVaccinProps> = ({
  onBack,
  onNavigateToRdv,
  onShowToast,
}) => {
  const [vaccinations, setVaccinations] =
    useState<VaccinationPrevue[]>(VACCINATIONS_INITIALES);

  const [selectedEnfantId, setSelectedEnfantId] = useState<number | ''>('');

  const enfants = Array.from(
    new Map(
      vaccinations.map((v) => [
        v.enfant_id,
        {
          id: v.enfant_id,
          nom: (v.enfant_prenom || '') + ' ' + (v.enfant_nom || '') || ('Enfant ' + v.enfant_id),
        },
      ])
    ).values()
  );

  const vaccinsFiltres = selectedEnfantId === ''
    ? vaccinations
    : vaccinations.filter((v) => v.enfant_id === Number(selectedEnfantId));

  const getBadgeClass = (statut: StatutVaccination) => {
    const classes: Record<StatutVaccination, string> = {
      a_venir: 'badge badge-a_venir',
      effectue: 'badge badge-effectue',
      en_retard: 'badge badge-en_retard',
      non_administre: 'badge badge-non_administre',
    };
    return classes[statut];
  };

  const getBadgeLabel = (statut: StatutVaccination) => {
    const labels: Record<StatutVaccination, string> = {
      a_venir: 'À venir',
      effectue: 'Administré',
      en_retard: 'En retard',
      non_administre: 'Non administré',
    };
    return labels[statut];
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR');
    } catch {
      return dateStr;
    }
  };

  const marquerAdministre = (id: number) => {
    setVaccinations((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              statut: 'effectue',
              date_administration: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          : v
      )
    );
    if (onShowToast) {
      onShowToast("Statut enregistré : Vaccin administré avec succès. Carnet synchronisé.");
    }
  };

  const marquerNonAdministre = (id: number) => {
    setVaccinations((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              statut: 'non_administre',
              updated_at: new Date().toISOString(),
            }
          : v
      )
    );
    if (onShowToast) {
      onShowToast("Vaccin marqué 'Non administré'. Recommandation de relance transmise.");
    }
  };

  const reinitialiser = (id: number) => {
    setVaccinations((prev) =>
      prev.map((v) => {
        if (v.id !== id) return v;
        const isFuture = new Date(v.date_prevue) > new Date();
        return {
          ...v,
          statut: isFuture ? 'a_venir' : 'en_retard',
          date_administration: null,
          updated_at: new Date().toISOString(),
        };
      })
    );
    if (onShowToast) {
      onShowToast("Statut du vaccin réinitialisé.");
    }
  };

  const nbEffectues = vaccinsFiltres.filter((v) => v.statut === 'effectue').length;
  const nbNonAdministres = vaccinsFiltres.filter((v) => v.statut === 'non_administre').length;
  const nbEnAttente = vaccinsFiltres.filter((v) => v.statut === 'a_venir' || v.statut === 'en_retard').length;

  return (
    <div className="container-confirmation">
      {/* Optional Return Header */}
      {onBack && (
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-white/10">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#134e43] dark:text-emerald-300 hover:text-emerald-500 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-white dark:bg-[#121c19] border border-[#134e43]/15 dark:border-emerald-500/30 flex items-center justify-center">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span>Retour</span>
          </button>
          <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/30">
            Validation Clinique
          </span>
        </div>
      )}

      {/* Header matching user design */}
      <div className="header">
        <div className="header-icon">
          <Syringe className="w-8 h-8" />
        </div>
        <h1>Confirmation du statut d'un vaccin administré</h1>
        <p className="header-subtitle">
          Suivez et mettez à jour le statut vaccinal de chaque enfant en temps réel avec traçabilité médicale certifiée.
        </p>
      </div>

      {/* Filter Section */}
      <section className="form-section">
        <div className="section-header">
          <h2>Filtrer par enfant</h2>
          <p className="section-description">
            Sélectionnez un enfant pour examiner spécifiquement l'état d'avancement de son calendrier vaccinal.
          </p>
        </div>

        <div className="filter-bar">
          <div className="form-group" style={{ maxWidth: '340px' }}>
            <label htmlFor="filtre-enfant">Enfant bénéficiaire</label>
            <select
              id="filtre-enfant"
              value={selectedEnfantId}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedEnfantId(val === '' ? '' : Number(val));
              }}
            >
              <option value="">Tous les enfants ({enfants.length})</option>
              {enfants.map((enf) => (
                <option key={enf.id} value={enf.id}>
                  {enf.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Stats summary pills */}
          <div className="stats-grid">
            <span className="stat-pill total">
              Total : <strong>{vaccinsFiltres.length}</strong>
            </span>
            <span className="stat-pill attente">
              En attente : <strong>{nbEnAttente}</strong>
            </span>
            <span className="stat-pill effectue">
              Administrés : <strong>{nbEffectues}</strong>
            </span>
            <span className="stat-pill non-administre">
              Non administrés : <strong>{nbNonAdministres}</strong>
            </span>
          </div>
        </div>

        <div className="info-box">
          <strong>Suivi par l'agent de maternité & PMI :</strong> Toute confirmation ou signalement du statut
          d'un vaccin est enregistrée et reste visible dans le dossier de l'enfant pour assurer son suivi et les rappels automatiques.
        </div>
      </section>

      {/* List / Table Section */}
      <section className="form-section">
        <div className="section-header">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2>Vaccins prévus - Suivi vaccinal ({vaccinsFiltres.length})</h2>
            {onNavigateToRdv && (
              <button
                onClick={onNavigateToRdv}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#1b5e52] dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-100 cursor-pointer"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Ouvrir les Rendez-vous 24h</span>
              </button>
            )}
          </div>
          <p className="section-description">
            Validez l'administration des doses ou signalez un vaccin non administré pour déclencher les relances nécessaires.
          </p>
        </div>

        {/* Mobile-First Card View (md:hidden) */}
        <div className="md:hidden space-y-3.5">
          {vaccinsFiltres.length === 0 ? (
            <div className="empty-state">
              <p>Aucun vaccin prévu pour ce filtre</p>
            </div>
          ) : (
            vaccinsFiltres.map((v) => (
              <div
                key={v.id}
                className="p-4 rounded-2xl bg-[#f9fcfa] dark:bg-[#121c19] border border-slate-200/80 dark:border-emerald-500/20 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-[#103d34] dark:text-emerald-100">
                      {v.vaccin_nom || 'Vaccin'} {v.dose_numero ? `(Dose ${v.dose_numero})` : ''}
                    </h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">
                      Enfant : {(v.enfant_prenom || v.enfant_nom) ? `${v.enfant_prenom || ''} ${v.enfant_nom || ''}`.trim() : `ID: ${v.enfant_id}`}
                    </span>
                  </div>

                  <span className={getBadgeClass(v.statut)}>{getBadgeLabel(v.statut)}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-200/60 dark:border-white/5">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Date prévue</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {formatDate(v.date_prevue)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Administration / MAJ</span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {v.statut === 'effectue' && v.date_administration
                        ? formatDate(v.date_administration)
                        : v.updated_at
                        ? formatDate(v.updated_at)
                        : 'En attente'}
                    </span>
                  </div>
                </div>

                {/* Mobile Action Buttons */}
                <div className="actions pt-1">
                  {v.statut !== 'effectue' && (
                    <button
                      type="button"
                      className="btn btn-primary flex-1 justify-center"
                      onClick={() => marquerAdministre(v.id)}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Vaccin administré</span>
                    </button>
                  )}
                  {v.statut !== 'non_administre' && v.statut !== 'effectue' && (
                    <button
                      type="button"
                      className="btn btn-danger flex-1 justify-center"
                      onClick={() => marquerNonAdministre(v.id)}
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Non administré</span>
                    </button>
                  )}
                  {(v.statut === 'effectue' || v.statut === 'non_administre') && (
                    <button
                      type="button"
                      className="btn btn-secondary flex-1 justify-center"
                      onClick={() => reinitialiser(v.id)}
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Réinitialiser</span>
                    </button>
                  )}
                </div>

                {v.statut === 'non_administre' && (
                  <div className="info-box warning" style={{ marginTop: '0.5rem' }}>
                    <strong>Action recommandée :</strong> Le vaccin n'a pas été administré.
                    Veuillez prévoir un nouveau rendez-vous ou contacter l'établissement de santé.
                    {onNavigateToRdv && (
                      <button
                        onClick={onNavigateToRdv}
                        className="mt-2 text-xs font-bold underline block text-[#92400e] dark:text-[#fde68a] cursor-pointer"
                      >
                        → Programmer un rendez-vous de rattrapage
                      </button>
                    )}
                  </div>
                )}
                {v.statut === 'effectue' && (
                  <div className="info-box success" style={{ marginTop: '0.5rem' }}>
                    Le statut a bien été enregistré. Il est visible dans le dossier de suivi de
                    l'enfant pour l'agent de maternité.
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View (hidden md:block) */}
        <div className="hidden md:block table-wrapper">
          <table className="table-confirmation">
            <thead>
              <tr>
                <th>Enfant</th>
                <th>Vaccin</th>
                <th>Dose</th>
                <th>Date prévue</th>
                <th>Statut</th>
                <th>Date d'administration / MAJ</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vaccinsFiltres.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-state">
                    Aucun vaccin prévu pour ce filtre
                  </td>
                </tr>
              ) : (
                vaccinsFiltres.map((v) => (
                  <tr key={v.id}>
                    <td>
                      {(v.enfant_prenom || v.enfant_nom)
                        ? `${v.enfant_prenom || ''} ${v.enfant_nom || ''}`.trim()
                        : `ID: ${v.enfant_id}`}
                    </td>
                    <td className="font-semibold text-[#103d34] dark:text-emerald-100">
                      {v.vaccin_nom || '-'}
                    </td>
                    <td>{v.dose_numero ?? '-'}</td>
                    <td>{formatDate(v.date_prevue)}</td>
                    <td>
                      <span className={getBadgeClass(v.statut)}>{getBadgeLabel(v.statut)}</span>
                    </td>
                    <td>
                      {v.statut === 'effectue' && v.date_administration
                        ? formatDate(v.date_administration)
                        : v.updated_at
                        ? formatDate(v.updated_at)
                        : '-'}
                    </td>
                    <td>
                      <div className="actions">
                        {v.statut !== 'effectue' && (
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => marquerAdministre(v.id)}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Vaccin administré</span>
                          </button>
                        )}
                        {v.statut !== 'non_administre' && v.statut !== 'effectue' && (
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => marquerNonAdministre(v.id)}
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Vaccin non administré</span>
                          </button>
                        )}
                        {(v.statut === 'effectue' || v.statut === 'non_administre') && (
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => reinitialiser(v.id)}
                          >
                            <RotateCcw className="w-4 h-4" />
                            <span>Réinitialiser</span>
                          </button>
                        )}
                      </div>
                      {v.statut === 'non_administre' && (
                        <div className="info-box warning" style={{ marginTop: '0.75rem' }}>
                          <strong>Action recommandée :</strong> Le vaccin n'a pas été administré.
                          Veuillez prévoir un nouveau rendez-vous ou contacter l'établissement de santé
                          pour assurer la poursuite du calendrier vaccinal.
                          {onNavigateToRdv && (
                            <button
                              onClick={onNavigateToRdv}
                              className="mt-1 text-xs font-bold underline block text-[#92400e] dark:text-[#fde68a] cursor-pointer"
                            >
                              → Programmer un rendez-vous de rattrapage
                            </button>
                          )}
                        </div>
                      )}
                      {v.statut === 'effectue' && (
                        <div className="info-box success" style={{ marginTop: '0.75rem' }}>
                          Le statut a bien été enregistré. Il est visible dans le dossier de suivi de
                          l'enfant pour l'agent de maternité.
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <small className="footer-note">
          Critères d'acceptation : Vaccin administré ? statut « Administré » enregistré · Vaccin non
          administré ? statut « Non administré » + invitation à prévoir RDV ou contacter l'établissement ·
          Statut visible pour le suivi par l'agent de maternité.
        </small>
      </section>
    </div>
  );
};

export default ConfirmationStatutVaccin;
