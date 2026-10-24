import './AlquilerDeCanchas.css'
import { ClubProvider, useClub } from './context/ClubContext'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import ToastHost from './components/Toast/Toast'
import { ConfirmHost } from './components/ui/ui'
import Home from './user/Home/Home'
import NewsPage from './user/News/NewsPage'
import ReservationsPage from './user/Reservations/ReservationsPage'
import AdminPage from './admin/AdminPage'

function Shell({ backProps }) {
  const { view, theme } = useClub()
  return (
    <div className="cl-app" style={theme}>
      <Header {...backProps} />
      <main className="cl-main">
        {view === 'home' && <Home />}
        {view === 'news' && <NewsPage />}
        {view === 'reserve' && <ReservationsPage />}
        {view === 'admin' && <AdminPage />}
      </main>
      <Footer />
      <ToastHost />
      <ConfirmHost />
    </div>
  )
}

/* Punto de entrada: importá este componente donde quieras mostrar el sitio del club.
   Botón "Volver al portfolio" (props opcionales):
   - onBack:    función que se ejecuta al hacer clic (ej. () => navigate('/'))
   - backHref:  alternativa: link a la página del portfolio (ej. '/' o 'https://tuportfolio.com')
   - backLabel: texto del botón (por defecto "Volver al portfolio")
   - showBack:  false para ocultarlo
   Si no pasás onBack ni backHref, vuelve a la página anterior del navegador. */
export default function AlquilerDeCanchas({ onBack, backHref, backLabel = 'Volver al portfolio', showBack = true }) {
  return (
    <ClubProvider>
      <Shell backProps={{ onBack, backHref, backLabel, showBack }} />
    </ClubProvider>
  )
}
