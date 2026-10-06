import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreationBaby from "./pages/enregistrement-nouveau-ne/CreationBaby";
import ListeEnfants from "./pages/dossiers-enfants/ListeEnfants";
import DossierEnfant from "./pages/dossiers-enfants/DossierEnfant";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreationBaby />} />
        <Route path="/dossiers-enfants" element={<ListeEnfants />} />
        <Route path="/dossiers-enfants/:id" element={<DossierEnfant />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
