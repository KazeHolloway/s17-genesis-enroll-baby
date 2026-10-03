import { useState } from 'react';
import './confirmation.css';

type StatutVaccination = 'a_venir' | 'effectue' | 'en_retard' | 'non_administre';

interface VaccinationPrevue {
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

const ConfirmationStatutVaccin = () => {
  const [vaccinations, setVaccinations] = useState<VaccinationPrevue[]>([
    {
      id: 1,
      enfant_id: 1,
      enfant_prenom: 'Aminata',
      enfant_nom: 'Diallo',
      vaccin_nom: 'BCG',
      dose_numero: 1,
      date_prevue: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      statut: 'a_venir',
    },
    {
      id: 2,
      enfant_id: 1,
      enfant_prenom: 'Aminata',
      enfant_nom: 'Diallo',
      vaccin_nom: 'DTP',
      dose_numero: 1,
      date_prevue: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      statut: 'a_venir',
    },
    {
      id: 3,
      enfant_id: 2,
      enfant_prenom: 'Khalil',
      enfant_nom: 'Mba',
      vaccin_nom: 'Polio',
      dose_numero: 1,
      date_prevue: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      statut: 'en_retard',
    },
  ]);

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
    return new Date(dateStr).toLocaleDateString('fr-FR');
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
  };

  const nbEffectues = vaccinsFiltres.filter((v) => v.statut === 'effectue').length;
  const nbNonAdministres = vaccinsFiltres.filter((v) => v.statut === 'non_administre').length;
  const nbEnAttente = vaccinsFiltres.filter((v) => v.statut === 'a_venir' || v.statut === 'en_retard').length;

  return (
    <div className="container-confirmation">
      <div className="header"><h1>Confirmation du statut d'un vaccin administré</h1><p className="header-subtitle">Suivez et mettez à jour le statut vaccinal.</p></div>

      <section className="form-section">
        <h2>Filtrer par enfant</h2>
        <div className="form-group" style={{ maxWidth: '320px' }}>
          <label htmlFor="filtre-enfant">Enfant</label>
          <select
            id="filtre-enfant"
            value={selectedEnfantId}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedEnfantId(val === '' ? '' : Number(val));
            }}
            style={{
              padding: '0.6rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.98rem',
            }}
          >
            <option value="">Tous les enfants</option>
            {enfants.map((enf) => (
              <option key={enf.id} value={enf.id}>
                {enf.nom}
              </option>
            ))}
          </select>
        </div>

        <div className="info-box">
          <strong>Suivi par l'agent de maternité :</strong> Toute confirmation ou signalement du statut
          d'un vaccin est enregistrée et reste visible dans le dossier de l'enfant pour assurer son suivi.
        </div>
      </section>

      <section className="form-section">
        <h2>Vaccins prévus - Suivi vaccinal</h2>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem' }}>
          <span className="muted">
            Total : <strong>{vaccinsFiltres.length}</strong>
          </span>
          <span className="muted">
            En attente : <strong>{nbEnAttente}</strong>
          </span>
          <span className="muted">
            Administrés : <strong>{nbEffectues}</strong>
          </span>
          <span className="muted">
            Non administrés : <strong>{nbNonAdministres}</strong>
          </span>
        </div>

        <div className="table-wrapper">
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
                        ? ((v.enfant_prenom || '') + ' ' + (v.enfant_nom || '')).trim()
                        : ('ID: ' + v.enfant_id)}
                    </td>
                    <td>{v.vaccin_nom || '-'}</td>
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
                            Vaccin administré
                          </button>
                        )}
                        {v.statut !== 'non_administre' && v.statut !== 'effectue' && (
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => marquerNonAdministre(v.id)}
                          >
                            Vaccin non administré
                          </button>
                        )}
                        {(v.statut === 'effectue' || v.statut === 'non_administre') && (
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => reinitialiser(v.id)}
                          >
                            Réinitialiser le statut
                          </button>
                        )}
                      </div>
                      {v.statut === 'non_administre' && (
                        <div className="info-box warning" style={{ marginTop: '0.75rem' }}>
                          <strong>Action recommandée :</strong> Le vaccin n'a pas été administré.
                          Veuillez prévoir un nouveau rendez-vous ou contacter l'établissement de santé
                          pour assurer la poursuite du calendrier vaccinal.
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

        <small className="muted" style={{ display: 'block', marginTop: '0.75rem' }}>
          Critères d'acceptation : Vaccin administré ? statut « Administré » enregistré  Vaccin non
          administré ? statut « Non administré » + invitation à prévoir RDV ou contacter l'établissement 
          Statut visible pour le suivi par l'agent de maternité.
        </small>
      </section>
    </div>
  );
};

export default ConfirmationStatutVaccin;
