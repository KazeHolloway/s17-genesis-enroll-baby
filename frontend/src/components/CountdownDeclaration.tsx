import { useEffect, useState } from 'react';
import { getCountdownDeclaration } from '../services/api';
import type { CountdownDeclaration as Donnees } from '../lib/types';

type Props = { dossierId: number; token: string };

export default function CountdownDeclaration({ dossierId, token }: Props) {
  const [donnees, setDonnees] = useState<Donnees | null>(null);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    let actif = true;
    getCountdownDeclaration(dossierId, token)
      .then((d) => actif && setDonnees(d))
      .catch((e: Error) => actif && setErreur(e.message));
    return () => {
      actif = false;
    };
  }, [dossierId, token]);

  if (erreur) return <p role="alert">{erreur}</p>;
  if (!donnees) return <p>Chargement…</p>;

  if (donnees.statut === 'declaree') {
    return (
      <section className="compte-a-rebours compte-a-rebours--ok">
        <h3>Naissance déclarée</h3>
        <p>{donnees.message}</p>
      </section>
    );
  }

  if (donnees.statut === 'delai_expire') {
    return (
      <section className="compte-a-rebours compte-a-rebours--expire">
        <h3>Délai initial expiré</h3>
        <p>
          Le délai de 30 jours est dépassé. Une démarche de déclaration
          tardive peut être nécessaire.
        </p>
        <p>{donnees.message}</p>
      </section>
    );
  }

  return (
    <section className="compte-a-rebours">
      <p className="compte-a-rebours__jours">{donnees.jours_restants}</p>
      <p>jour(s) restant(s) pour déclarer la naissance</p>
      <p>{donnees.message}</p>
    </section>
  );
}