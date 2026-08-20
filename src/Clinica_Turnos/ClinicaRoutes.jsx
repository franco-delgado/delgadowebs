import { Routes, Route } from "react-router-dom";
import { ClinicaProvider } from "./data/ClinicaContext.jsx";
import Navbar from "./components/Navbar.jsx";
import ReservarTurno from "./pages/ReservarTurno.jsx";
import ConfirmacionTurno from "./pages/ConfirmacionTurno.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import "./styles/tokens.css";
import "./ClinicaRoutes.css";

// Este componente NO trae su propio <Router>: usa el HashRouter que ya
// tenés en tu App.jsx principal. Se monta como rutas hijas de "/clinica/*".
// Las rutas internas son relativas ("", "admin", "confirmacion/:turnoId")
// para que funcionen sin importar el prefijo donde lo cuelgues.
function ClinicaTurnos() {
  return (
    <ClinicaProvider>
      <div className="clinica-app-shell">
        <Navbar />
        <main className="clinica-app-main">
          <Routes>
            <Route path="" element={<ReservarTurno />} />
            <Route path="confirmacion/:turnoId" element={<ConfirmacionTurno />} />
            <Route path="admin" element={<AdminPanel />} />
          </Routes>
        </main>
      </div>
    </ClinicaProvider>
  );
}

export default ClinicaTurnos;
