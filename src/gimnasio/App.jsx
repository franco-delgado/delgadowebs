import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import ClientePage from './pages/cliente/ClientePage';
import EntrenadorPage from './pages/entrenador/EntrenadorPage';
import DuenoPage from './pages/dueno/DuenoPage';

const HOME_BY_ROLE = {
  cliente: '/gimnasio/cliente',
  entrenador: '/gimnasio/entrenador',
  dueno: '/gimnasio/dueno',
};

function ProtectedRoute({ role, children }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/gimnasio" replace />;
  if (currentUser.role !== role) return <Navigate to={HOME_BY_ROLE[currentUser.role]} replace />;
  return children;
}

function AppRoutes() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={currentUser ? <Navigate to={HOME_BY_ROLE[currentUser.role]} replace /> : <Login />}
      />
      <Route path="/cliente" element={<ProtectedRoute role="cliente"><ClientePage /></ProtectedRoute>} />
      <Route path="/entrenador" element={<ProtectedRoute role="entrenador"><EntrenadorPage /></ProtectedRoute>} />
      <Route path="/dueno" element={<ProtectedRoute role="dueno"><DuenoPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/gimnasio" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
        <AppRoutes />
    </AuthProvider>
  );
}
