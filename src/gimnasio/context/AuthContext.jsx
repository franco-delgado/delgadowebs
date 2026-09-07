import { createContext, useContext, useState } from 'react';
import { findAccount } from '../data/store';

const AuthContext = createContext(null);

// currentUser queda con forma uniforme: { role, id, nombre, username, ... }
function toCurrentUser(role, profile) {
  return { role, ...profile };
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState('');

  function login(username, password) {
    const found = findAccount(username, password);
    if (!found) {
      setError('Usuario o contraseña incorrectos.');
      return false;
    }
    setError('');
    setCurrentUser(toCurrentUser(found.role, found.profile));
    return true;
  }

  function loginAsDemo(username) {
    // Todas las cuentas semilla usan "1234" como contraseña de demo.
    login(username, '1234');
  }

  function refreshCurrentUser(updatedProfile) {
    setCurrentUser((prev) => (prev ? { ...prev, ...updatedProfile } : prev));
  }

  function logout() {
    setCurrentUser(null);
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, loginAsDemo, logout, error, refreshCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
