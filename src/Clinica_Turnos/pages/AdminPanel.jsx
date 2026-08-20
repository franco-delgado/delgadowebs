import { useState } from 'react';
import ListaTurnos from '../components/ListaTurnos.jsx';
import GestionProfesionales from '../components/GestionProfesionales.jsx';
import './AdminPanel.css';

const CLAVE_DEMO = 'clinica2026';
const CLAVE_SESION = 'clinica.adminAuth';

function AdminLogin({ onIngresar }) {
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');

  function manejarEnvio(evento) {
    evento.preventDefault();
    if (clave === CLAVE_DEMO) {
      window.sessionStorage.setItem(CLAVE_SESION, '1');
      onIngresar();
    } else {
      setError('Clave incorrecta. Probá de nuevo.');
    }
  }

  return (
    <div className="admin-login">
      <form className="admin-login__card" onSubmit={manejarEnvio}>
        <h1>Acceso administrativo</h1>
        <p className="admin-login__ayuda">
          Ingresá la clave del equipo de administración para ver los turnos y
          gestionar profesionales.
        </p>
        <div className="campo">
          <label htmlFor="clave">Clave</label>
          <input
            id="clave"
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            autoFocus
          />
        </div>
        {error && <span className="campo__error">{error}</span>}
        <button type="submit" className="boton-primario">
          Ingresar
        </button>
        <p className="admin-login__pista">Clave de demostración: <code>{CLAVE_DEMO}</code></p>
      </form>
    </div>
  );
}

export default function AdminPanel() {
  const [autenticado, setAutenticado] = useState(
    () => window.sessionStorage.getItem(CLAVE_SESION) === '1'
  );
  const [pestania, setPestania] = useState('turnos');

  if (!autenticado) {
    return <AdminLogin onIngresar={() => setAutenticado(true)} />;
  }

  return (
    <div className="admin">
      <aside className="admin__sidebar">
        <p className="admin__sidebar-titulo">Administración</p>
        <nav className="admin__nav">
          <button
            className={`admin__nav-item ${pestania === 'turnos' ? 'admin__nav-item--activo' : ''}`}
            onClick={() => setPestania('turnos')}
          >
            Turnos reservados
          </button>
          <button
            className={`admin__nav-item ${pestania === 'profesionales' ? 'admin__nav-item--activo' : ''}`}
            onClick={() => setPestania('profesionales')}
          >
            Profesionales y cupos
          </button>
        </nav>
        <button
          className="admin__salir"
          onClick={() => {
            window.sessionStorage.removeItem(CLAVE_SESION);
            setAutenticado(false);
          }}
        >
          Cerrar sesión
        </button>
      </aside>
      <section className="admin__contenido">
        {pestania === 'turnos' ? <ListaTurnos /> : <GestionProfesionales />}
      </section>
    </div>
  );
}
