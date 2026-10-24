import { useState } from 'react'
import { useClub } from '../../context/ClubContext'
import Logo from '../Logo/Logo'
import Icon from '../ui/Icon'
import './Header.css'

const LINKS = [
  ['home', 'Inicio'],
  ['news', 'Novedades'],
  ['reserve', 'Reservar cancha'],
]

export default function Header({ onBack, backHref, backLabel = 'Volver al portfolio', showBack = true }) {
  const { view, go, settings, isAdmin, pendingCount } = useClub()
  const [open, setOpen] = useState(false)
  const nav = v => { go(v); setOpen(false) }

  const goBack = () => (onBack ? onBack() : window.history.back())

  return (
    <header className="cl-header">
      {showBack && (
        <div className="cl-header__back">
          {backHref && !onBack ? (
            <a className="cl-header__backlink" href={backHref}>
              <Icon name="left" size={16} />
              {backLabel}
            </a>
          ) : (
            <button type="button" className="cl-header__backlink" onClick={goBack}>
              <Icon name="left" size={16} />
              {backLabel}
            </button>
          )}
        </div>
      )}
      <div className="cl-header__bar">
        <button type="button" className="cl-header__brand" onClick={() => nav('home')}>
          <Logo size={38} />
          <span>{settings.name}</span>
        </button>

        <button type="button" className="cl-header__toggle" aria-expanded={open} aria-label="Menú" onClick={() => setOpen(o => !o)}>
          <Icon name={open ? 'x' : 'menu'} size={22} />
        </button>

        <nav className={'cl-header__nav' + (open ? ' is-open' : '')} aria-label="Principal">
          {LINKS.map(([v, label]) => (
            <button key={v} type="button" className={'cl-header__link' + (view === v ? ' is-active' : '')} aria-current={view === v ? 'page' : undefined} onClick={() => nav(v)}>
              {label}
            </button>
          ))}
          <button type="button" className={'cl-header__admin' + (view === 'admin' ? ' is-active' : '')} onClick={() => nav('admin')}>
            <Icon name="lock" size={15} />
            {isAdmin ? 'Panel' : 'Administración'}
            {isAdmin && pendingCount > 0 && <span className="cl-header__dot" aria-label={`${pendingCount} reservas pendientes`}>{pendingCount}</span>}
          </button>
        </nav>
      </div>
    </header>
  )
}
