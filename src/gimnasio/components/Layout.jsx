import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export default function Layout({ title, children }) {
  const { currentUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="layout">
      <Sidebar role={currentUser.role} open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="layout-main">
        <Topbar title={title} onMenuClick={() => setMenuOpen(true)} />
        <main className="layout-content">{children}</main>
      </div>
    </div>
  );
}
