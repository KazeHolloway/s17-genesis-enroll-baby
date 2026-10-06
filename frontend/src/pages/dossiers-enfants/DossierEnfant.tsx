import { useParams } from "react-router-dom";


function DossierEnfant() {
const { id } = useParams();
  return (
    <div>
      <h1>Dossier du nouveau-né</h1>
    </div>
  );
}

export default DossierEnfant;
