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

function Shell() {
  const { view, theme } = useClub()
  return (
    <div className="cl-app" style={theme}>
      <Header />
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

/* Punto de entrada: importá este componente donde quieras mostrar el sitio del club */
export default function Chacarita() {
  return (
    <ClubProvider>
      <Shell />
    </ClubProvider>
  )
}
