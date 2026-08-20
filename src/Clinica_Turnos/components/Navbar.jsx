import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__brand">
        <span className="navbar__mark" aria-hidden="true">+</span>
        <span className="navbar__brand-text">
          Clínica <em>Vital</em>
        </span>
      </div>
      <nav className="navbar__links">
        {/* Si montás ClinicaTurnos en otro prefijo (no "/clinica"),
            actualizá estos dos "to" para que coincidan. */}
        <NavLink
          to="/clinica"
          end
          className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
        >
          Sacar turno
        </NavLink>
        <NavLink
          to="/clinica/admin"
          className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
        >
          Panel administrativo
        </NavLink>
      </nav>
    </header>
  );
}
