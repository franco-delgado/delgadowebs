import { useMemo, useState } from 'react'
import { RESERVATION_STATUS } from '../../config/defaults'
import { useClub } from '../../context/ClubContext'
import Modal from '../../components/Modal/Modal'
import Icon from '../../components/ui/Icon'
import { Button, EmptyState, Field, StatusBadge } from '../../components/ui/ui'
import { dayParts, formatDateTime, formatLong, formatShort } from '../../utils/dates'
import { digits, money, waLink } from '../../utils/format'
import { downloadDataUrl, openDataUrl } from '../../utils/files'
import { downloadCSV } from '../../utils/csv'
import './ReservationsManager.css'

const PAGE = 25

function Proof({ proof }) {
  if (!proof) return <p className="cl-field__hint">Sin comprobante.</p>
  const isImg = proof.type.startsWith('image/')
  return (
    <div className="cl-proof">
      {isImg ? (
        <button type="button" className="cl-proof__img" onClick={() => openDataUrl(proof.data)} aria-label="Abrir comprobante en una pestaña nueva">
          <img src={proof.data} alt="Comprobante de transferencia" />
        </button>
      ) : (
        <div className="cl-proof__pdf"><Icon name="file" size={32} /><span>{proof.name}</span></div>
      )}
      <div className="cl-actions">
        <Button variant="ghost" size="sm" icon="eye" onClick={() => openDataUrl(proof.data)}>Abrir</Button>
        <Button variant="ghost" size="sm" icon="download" onClick={() => downloadDataUrl(proof.data, proof.name)}>Descargar</Button>
      </div>
    </div>
  )
}

function Detail({ r, actions, onClose }) {
  const { settings } = useClub()
  const wa = waLink(r.phone, `Hola ${r.name}, te escribimos de ${settings.name} por tu reserva ${r.code} (${formatLong(r.date)}, ${r.start}).`)
  return (
    <Modal title={`Reserva ${r.code}`} onClose={onClose} wide>
      <div className="cl-detail">
        <dl className="cl-summary">
          <div><dt>Estado</dt><dd><StatusBadge status={r.status} /></dd></div>
          <div><dt>Solicitada</dt><dd>{formatDateTime(r.createdAt)}</dd></div>
          <div><dt>Cancha</dt><dd>{r.courtName}{r.sport ? ` (${r.sport})` : ''}</dd></div>
          <div><dt>Día y horario</dt><dd>{formatLong(r.date)}, {r.start} a {r.end}</dd></div>
          <div><dt>Nombre y apellido</dt><dd>{r.name} {r.surname}</dd></div>
          <div><dt>DNI</dt><dd>{r.dni}</dd></div>
          <div><dt>Teléfono</dt><dd>{r.phone}</dd></div>
          <div><dt>Importe</dt><dd><strong>{money(r.price)}</strong></dd></div>
        </dl>
        <h3>Comprobante de transferencia</h3>
        <Proof proof={r.proof} />
        <div className="cl-actions cl-actions--end">
          {wa && <a className="cl-btn cl-btn--ghost cl-btn--sm" href={wa} target="_blank" rel="noreferrer"><Icon name="phone" size={15} />Escribir por WhatsApp</a>}
          {actions(r, onClose)}
        </div>
      </div>
    </Modal>
  )
}

export default function ReservationsManager({ initialStatus = '' }) {
  const { reservations, courts, setReservationStatus, deleteReservation, confirm, toast } = useClub()
  const [status, setStatus] = useState(initialStatus)
  const [courtId, setCourtId] = useState('')
  const [date, setDate] = useState('')
  const [q, setQ] = useState('')
  const [shown, setShown] = useState(PAGE)
  const [openId, setOpenId] = useState(null)

  const list = useMemo(() => {
    const term = q.trim().toLowerCase()
    return reservations
      .filter(r => (!status || r.status === status) && (!courtId || r.courtId === courtId) && (!date || r.date === date) &&
        (!term || `${r.name} ${r.surname} ${r.dni} ${r.phone} ${r.code}`.toLowerCase().includes(term)))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }, [reservations, status, courtId, date, q])

  const current = reservations.find(r => r.id === openId)

  const change = async (r, next, opts) => {
    if (opts && !(await confirm(opts))) return false
    if (setReservationStatus(r.id, next)) toast(next === 'confirmada' ? 'Reserva confirmada' : next === 'rechazada' ? 'Reserva rechazada' : 'Reserva cancelada')
    return true
  }
  const remove = async r => {
    if (await confirm({ title: 'Eliminar reserva', message: `Se borrará la reserva ${r.code} de ${r.name} ${r.surname}, junto con su comprobante. No se puede deshacer.`, confirmLabel: 'Eliminar', danger: true })) {
      deleteReservation(r.id)
      toast('Reserva eliminada')
      return true
    }
    return false
  }

  const actions = (r, close) => (
    <>
      {r.status === 'pendiente' && <>
        <Button size="sm" icon="check" onClick={async () => { if (await change(r, 'confirmada')) close?.() }}>Confirmar</Button>
        <Button size="sm" variant="ghost" icon="x" onClick={async () => { if (await change(r, 'rechazada', { title: 'Rechazar reserva', message: `Se liberará el turno y ${r.name} no podrá usarlo. Avisale por teléfono el motivo.`, confirmLabel: 'Rechazar', danger: true })) close?.() }}>Rechazar</Button>
      </>}
      {r.status === 'confirmada' &&
        <Button size="sm" variant="ghost" icon="x" onClick={async () => { if (await change(r, 'cancelada', { title: 'Cancelar reserva', message: 'Se liberará el turno. Avisale a la persona por teléfono.', confirmLabel: 'Cancelar reserva', danger: true })) close?.() }}>Cancelar</Button>}
      {(r.status === 'rechazada' || r.status === 'cancelada') &&
        <Button size="sm" variant="ghost" icon="trash" onClick={async () => { if (await remove(r)) close?.() }}>Eliminar</Button>}
    </>
  )

  const exportCsv = () => {
    downloadCSV(`reservas-${new Date().toISOString().slice(0, 10)}.csv`,
      ['Código', 'Fecha', 'Inicio', 'Fin', 'Cancha', 'Nombre', 'Apellido', 'DNI', 'Teléfono', 'Importe', 'Estado', 'Solicitada'],
      list.map(r => [r.code, formatShort(r.date), r.start, r.end, r.courtName, r.name, r.surname, r.dni, r.phone, r.price, RESERVATION_STATUS[r.status], formatDateTime(r.createdAt)]))
  }

  const reset = () => { setStatus(''); setCourtId(''); setDate(''); setQ(''); setShown(PAGE) }
  const filtered = status || courtId || date || q

  return (
    <div>
      <div className="cl-panel-head">
        <div>
          <h1>Reservas</h1>
          <p>Datos de cada persona y su comprobante de transferencia.</p>
        </div>
        <Button variant="ghost" icon="download" onClick={exportCsv} disabled={!list.length}>Exportar a Excel (CSV)</Button>
      </div>

      <div className="cl-card cl-filters">
        <Field label="Buscar" placeholder="Nombre, DNI, teléfono o código" value={q} onChange={e => { setQ(e.target.value); setShown(PAGE) }} type="search" />
        <Field label="Estado" as="select" value={status} onChange={e => { setStatus(e.target.value); setShown(PAGE) }}>
          <option value="">Todos</option>
          {Object.entries(RESERVATION_STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </Field>
        <Field label="Cancha" as="select" value={courtId} onChange={e => { setCourtId(e.target.value); setShown(PAGE) }}>
          <option value="">Todas</option>
          {courts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Field>
        <Field label="Fecha de juego" type="date" value={date} onChange={e => { setDate(e.target.value); setShown(PAGE) }} />
        {filtered && <Button variant="ghost" size="sm" onClick={reset}>Limpiar filtros</Button>}
      </div>

      {list.length ? (
        <>
          <p className="cl-count">{list.length} {list.length === 1 ? 'reserva' : 'reservas'}</p>
          <ul className="cl-rlist">
            {list.slice(0, shown).map(r => {
              const p = dayParts(r.date)
              return (
                <li key={r.id} className="cl-rrow">
                  <div className="cl-rrow__date"><span>{p.wd}</span><strong>{p.day}</strong><span>{p.mon}</span></div>
                  <div className="cl-rrow__who">
                    <strong>{r.surname}, {r.name}</strong>
                    <span>DNI {r.dni}</span>
                    <span>{digits(r.phone) ? r.phone : '-'}</span>
                  </div>
                  <div className="cl-rrow__what">
                    <strong>{r.start} a {r.end}</strong>
                    <span>{r.courtName}</span>
                    <span>{money(r.price)}</span>
                  </div>
                  <div className="cl-rrow__status"><StatusBadge status={r.status} />{r.proof && <span className="cl-rrow__proof"><Icon name="file" size={14} />Comprobante</span>}</div>
                  <div className="cl-rrow__actions">
                    <Button size="sm" variant="soft" icon="eye" onClick={() => setOpenId(r.id)}>Ver detalle</Button>
                    {actions(r)}
                  </div>
                </li>
              )
            })}
          </ul>
          {list.length > shown && <div className="cl-actions"><Button variant="ghost" onClick={() => setShown(s => s + PAGE)}>Ver más</Button></div>}
        </>
      ) : (
        <EmptyState title={reservations.length ? 'No hay reservas con esos filtros' : 'Todavía no hay reservas'} text={reservations.length ? 'Probá quitando algún filtro.' : 'Cuando alguien reserve, la vas a ver acá.'} />
      )}
      {current && <Detail r={current} actions={actions} onClose={() => setOpenId(null)} />}
    </div>
  )
}
