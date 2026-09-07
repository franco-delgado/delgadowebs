import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const ROLE_LABELS = { cliente: 'Cliente', entrenador: 'Entrenador', dueno: 'Dueño' };

const NAV_BY_ROLE = {
  cliente: [{ to: '/cliente', label: 'Mi espacio', icon: '●' }],
  entrenador: [{ to: '/entrenador', label: 'Panel entrenador', icon: '●' }],
  dueno: [{ to: '/dueno', label: 'Panel del dueño', icon: '●' }],
};

export default function Sidebar({ role, open, onClose }) {
  const items = NAV_BY_ROLE[role] || [];
  return (
    <>
      {open && <div className="sidebar-scrim" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <span className="sidebar-mark" />
          <span className="sidebar-brand-text">GYMFLOW</span>
        </div>

        <p className="eyebrow sidebar-section-label">
          <span className="pulse-rule" />
          {ROLE_LABELS[role]}
        </p>

{/*      <nav className="sidebar-nav">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
   */ }

        <div className="sidebar-footer">
          <p className="sidebar-footer-text">GymFlow v2.0 · Prototipo</p>
        </div>
      </aside>
    </>
  );
}
