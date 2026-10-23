import { useClub } from '../../context/ClubContext'
import { instagramLink, waLink } from '../../utils/format'
import Logo from '../Logo/Logo'
import './Footer.css'

export default function Footer() {
  const { settings, go } = useClub()
  const wa = waLink(settings.phone)
  const ig = instagramLink(settings.instagram)
  return (
    <footer className="cl-footer">
      <div className="cl-footer__in">
        <div className="cl-footer__brand">
          <Logo size={34} />
          <strong>{settings.name}</strong>
        </div>
        <ul className="cl-footer__list">
          {settings.address && <li>{settings.address}</li>}
          {settings.phone && <li>{wa ? <a href={wa} target="_blank" rel="noreferrer">{settings.phone}</a> : settings.phone}</li>}
          {settings.email && <li><a href={'mailto:' + settings.email}>{settings.email}</a></li>}
          {ig && <li><a href={ig} target="_blank" rel="noreferrer">Instagram</a></li>}
        </ul>
        <div className="cl-footer__nav">
          <button type="button" onClick={() => go('news')}>Novedades</button>
          <button type="button" onClick={() => go('reserve')}>Reservar cancha</button>
        </div>
      </div>
      <p className="cl-footer__copy">© {new Date().getFullYear()} {settings.name}. Todos los derechos reservados.</p>
    </footer>
  )
}
