import { useState } from 'react';
import './rendezvous.css';

type StatutRdv = 'planifie' | 'honore' | 'manque' | 'annule';

interface RendezVous {
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

interface Rappel {
  id: number;
  enfant_id: number;
  type: 'vaccin';
  date_echeance: string;
  date_affichage: string;
  statut: 'a_venir' | 'affiche' | 'lu' | 'clos';
}

const RendezVousSuivi = () => {
  const [rdvs, setRdvs] = useState<RendezVous[]>([]);
  const [rappels] = useState<Rappel[]>([]);

  const [formData, setFormData] = useState({
    enfant_id: '',
    etablissement_id: '',
    date_rdv: '',
    heure_rdv: '',
    motif: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    const nouveauRdv: RendezVous = {
      id: rdvs.length + 1,
      enfant_id: parseInt(formData.enfant_id),
      etablissement_id: parseInt(formData.etablissement_id),
      date_rdv: dateTime,
      motif: formData.motif,
      statut: 'planifie',
    };

    setRdvs((prev) => [...prev, nouveauRdv]);
    setFormData({
      enfant_id: '',
      etablissement_id: '',
      date_rdv: '',
      heure_rdv: '',
      motif: '',
    });
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(date);
  };

  const getStatutBadge = (statut: StatutRdv) => {
    const classes: Record<StatutRdv, string> = {
      planifie: 'badge badge-planifie',
      honore: 'badge badge-honore',
      manque: 'badge badge-manque',
      annule: 'badge badge-annule',
    };
    return <span className={classes[statut]}>{statut}</span>;
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
      lu: 'Lu',
      clos: 'Clos',
    };
    return <span className={classes[statut]}>{labels[statut]}</span>;
  };

  const getEnfantNom = (rdv: RendezVous) => {
    if (rdv.enfant_nom || rdv.enfant_prenom) {
      return (rdv.enfant_prenom || '') + ' ' + (rdv.enfant_nom || '');
    }
    return 'ID: ' + rdv.enfant_id;
  };

  return (
    <div className="container-rdv">
      <div className="header"><h1>Rendez-vous de suivi - Rappels de vaccination</h1><p className="header-subtitle">Planifiez les rendez-vous de vaccination et suivez l'envoi des rappels 24h avant la date pr�vue.</p></div>

      <section className="form-section">
        <div className="section-header"><h2>Enregistrer un rendez-vous de vaccination</h2><p className="section-description">Renseignez les informations du rendez-vous pour permettre le d�clenchement automatique du rappel.</p></div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="enfant_id">ID Enfant *</label>
              <input
                type="number"
                id="enfant_id"
                name="enfant_id"
                value={formData.enfant_id}
                onChange={handleChange}
                required
                placeholder="Ex: 1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="etablissement_id">ID Établissement *</label>
              <input
                type="number"
                id="etablissement_id"
                name="etablissement_id"
                value={formData.etablissement_id}
                onChange={handleChange}
                required
                placeholder="Ex: 1"
              />
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

            <div className="form-group" className="form-group span-2">
              <label htmlFor="motif">Motif du rendez-vous *</label>
              <textarea
                id="motif"
                name="motif"
                value={formData.motif}
                onChange={handleChange}
                required
                placeholder="Ex: Vaccination DTP - 1ère dose"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary">
            Enregistrer le rendez-vous
          </button>
        </form>
      </section>

      <section className="form-section">
        <div className="section-header"><h2>Liste des rendez-vous</h2><p className="section-description">Vue synth�tique des rendez-vous planifi�s, honor�s, manqu�s ou annul�s.</p></div>
        <div className="table-wrapper">
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
                    <td>{rdv.id}</td>
                    <td>{getEnfantNom(rdv)}</td>
                    <td>{rdv.etablissement_nom || 'ID: ' + rdv.etablissement_id}</td>
                    <td>{formatDateTime(rdv.date_rdv)}</td>
                    <td>{rdv.motif}</td>
                    <td>{getStatutBadge(rdv.statut)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <small style={{ color: '#6b7280', marginTop: '0.5rem', display: 'block' }}>
          * Le rappel automatique est déclenché 24 heures avant la date prévue du rendez-vous.
        </small>
      </section>

      <section className="form-section">
        <h2>Rappels programmés</h2>
        <div className="table-wrapper">
          <table className="table-rdv">
            <thead>
              <tr>
                <th>ID</th>
                <th>Enfant</th>
                <th>Type</th>
                <th>Date d'échéance</th>
                <th>Date d'affichage</th>
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
                    <td>{rappel.id}</td>
                    <td>{'ID: ' + rappel.enfant_id}</td>
                    <td>Vaccination</td>
                    <td>{new Date(rappel.date_echeance).toLocaleDateString('fr-FR')}</td>
                    <td>{new Date(rappel.date_affichage).toLocaleDateString('fr-FR')}</td>
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
