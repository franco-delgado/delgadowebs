import { useState } from 'react'
import { useClub } from '../context/ClubContext'
import { Button, Field } from '../components/ui/ui'
import Icon from '../components/ui/Icon'
import Logo from '../components/Logo/Logo'
import Dashboard from './Dashboard/Dashboard'
import ReservationsManager from './ReservationsManager/ReservationsManager'
import NewsManager from './NewsManager/NewsManager'
import ScheduleManager from './ScheduleManager/ScheduleManager'
import Settings from './Settings/Settings'
import './Admin.css'

function AdminLogin() {
  const { login, settings } = useClub()
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async e => {
    e.preventDefault()
    setBusy(true)
    const res = await login(pass)
    setBusy(false)
    if (!res.ok) { setError(res.error); setPass('') }
  }

  return (
    <div className="cl-login">
      <form className="cl-card cl-login__box" onSubmit={submit}>
        <Logo size={52} />
        <h1>Administración</h1>
        <p>Ingresá la contraseña para gestionar {settings.name}.</p>
        <Field label="Contraseña" type="password" value={pass} onChange={e => { setPass(e.target.value); setError('') }} error={error} autoComplete="current-password" autoFocus />
        <Button type="submit" block icon="lock" disabled={busy || !pass}>Ingresar</Button>
      </form>
    </div>
  )
}

const TABS = [
  ['dashboard', 'Resumen', 'dashboard'],
  ['reservations', 'Reservas', 'ticket'],
  ['news', 'Novedades', 'news'],
  ['schedule', 'Turnos y precios', 'clock'],
  ['settings', 'Configuración', 'sliders'],
]

export default function AdminPage() {
  const { isAdmin, logout, pendingCount } = useClub()
  const [tab, setTab] = useState('dashboard')
  const [filter, setFilter] = useState('')

  if (!isAdmin) return <AdminLogin />

  const goReservations = status => { setFilter(status); setTab('reservations') }

  return (
    <div className="cl-admin">
      <nav className="cl-admin__nav" aria-label="Administración">
        {TABS.map(([id, label, icon]) => (
          <button key={id} type="button" className={'cl-admin__tab' + (tab === id ? ' is-on' : '')} aria-current={tab === id ? 'page' : undefined} onClick={() => { setFilter(''); setTab(id) }}>
            <Icon name={icon} size={18} />
            <span>{label}</span>
            {id === 'reservations' && pendingCount > 0 && <em>{pendingCount}</em>}
          </button>
        ))}
        <button type="button" className="cl-admin__tab cl-admin__out" onClick={logout}><Icon name="logout" size={18} /><span>Cerrar sesión</span></button>
      </nav>
      <div className="cl-admin__content">
        {tab === 'dashboard' && <Dashboard onOpenReservations={goReservations} />}
        {tab === 'reservations' && <ReservationsManager initialStatus={filter} />}
        {tab === 'news' && <NewsManager />}
        {tab === 'schedule' && <ScheduleManager />}
        {tab === 'settings' && <Settings />}
      </div>
    </div>
  )
}
