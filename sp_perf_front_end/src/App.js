import { BrowserRouter, Routes, Route } from "react-router-dom";
import SpPerfEmploye from "./pages/sp_perf_employe/sp_perf_employe.jsx";
import SpPerfProjet from "./pages/sp_perf_projet/sp_perf_projet.jsx";
import SpPerfProcessus from "./pages/sp_perf_processus/sp_pref_processus.jsx";
import Accueil from "./pages/sp_perf_pageAccueil/sp_perf_pageAccueil.jsx";
import SpPerfTousProcessus from "./pages/sp_perf_processus/sp_perf_tous_processus.jsx";
import SpPerfPolyvalence from "./pages/sp_perf_polyvalence/sp_perf_polyvalence.jsx";
import SpMatrice from "./pages/sp_matrice/sp_matrice.jsx";


function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/employes" element={<SpPerfEmploye />} />
          <Route path="/projets" element={<SpPerfProjet />} />
          <Route path="/processus" element={<SpPerfProcessus />} />
          <Route path="/tous-processus" element={<SpPerfTousProcessus />} />
          <Route path="/polyvalence" element={<SpPerfPolyvalence />} />
          <Route path="/matrice" element={<SpMatrice />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;