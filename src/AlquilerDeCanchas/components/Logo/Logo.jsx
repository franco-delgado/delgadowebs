import { useClub } from '../../context/ClubContext'
import './Logo.css'

/* Escudo del club cargado desde Configuración; si no hay, muestra una marca genérica */
export default function Logo({ size = 40 }) {
  const { settings } = useClub()
  if (settings.logo) return <img className="cl-logo" src={settings.logo} alt="" width={size} height={size} />
  return (
    <svg className="cl-logo" width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <rect width="40" height="40" rx="9" fill="var(--accent)" />
      <g fill="none" stroke="var(--accent-ink)" strokeWidth="1.8" opacity=".95">
        <rect x="7" y="9" width="26" height="22" rx="1.5" />
        <path d="M20 9v22" />
        <circle cx="20" cy="20" r="4.6" />
      </g>
    </svg>
  )
}
