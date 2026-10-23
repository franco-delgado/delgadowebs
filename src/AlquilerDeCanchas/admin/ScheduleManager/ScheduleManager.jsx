import { useState } from 'react'
import { NIGHT_FROM, WEEKDAYS, WEEK_ORDER } from '../../config/defaults'
import { useClub } from '../../context/ClubContext'
import { Button, EmptyState, Field } from '../../components/ui/ui'
import { endMin, formatLong, fromMin, toMin, todayYMD } from '../../utils/dates'
import { money } from '../../utils/format'
import './ScheduleManager.css'

/* ---------- Canchas ---------- */
function CourtRow({ court }) {
  const { saveCourt, deleteCourt, confirm, toast } = useClub()
  const [d, setD] = useState(court)
  const dirty = d.name !== court.name || d.sport !== court.sport || d.active !== court.active

  const save = () => {
    if (!d.name.trim()) { toast('La cancha necesita un nombre.', 'err'); return }
    if (saveCourt({ ...d, name: d.name.trim(), sport: d.sport.trim() })) toast('Cancha guardada')
  }
  const remove = async () => {
    if (!(await confirm({ title: 'Eliminar cancha', message: `Se eliminará “${court.name}”.`, confirmLabel: 'Eliminar', danger: true }))) return
    const res = deleteCourt(court.id)
    if (!res.ok && res.error) toast(res.error, 'err')
  }
  return (
    <li className="cl-sm-row">
      <Field label="Nombre" value={d.name} onChange={e => setD({ ...d, name: e.target.value })} />
      <Field label="Deporte" value={d.sport} onChange={e => setD({ ...d, sport: e.target.value })} placeholder="Fútbol 5, pádel..." />
      <label className="cl-check cl-sm-row__check"><input type="checkbox" checked={d.active} onChange={e => setD({ ...d, active: e.target.checked })} /><span>Habilitada</span></label>
      <div className="cl-sm-row__btns">
        <Button size="sm" onClick={save} disabled={!dirty}>Guardar</Button>
        <Button size="sm" variant="ghost" icon="trash" onClick={remove} aria-label={`Eliminar ${court.name}`} />
      </div>
    </li>
  )
}

function Courts() {
  const { courts, saveCourt, toast } = useClub()
  const [name, setName] = useState('')
  const [sport, setSport] = useState('')
  const add = e => {
    e.preventDefault()
    if (!name.trim()) return
    if (saveCourt({ name: name.trim(), sport: sport.trim(), active: true })) { toast('Cancha agregada'); setName(''); setSport('') }
  }
  return (
    <section className="cl-card cl-block">
      <h2>Canchas</h2>
      <p className="cl-block__lead">Las canchas habilitadas aparecen para reservar. Si una tiene reservas, desactivala en lugar de eliminarla.</p>
      <ul className="cl-sm-list">{courts.map(c => <CourtRow key={c.id + c.name + c.sport + c.active} court={c} />)}</ul>
      <form className="cl-inline cl-sm-add" onSubmit={add}>
        <Field label="Nueva cancha" value={name} onChange={e => setName(e.target.value)} placeholder="Nombre" />
        <Field label="Deporte" value={sport} onChange={e => setSport(e.target.value)} placeholder="Opcional" />
        <Button type="submit" icon="plus" disabled={!name.trim()}>Agregar</Button>
      </form>
    </section>
  )
}

/* ---------- Turnos ---------- */
function TurnRow({ turn }) {
  const { saveTurn, deleteTurn, confirm, toast } = useClub()
  const [d, setD] = useState(turn)
  const dirty = JSON.stringify(d) !== JSON.stringify(turn)
  const toggleDay = n => setD(x => ({ ...x, days: x.days.includes(n) ? x.days.filter(v => v !== n) : [...x.days, n] }))

  const save = () => {
    const res = saveTurn(d)
    if (!res.ok) toast(res.error, 'err')
    else toast('Turno guardado')
  }
  const remove = async () => {
    if (await confirm({ title: 'Eliminar turno', message: `Se eliminará el turno de ${turn.start} a ${turn.end}. Las reservas ya hechas se conservan.`, confirmLabel: 'Eliminar', danger: true })) deleteTurn(turn.id)
  }
  return (
    <li className={'cl-turn' + (d.active ? '' : ' is-off')}>
      <div className="cl-turn__times">
        <Field label="Desde" type="time" value={d.start} onChange={e => setD({ ...d, start: e.target.value })} />
        <Field label="Hasta" type="time" value={d.end} onChange={e => setD({ ...d, end: e.target.value })} />
        <Field label="Precio ($)" type="number" min="0" step="100" value={d.price} onChange={e => setD({ ...d, price: e.target.value })} />
      </div>
      <div className="cl-turn__days" role="group" aria-label="Días disponibles">
        {WEEK_ORDER.map(n => (
          <button key={n} type="button" aria-pressed={d.days.includes(n)} className={'cl-chip' + (d.days.includes(n) ? ' is-on' : '')} onClick={() => toggleDay(n)}>{WEEKDAYS[n]}</button>
        ))}
      </div>
      <div className="cl-sm-row__btns">
        <label className="cl-check"><input type="checkbox" checked={d.active} onChange={e => setD({ ...d, active: e.target.checked })} /><span>Disponible</span></label>
        <Button size="sm" onClick={save} disabled={!dirty}>Guardar</Button>
        <Button size="sm" variant="ghost" icon="trash" onClick={remove} aria-label={`Eliminar turno ${turn.start}`} />
      </div>
    </li>
  )
}

function Turns() {
  const { turns, addTurns, applyPrice, toast } = useClub()
  const [gen, setGen] = useState({ from: '08:00', to: '23:00', dur: 60, price: 5000 })
  const [bulk, setBulk] = useState({ day: '', night: '' })
  const sorted = [...turns].sort((a, b) => toMin(a.start) - toMin(b.start))

  const generate = e => {
    e.preventDefault()
    const dur = Number(gen.dur)
    const list = []
    for (let m = toMin(gen.from); m + dur <= endMin(gen.to); m += dur) {
      list.push({ start: fromMin(m), end: fromMin(m + dur), price: Number(gen.price), days: [0, 1, 2, 3, 4, 5, 6], active: true })
    }
    if (!list.length) { toast('El rango no alcanza para un turno de esa duración.', 'err'); return }
    const res = addTurns(list)
    toast(res.ok ? `${res.count} turnos agregados` : res.error, res.ok ? 'ok' : 'err')
  }
  const setPrice = (kind, v) => {
    if (v === '' || Number(v) < 0) return
    if (applyPrice(kind, v)) toast('Precios actualizados')
  }

  return (
    <section className="cl-card cl-block">
      <h2>Turnos y precios</h2>
      <p className="cl-block__lead">Estos horarios se ofrecen en todas las canchas habilitadas. Elegí en qué días de la semana está disponible cada turno.</p>

      <div className="cl-sm-tools">
        <form onSubmit={generate} className="cl-sm-tool">
          <h3>Generar turnos</h3>
          <div className="cl-inline">
            <Field label="Desde" type="time" value={gen.from} onChange={e => setGen({ ...gen, from: e.target.value })} />
            <Field label="Hasta" type="time" value={gen.to} onChange={e => setGen({ ...gen, to: e.target.value })} />
            <Field label="Duración" as="select" value={gen.dur} onChange={e => setGen({ ...gen, dur: e.target.value })}>
              <option value="60">60 min</option><option value="90">90 min</option><option value="120">120 min</option>
            </Field>
            <Field label="Precio ($)" type="number" min="0" step="100" value={gen.price} onChange={e => setGen({ ...gen, price: e.target.value })} />
            <Button type="submit" variant="soft" icon="plus">Generar</Button>
          </div>
          <p className="cl-field__hint">Agrega los horarios que no existan; no modifica los actuales.</p>
        </form>

        <div className="cl-sm-tool">
          <h3>Cambiar precios en bloque</h3>
          <div className="cl-inline">
            <Field label={`Antes de las ${NIGHT_FROM}`} type="number" min="0" step="100" value={bulk.day} onChange={e => setBulk({ ...bulk, day: e.target.value })} placeholder="Nuevo precio" />
            <Button variant="soft" onClick={() => setPrice('day', bulk.day)} disabled={bulk.day === ''}>Aplicar</Button>
            <Field label={`Desde las ${NIGHT_FROM}`} type="number" min="0" step="100" value={bulk.night} onChange={e => setBulk({ ...bulk, night: e.target.value })} placeholder="Nuevo precio" />
            <Button variant="soft" onClick={() => setPrice('night', bulk.night)} disabled={bulk.night === ''}>Aplicar</Button>
          </div>
        </div>
      </div>

      {sorted.length ? <ul className="cl-turns">{sorted.map(t => <TurnRow key={t.id + JSON.stringify(t)} turn={t} />)}</ul>
        : <EmptyState title="No hay turnos cargados" text="Generá turnos automáticamente con la herramienta de arriba." />}
    </section>
  )
}

/* ---------- Días cerrados ---------- */
function Closed() {
  const { blocked, addBlocked, removeBlocked, toast } = useClub()
  const [date, setDate] = useState('')
  const [reason, setReason] = useState('')
  const add = e => {
    e.preventDefault()
    if (!date) return
    if (addBlocked({ date, reason: reason.trim() })) { toast('Día cerrado agregado'); setDate(''); setReason('') }
  }
  const upcoming = blocked.filter(b => b.date >= todayYMD())
  return (
    <section className="cl-card cl-block">
      <h2>Días cerrados</h2>
      <p className="cl-block__lead">Feriados, torneos o mantenimiento: ese día nadie podrá reservar. Las reservas ya hechas no se modifican.</p>
      <form className="cl-inline cl-sm-add" onSubmit={add}>
        <Field label="Fecha" type="date" min={todayYMD()} value={date} onChange={e => setDate(e.target.value)} />
        <Field label="Motivo (opcional)" value={reason} onChange={e => setReason(e.target.value)} placeholder="Feriado, torneo..." />
        <Button type="submit" icon="plus" disabled={!date}>Cerrar ese día</Button>
      </form>
      {upcoming.length ? (
        <ul className="cl-closed">
          {upcoming.map(b => (
            <li key={b.date}>
              <span><strong>{formatLong(b.date)}</strong>{b.reason ? `, ${b.reason}` : ''}</span>
              <Button size="sm" variant="ghost" onClick={() => removeBlocked(b.date)}>Reabrir</Button>
            </li>
          ))}
        </ul>
      ) : <p className="cl-field__hint">No hay días cerrados próximos.</p>}
    </section>
  )
}

export default function ScheduleManager() {
  return (
    <div>
      <div className="cl-panel-head">
        <div>
          <h1>Turnos y precios</h1>
          <p>Definí qué horarios se pueden reservar y cuánto cuestan.</p>
        </div>
      </div>
      <Courts />
      <Turns />
      <Closed />
    </div>
  )
}
