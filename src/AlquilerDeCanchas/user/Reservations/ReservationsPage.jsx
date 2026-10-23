import { useMemo, useState } from 'react'
import { NIGHT_FROM } from '../../config/defaults'
import { useClub } from '../../context/ClubContext'
import { addDays, dayParts, formatLong, toMin, todayYMD } from '../../utils/dates'
import { money } from '../../utils/format'
import { EmptyState } from '../../components/ui/ui'
import Icon from '../../components/ui/Icon'
import BookingModal from './BookingModal'
import MyReservations from './MyReservations'
import './Reservations.css'

const STATE_LABEL = { libre: 'Disponible', ocupado: 'Reservado', cerrado: 'Cerrado' }

export default function ReservationsPage() {
  const { settings, activeCourts, slotsFor, blockedMap } = useClub()
  const today = todayYMD()
  const [courtId, setCourtId] = useState(activeCourts[0]?.id || '')
  const [date, setDate] = useState(today)
  const [pick, setPick] = useState(null)

  const court = activeCourts.find(c => c.id === courtId) || activeCourts[0]
  const days = useMemo(() => Array.from({ length: settings.daysAhead }, (_, i) => addDays(today, i)), [settings.daysAhead, today])
  const slots = court ? slotsFor(court.id, date).filter(s => s.state !== 'pasado') : []
  const day = slots.filter(s => toMin(s.start) < toMin(NIGHT_FROM))
  const night = slots.filter(s => toMin(s.start) >= toMin(NIGHT_FROM))
  const closed = blockedMap[date]

  if (!court) {
    return (
      <section>
        <h1 className="cl-page-title">Reservar cancha</h1>
        <EmptyState title="Las reservas online todavía no están disponibles" text="Consultá directamente con el club." />
      </section>
    )
  }

  const renderGroup = (title, list) => list.length > 0 && (
    <div className="cl-slotgroup">
      <h3>{title}</h3>
      <div className="cl-slots">
        {list.map(s => (
          <button key={s.id} type="button" className={'cl-slot cl-slot--' + s.state} disabled={s.state !== 'libre'} onClick={() => setPick(s)}>
            <span className="cl-slot__time">{s.start} a {s.end}</span>
            <span className="cl-slot__price">{money(s.price)}</span>
            <span className="cl-slot__state">{STATE_LABEL[s.state]}</span>
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <section>
      <h1 className="cl-page-title">Reservar cancha</h1>
      <p className="cl-page-lead">Elegí cancha, día y horario. La reserva se confirma cuando el club verifica tu transferencia.</p>

      <div className="cl-res">
        <div className="cl-res__main">
          {activeCourts.length > 1 && (
            <div className="cl-courts" role="tablist" aria-label="Canchas">
              {activeCourts.map(c => (
                <button key={c.id} type="button" role="tab" aria-selected={c.id === court.id} className={'cl-court' + (c.id === court.id ? ' is-on' : '')} onClick={() => setCourtId(c.id)}>
                  <strong>{c.name}</strong>
                  {c.sport && <span>{c.sport}</span>}
                </button>
              ))}
            </div>
          )}

          <div className="cl-days" role="tablist" aria-label="Días">
            {days.map(d => {
              const p = dayParts(d)
              return (
                <button key={d} type="button" role="tab" aria-selected={d === date} className={'cl-day' + (d === date ? ' is-on' : '') + (blockedMap[d] ? ' is-closed' : '')} onClick={() => setDate(d)}>
                  <span>{d === today ? 'hoy' : p.wd}</span>
                  <strong>{p.day}</strong>
                  <span>{p.mon}</span>
                </button>
              )
            })}
          </div>

          <h2 className="cl-res__date">{formatLong(date)}</h2>
          {closed ? (
            <EmptyState title="El club permanece cerrado este día" text={closed.reason || 'Elegí otra fecha.'} />
          ) : slots.length ? (
            <>{renderGroup('Turnos de día', day)}{renderGroup('Turnos de noche', night)}</>
          ) : (
            <EmptyState title="No hay turnos para este día" text="Probá con otra fecha." />
          )}
        </div>

        <aside className="cl-res__side">
          <div className="cl-card">
            <h3>Condiciones</h3>
            <p className="cl-res__rules">{settings.rules}</p>
          </div>
          <MyReservations />
        </aside>
      </div>

      {pick && <BookingModal court={court} date={date} turn={pick} onClose={() => setPick(null)} />}
    </section>
  )
}
