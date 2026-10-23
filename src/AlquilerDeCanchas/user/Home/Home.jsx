import { useClub } from '../../context/ClubContext'
import { todayYMD } from '../../utils/dates'
import { instagramLink, money, sortNews, waLink } from '../../utils/format'
import Logo from '../../components/Logo/Logo'
import Icon from '../../components/ui/Icon'
import { Button } from '../../components/ui/ui'
import NewsCard from '../News/NewsCard'
import NewsDetail from '../News/NewsDetail'
import { useState } from 'react'
import '../News/News.css'
import './Home.css'

const STEPS = [
  ['Elegí tu turno', 'Seleccioná cancha, día y horario disponible.'],
  ['Completá tus datos', 'Nombre, apellido, DNI y un teléfono para avisarte cualquier novedad.'],
  ['Transferí y adjuntá el comprobante', 'El club verifica el pago y te confirma la reserva.'],
]

export default function Home() {
  const { settings, news, activeCourts, slotsFor, go } = useClub()
  const [open, setOpen] = useState(null)
  const court = activeCourts[0]
  const free = court ? slotsFor(court.id, todayYMD()).filter(s => s.state === 'libre') : []
  const latest = [...news].sort(sortNews).slice(0, 3)
  const wa = waLink(settings.phone)
  const ig = instagramLink(settings.instagram)
  const contacts = [
    settings.address && ['pin', 'Dónde estamos', settings.address],
    settings.phone && ['phone', 'Teléfono / WhatsApp', settings.phone, wa],
    settings.email && ['mail', 'Correo', settings.email, 'mailto:' + settings.email],
    ig && ['news', 'Instagram', settings.instagram, ig],
  ].filter(Boolean)

  return (
    <>
      <section className="cl-hero">
        <div className="cl-hero__copy">
          <Logo size={64} />
          <h1>{settings.name}</h1>
          <p>{settings.tagline}</p>
          <div className="cl-hero__cta">
            <Button variant="light" icon="calendar" onClick={() => go('reserve')}>Reservar cancha</Button>
            <button type="button" className="cl-hero__link" onClick={() => go('news')}>Ver novedades</button>
          </div>
        </div>

        <aside className="cl-hero__panel" aria-label="Turnos libres hoy">
          <h2>Turnos libres hoy</h2>
          {court ? (
            <>
              <p className="cl-hero__court">{court.name}{court.sport ? `, ${court.sport}` : ''}</p>
              {free.length ? (
                <ul className="cl-hero__slots">
                  {free.slice(0, 6).map(s => (
                    <li key={s.id}>
                      <button type="button" onClick={() => go('reserve')}>
                        <strong>{s.start}</strong>
                        <span>{money(s.price)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : <p className="cl-hero__none">Hoy no quedan turnos. Mirá los próximos días.</p>}
              <Button variant="primary" block onClick={() => go('reserve')}>Ver todos los turnos</Button>
            </>
          ) : <p className="cl-hero__none">Las reservas online se habilitarán pronto.</p>}
        </aside>
      </section>

      <section className="cl-home-sec">
        <div className="cl-home-head">
          <h2 className="cl-h2">Últimas novedades</h2>
          <button type="button" className="cl-linkbtn" onClick={() => go('news')}>Ver todas</button>
        </div>
        <div className="cl-news-grid">{latest.map(n => <NewsCard key={n.id} item={n} onOpen={setOpen} />)}</div>
      </section>

      <section className="cl-home-sec">
        <h2 className="cl-h2">Cómo reservar</h2>
        <ol className="cl-steps">
          {STEPS.map(([t, d], i) => (
            <li key={t}>
              <span className="cl-steps__n">{i + 1}</span>
              <strong>{t}</strong>
              <span>{d}</span>
            </li>
          ))}
        </ol>
      </section>

      {contacts.length > 0 && (
        <section className="cl-home-sec">
          <h2 className="cl-h2">Contacto</h2>
          <div className="cl-contacts">
            {contacts.map(([icon, label, text, href]) => (
              <div key={label} className="cl-card cl-contact">
                <Icon name={icon} size={20} />
                <div>
                  <span className="cl-contact__label">{label}</span>
                  {href ? <a href={href} target="_blank" rel="noreferrer">{text}</a> : <span className="cl-contact__text">{text}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      {open && <NewsDetail item={open} onClose={() => setOpen(null)} />}
    </>
  )
}
