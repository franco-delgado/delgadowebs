import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Topbar.css';

const ROLE_LABELS = { cliente: 'Cliente', entrenador: 'Entrenador', dueno: 'Dueño' };
const ROLE_COLOR = { cliente: '#ff5a36', entrenador: '#1fa98c', dueno: '#4d8dff' };

export default function Topbar({ title, onMenuClick }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
  logout();
  navigate('/gimnasio', { replace: true });
};

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="topbar-menu-btn" onClick={onMenuClick} aria-label="Abrir menú">
          <span />
          <span />
          <span />
        </button>
        <div>
          <p className="eyebrow">{ROLE_LABELS[currentUser?.role]}</p>
          <h2 className="topbar-title">{title}</h2>
        </div>
      </div>

      <div className="topbar-right">
        <div className="topbar-user">
          <span className="topbar-avatar" style={{ background: ROLE_COLOR[currentUser?.role] }}>
            {currentUser?.nombre?.charAt(0)}
          </span>
          <div className="topbar-user-info">
            <p className="topbar-user-name">{currentUser?.nombre}</p>
            <p className="topbar-user-role">{ROLE_LABELS[currentUser?.role]}</p>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
          Salir
        </button>
      </div>
    </header>
  );
}