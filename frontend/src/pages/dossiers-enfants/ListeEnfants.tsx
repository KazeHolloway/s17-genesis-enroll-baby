

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getData } from "../../services/api";
import type { BabyData } from "../../lib/types";

function ListeEnfants() {
const [enfants, setEnfants] = useState<BabyData[]>([]);
const navigate = useNavigate();
useEffect(() => {
  getData("/api/enfants")
    .then((data) => {
      setEnfants(data);
    })
    .catch((error) => {
      console.error(error);
    });
}, []);
  return (
  <div>
    <h1>Liste des nouveau-nés</h1>

    {enfants.map((enfant) => (
      <div key={enfant.id}>
        <h2>
          {enfant.prenom} {enfant.nom}
        </h2>

        <p>Sexe : {enfant.sexe}</p>
        <p>Date de naissance : {enfant.date_naissance}</p>
        <p>Statut : {enfant.statut_vital}</p>

        <button onClick={() => navigate(`/dossiers-enfants/${enfant.id}`)}>
  Voir le dossier
</button>
      </div>
    ))}
  </div>
);
}

export default ListeEnfants;
