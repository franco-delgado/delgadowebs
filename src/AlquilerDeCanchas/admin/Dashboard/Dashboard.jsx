import { useMemo } from 'react'
import { ACTIVE_STATUS } from '../../config/defaults'
import { useClub } from '../../context/ClubContext'
import { addDays, dayParts, formatShort, todayYMD } from '../../utils/dates'
import { money } from '../../utils/format'
import { storageUsage } from '../../utils/storage'
import { StatusBadge } from '../../components/ui/ui'
import './Dashboard.css'

export default function Dashboard({ onOpenReservations }) {
  const { reservations, activeCourts, slotsFor, settings } = useClub()
  const today = todayYMD()
  const month = today.slice(0, 7)

  const stats = useMemo(() => {
    const pending = reservations.filter(r => r.status === 'pendiente').length
    const todayCount = reservations.filter(r => r.date === today && ACTIVE_STATUS.includes(r.status)).length
    const monthOk = reservations.filter(r => r.status === 'confirmada' && r.date.startsWith(month))
    return { pending, todayCount, monthCount: monthOk.length, revenue: monthOk.reduce((s, r) => s + r.price, 0) }
  }, [reservations, today, month])

  const occupancy = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const date = addDays(today, i)
    let capacity = 0
    activeCourts.forEach(c => { capacity += slotsFor(c.id, date).filter(s => s.state !== 'cerrado').length })
    const used = reservations.filter(r => r.date === date && ACTIVE_STATUS.includes(r.status)).length
    return { date, used, capacity, pct: capacity ? Math.min(100, Math.round((used / capacity) * 100)) : 0 }
  }), [today, activeCourts, slotsFor, reservations])

  const upcoming = useMemo(() => reservations
    .filter(r => ACTIVE_STATUS.includes(r.status) && r.date >= today)
    .sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start))
    .slice(0, 8), [reservations, today])

  const usage = storageUsage()
  const usagePct = Math.round((usage.bytes / usage.limit) * 100)

  return (
    <div>
      <div className="cl-panel-head">
        <div>
          <h1>Resumen</h1>
          <p>Lo importante de {settings.name} de un vistazo.</p>
        </div>
      </div>

      {usagePct >= 70 && (
        <div className="cl-alert" role="alert">
          El almacenamiento del navegador está al {usagePct}%. Descargá una copia de seguridad desde Configuración y eliminá comprobantes o novedades antiguas.
        </div>
      )}

      <div className="cl-stats">
        <button type="button" className={'cl-stat' + (stats.pending ? ' is-alert' : '')} onClick={() => onOpenReservations('pendiente')}>
          <span>Pendientes de confirmar</span><strong>{stats.pending}</strong>
        </button>
        <div className="cl-stat"><span>Turnos de hoy</span><strong>{stats.todayCount}</strong></div>
        <div className="cl-stat"><span>Confirmadas este mes</span><strong>{stats.monthCount}</strong></div>
        <div className="cl-stat"><span>Ingresos confirmados del mes</span><strong>{money(stats.revenue)}</strong></div>
      </div>

      <div className="cl-dash-cols">
        <section className="cl-card">
          <h2>Ocupación próximos 7 días</h2>
          <ul className="cl-occ">
            {occupancy.map(o => {
              const p = dayParts(o.date)
              return (
                <li key={o.date}>
                  <span className="cl-occ__day">{o.date === today ? 'Hoy' : `${p.wd} ${p.day}`}</span>
                  <span className="cl-occ__bar" role="img" aria-label={`${o.pct}% ocupado`}><i style={{ width: o.pct + '%' }} /></span>
                  <span className="cl-occ__n">{o.used}/{o.capacity}</span>
                </li>
              )
            })}
          </ul>
        </section>

        <section className="cl-card">
          <h2>Próximos turnos</h2>
          {upcoming.length ? (
            <ul className="cl-upc">
              {upcoming.map(r => (
                <li key={r.id}>
                  <div><strong>{formatShort(r.date)} {r.start}</strong><span>{r.courtName}</span></div>
                  <div><span>{r.name} {r.surname}</span><StatusBadge status={r.status} /></div>
                </li>
              ))}
            </ul>
          ) : <p className="cl-field__hint">Todavía no hay reservas próximas.</p>}
        </section>
      </div>
    </div>
  )
}
