import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDemoAccounts } from '../data/store';
import './Login.css';

const ROLE_DOT = { cliente: '#ff5a36', entrenador: '#1fa98c', dueno: '#4d8dff' };

export default function Login() {
  const { login, loginAsDemo, error } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const demoAccounts = getDemoAccounts();

  // 1. Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      login(username, password);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-panel">
        <div className="login-brand">
          <span className="login-mark" />
          <div>
            <p className="eyebrow">Panel de gestión</p>
            <h1 className="login-title">GYMFLOW</h1>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="username">Usuario</label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="tu usuario"
              autoComplete="username"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="btn btn-primary login-submit">
            Ingresar
          </button>
        </form>

        <div className="login-demo">
          <p className="eyebrow"><span className="pulse-rule" />Accesos de prueba</p>
          <div className="login-demo-grid">
            {demoAccounts.map((acc) => (
              <button
                key={acc.username}
                className="login-demo-btn"
                style={{ '--dot': ROLE_DOT[acc.role] }}
                onClick={() => loginAsDemo(acc.username)}
                type="button"
              >
                <span className="login-demo-dot" />
                {acc.label}
              </button>
            ))}
          </div>
          <p className="login-demo-hint">Todas las cuentas de prueba usan la contraseña "1234".</p>
        </div>
      </div>
    </div>
  );
}