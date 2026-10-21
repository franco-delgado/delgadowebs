import { useState, useEffect } from 'react'
import './Entradas.css'
import MensajeWhatsapp from "../components/mensajeWhatsapp.jsx";

/* ===== CONFIGURACIÓN: editá estos datos ===== */
const CFG = {
  nombre: 'Cine Teatro Central',
  wa: '5493825000000',      // WhatsApp con código de país, sin + ni espacios
  pass: 'admin123',         // Clave del administrador (cambiala)
  alias: 'cine.central',
  cbu: '0000000000000000000000',
  titular: 'Cine Teatro Central',
  minutos: 10,              // Duración de la sesión de reserva
}
/* ============================================ */

const get = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }
const put = (k, v) => {
  try { localStorage.setItem(k, JSON.stringify(v)); return true }
  catch { alert('No hay espacio para guardar. Probá con un archivo más liviano.'); return false }
}
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
const money = n => '$' + Number(n).toLocaleString('es-AR')
const when = f => new Date(f.d + 'T' + f.h).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
const day = n => { const x = new Date(); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10) }
const readSes = () => {
  const s = get('cine_s', null)
  if (s && Date.now() > s.exp) { localStorage.removeItem('cine_s'); return null }
  return s
}
const initFuncs = () => {
  const f = get('cine_f', null)
  if (f) return f
  const seed = [
    { id: uid(), t: 'La noche de los espejos', d: day(1), h: '21:00', p: 5000, seats: 40 },
    { id: uid(), t: 'Ciclo de cine nacional: El eco', d: day(2), h: '19:30', p: 4500, seats: 30 },
    { id: uid(), t: 'Obra de teatro: Casa tomada', d: day(3), h: '22:00', p: 7000, seats: 25 },
  ]
  put('cine_f', seed)
  return seed
}

export default function Entradas() {
  const [funcs, setFuncs] = useState(initFuncs)
  const [res, setRes] = useState(() => get('cine_r', []))
  const [ses, setSes] = useState(readSes)
  const [view, setView] = useState(() => (readSes() ? 'book' : null)) // null | book | done | admin
  const [tab, setTab] = useState('res')
  const [q, setQ] = useState('')
  const [proof, setProof] = useState(null)
  const [done, setDone] = useState(null)
  const [msg, setMsg] = useState('')
  const [, setTick] = useState(0)

  // Revisa cada 30 s si la sesión venció y refresca los minutos restantes
  useEffect(() => {
    const t = setInterval(() => {
      if (ses && Date.now() > ses.exp) { localStorage.removeItem('cine_s'); setSes(null) }
      setTick(x => x + 1)
    }, 30000)
    return () => clearInterval(t)
  }, [ses])

  const toast = m => { setMsg(m); setTimeout(() => setMsg(''), 3200) }
  const taken = id => res.filter(r => r.fid === id).reduce((s, r) => s + r.people.length, 0)
  const left = f => f.seats - taken(f.id)
  const sorted = [...funcs].sort((a, b) => (a.d + a.h).localeCompare(b.d + b.h))
  const upcoming = sorted.filter(f => new Date(f.d + 'T' + f.h) >= new Date(Date.now() - 3 * 3600e3))

  const updSes = s => { setSes(s); put('cine_s', s) }
  const clearSes = () => { localStorage.removeItem('cine_s'); setSes(null); setProof(null) }
  const go = (step, extra) => updSes({ ...ses, ...extra, step })
  const close = () => setView(null)

  const start = id => {
    if (ses && ses.fid === id) return setView('book')
    if (ses && !confirm('Tenés otra reserva en curso. ¿Querés cancelarla y empezar una nueva?')) return setView('book')
    updSes({ fid: id, step: 1, qty: 1, people: [], exp: Date.now() + CFG.minutos * 60000 })
    setView('book')
  }
  const cancel = () => {
    if (confirm('¿Cancelar esta reserva? Se borrarán los datos ingresados.')) { clearSes(); close(); toast('Reserva cancelada') }
  }
  const savePeople = e => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const people = Array.from({ length: ses.qty }, (_, i) => ({
      n: fd.get('n' + i).trim(), a: fd.get('a' + i).trim(), d: fd.get('d' + i).trim(),
    }))
    if (new Set(people.map(p => p.d)).size !== people.length) return toast('Hay DNI repetidos en la reserva')
    go(3, { people })
  }
  const pick = e => {
    const file = e.target.files[0]
    if (!file) return
    const rd = new FileReader()
    const done = data => setProof({ name: file.name, type: file.type, data })
    if (file.type.startsWith('image/')) {
      rd.onload = () => {
        const im = new Image()
        im.onload = () => {
          const k = Math.min(1, 1100 / Math.max(im.width, im.height))
          const c = document.createElement('canvas')
          c.width = im.width * k; c.height = im.height * k
          c.getContext('2d').drawImage(im, 0, 0, c.width, c.height)
          done(c.toDataURL('image/jpeg', 0.72))
        }
        im.src = rd.result
      }
    } else {
      if (file.size > 1.2e6) { e.target.value = ''; return toast('El archivo pesa demasiado (máx. 1,2 MB)') }
      rd.onload = () => done(rd.result)
    }
    rd.readAsDataURL(file)
  }
  const confirmRes = () => {
    const f = funcs.find(x => x.id === ses.fid)
    if (left(f) < ses.qty) { clearSes(); close(); return toast('Se agotaron los asientos mientras reservabas') }
    const r = { id: uid().toUpperCase(), fid: f.id, ft: f.t, fd: f.d, fh: f.h, people: ses.people, total: ses.qty * f.p, proof, at: new Date().toISOString() }
    const all = [...res, r]
    if (!put('cine_r', all)) return
    setRes(all); clearSes(); setDone({ r, f }); setView('done')
  }

  /* ---- Admin ---- */
  const adminLogin = () => {
    const p = prompt('Clave de administrador: admin123')
    if (p === null) return
    if (p !== CFG.pass) return toast('Clave incorrecta')
    setTab('res'); setQ(''); setView('admin')
  }
  const addF = e => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const a = [...funcs, { id: uid(), t: fd.get('t').trim(), d: fd.get('d'), h: fd.get('h'), p: +fd.get('p'), seats: +fd.get('s') }]
    setFuncs(a); put('cine_f', a); e.currentTarget.reset(); toast('Función agregada')
  }
  const delF = id => {
    const n = res.filter(r => r.fid === id).length
    if (!confirm(n ? `Esta función tiene ${n} reserva(s). Las reservas se conservan, pero la función dejará de mostrarse. ¿Quitar?` : '¿Quitar esta función?')) return
    const a = funcs.filter(f => f.id !== id)
    setFuncs(a); put('cine_f', a)
  }
  const delR = id => {
    if (!confirm('¿Eliminar esta reserva? Los asientos quedarán libres.')) return
    const a = res.filter(r => r.id !== id)
    setRes(a); put('cine_r', a)
  }

  /* ---- Render helpers (funciones, no componentes, para no perder el foco al escribir) ---- */
  const modal = (wide, content) => (
    <div className="ov">
      <div className={'box' + (wide ? ' wide' : '')}>
        <button className="x" aria-label="Cerrar" onClick={close}>×</button>
        {content}
      </div>
    </div>
  )

  const renderBook = () => {
    if (!ses) return modal(false, <>
      <h2>Tu sesión venció</h2>
      <p className="mut">Pasaron más de {CFG.minutos} minutos. Elegí la función de nuevo para empezar.</p>
      <div className="acts"><button className="btn" onClick={close}>Ver funciones</button></div>
    </>)
    const f = funcs.find(x => x.id === ses.fid)
    if (!f) return modal(false, <>
      <h2>Función no disponible</h2>
      <p className="mut">Esa función ya no está publicada.</p>
      <div className="acts"><button className="btn" onClick={() => { clearSes(); close() }}>Ver funciones</button></div>
    </>)
    const mins = Math.max(1, Math.ceil((ses.exp - Date.now()) / 60000))
    const l = left(f), max = Math.min(l, 10)
    const qty = Math.min(ses.qty || 1, max) || 1
    const cancelBtn = <button className="lnk" type="button" onClick={cancel}>Cancelar reserva</button>

    return modal(false, <>
      <div className="step">Paso {ses.step} de 4</div>
      <h2>{f.t}</h2>
      <p className="mut">{when(f)} · {f.h} h · {money(f.p)} por asiento</p>
      <p className="mut">Tu reserva se guarda por {mins} min más.</p>

      {ses.step === 1 && <>
        <p style={{ marginTop: 14 }}>¿Cuántas personas van a asistir?</p>
        <div className="qty">
          <button className="btn sec" aria-label="Menos" onClick={() => go(1, { qty: Math.max(1, qty - 1) })}>−</button>
          <output>{qty}</output>
          <button className="btn sec" aria-label="Más" onClick={() => go(1, { qty: Math.min(max, qty + 1) })}>+</button>
        </div>
        <p className="mut">Quedan {l} asientos (máximo 10 por reserva).</p>
        <div className="acts">
          <button className="btn" disabled={!max} onClick={() => go(2, { qty })}>Continuar</button>
          {cancelBtn}
        </div>
      </>}

      {ses.step === 2 && (
        <form onSubmit={savePeople}>
          {Array.from({ length: ses.qty }, (_, i) => {
            const p = ses.people[i] || {}
            return (
              <fieldset className="fs" key={i}>
                <legend>Persona {i + 1}</legend>
                <div className="row">
                  <div><label htmlFor={'n' + i}>Nombre</label><input id={'n' + i} name={'n' + i} required autoComplete="off" defaultValue={p.n || ''} /></div>
                  <div><label htmlFor={'a' + i}>Apellido</label><input id={'a' + i} name={'a' + i} required autoComplete="off" defaultValue={p.a || ''} /></div>
                  <div><label htmlFor={'d' + i}>DNI</label><input id={'d' + i} name={'d' + i} required inputMode="numeric" pattern="[0-9]{7,8}" title="7 u 8 números, sin puntos" defaultValue={p.d || ''} /></div>
                </div>
              </fieldset>
            )
          })}
          <div className="acts">
            <button className="btn" type="submit">Aceptar datos</button>
            <button className="btn sec" type="button" onClick={() => go(1)}>Volver</button>
            {cancelBtn}
          </div>
        </form>
      )}

      {ses.step === 3 && <>
        <div className="tot">Total a transferir<b>{money(ses.qty * f.p)}</b><span className="mut">{ses.qty} × {money(f.p)}</span></div>
        <div className="bank"><b>Datos para la transferencia</b><br />Alias: <b>{CFG.alias}</b><br />CBU: {CFG.cbu}<br />Titular: {CFG.titular}</div>
        <p className="mut">Podés salir de la página para transferir. Al volver, vas a seguir exactamente en este punto (durante {CFG.minutos} min). Después tocá “Adjuntar comprobante”.</p>
        <details style={{ marginTop: 10 }}>
          <summary className="mut">Ver datos cargados</summary>
          {ses.people.map((p, i) => <p className="mut" key={i}>{i + 1}. {p.n} {p.a} · DNI {p.d}</p>)}
        </details>
        <div className="acts">
          <button className="btn" onClick={() => go(4)}>Adjuntar comprobante</button>
          <button className="btn sec" onClick={() => go(2)}>Editar datos</button>
          {cancelBtn}
        </div>
      </>}

      {ses.step === 4 && <>
        <div className="tot">Total transferido<b>{money(ses.qty * f.p)}</b></div>
        <label htmlFor="fl">Comprobante de la transferencia (imagen o PDF)</label>
        <input id="fl" type="file" accept="image/*,.pdf" onChange={pick} />
        <p className="mut" style={{ marginTop: 6 }}>{proof ? 'Archivo listo: ' + proof.name : 'Todavía no adjuntaste ningún archivo.'}</p>
        <div className="acts">
          <button className="btn" disabled={!proof} onClick={confirmRes}>Confirmar reserva</button>
          <button className="btn sec" onClick={() => go(3)}>Volver</button>
          {cancelBtn}
        </div>
      </>}
    </>)
  }

  const renderDone = () => modal(false, <>
    <h2 className="ok">¡Reserva confirmada!</h2>
    <p style={{ marginTop: 10 }}>{done.f.t} · {when(done.f)} · {done.f.h} h</p>
    <p className="mut">{done.r.people.length} asiento(s) a nombre de {done.r.people.map(p => p.n + ' ' + p.a).join(', ')}.</p>
    <div className="tot">Tu código de reserva<b>{done.r.id}</b></div>
    <p className="mut">Presentá tu DNI en la entrada. Verificaremos tu comprobante.</p>
    <div className="acts"><button className="btn" onClick={close}>Listo</button></div>
  </>)

  const renderAdmin = () => {
    const list = res.filter(r => !q.trim() || r.people.some(p => p.d.includes(q.trim()))).reverse()
    return modal(true, <>
      <h2>Panel de administración</h2>
      <div className="tabs">
        <button className={'btn ' + (tab === 'res' ? '' : 'sec')} onClick={() => setTab('res')}>Reservas</button>
        <button className={'btn ' + (tab === 'fn' ? '' : 'sec')} onClick={() => setTab('fn')}>Funciones</button>
      </div>

      {tab === 'fn' && <>
        <form onSubmit={addF}>
          <label htmlFor="t">Título</label><input id="t" name="t" required />
          <div className="row">
            <div><label htmlFor="d">Fecha</label><input id="d" name="d" type="date" required /></div>
            <div><label htmlFor="h">Hora de inicio</label><input id="h" name="h" type="time" required /></div>
            <div><label htmlFor="p">Precio por asiento ($)</label><input id="p" name="p" type="number" min="0" required /></div>
          </div>
          <label htmlFor="s">Asientos disponibles</label><input id="s" name="s" type="number" min="1" required />
          <div className="acts"><button className="btn" type="submit">Agregar función</button></div>
        </form>
        <h3 style={{ marginTop: 24 }}>Publicadas</h3>
        {sorted.length ? sorted.map(f => (
          <div className="res" key={f.id}>
            <b>{f.t}</b><br />
            <span className="mut">{when(f)} · {f.h} h · {money(f.p)} · {taken(f.id)}/{f.seats} reservados</span>
            <div className="acts"><button className="btn red" onClick={() => delF(f.id)}>Quitar</button></div>
          </div>
        )) : <p className="mut">No hay funciones.</p>}
      </>}

      {tab === 'res' && <>
        <label htmlFor="q">Buscar por DNI</label>
        <input id="q" inputMode="numeric" placeholder="Ej: 30123456" value={q} onChange={e => setQ(e.target.value)} />
        {list.length ? list.map(r => (
          <div className="res" key={r.id}>
            <b>{r.ft}</b> <span className="mut">· {r.fd} {r.fh} h · Código {r.id}</span>
            <table>
              <thead><tr><th>Nombre</th><th>Apellido</th><th>DNI</th></tr></thead>
              <tbody>{r.people.map((p, i) => <tr key={i}><td>{p.n}</td><td>{p.a}</td><td>{p.d}</td></tr>)}</tbody>
            </table>
            <p style={{ marginTop: 8 }}>Total: <b>{money(r.total)}</b> <span className="mut">· reservado el {new Date(r.at).toLocaleString('es-AR')}</span></p>
            {r.proof.data.startsWith('data:image')
              ? <img src={r.proof.data} alt="Comprobante" onClick={e => e.currentTarget.classList.toggle('big')} />
              : <a className="btn sec" style={{ display: 'inline-block', marginTop: 8, textDecoration: 'none' }} href={r.proof.data} download={r.proof.name}>Descargar comprobante ({r.proof.name})</a>}
            <div className="acts"><button className="btn red" onClick={() => delR(r.id)}>Eliminar reserva</button></div>
          </div>
        )) : <p className="mut" style={{ marginTop: 12 }}>No se encontraron reservas.</p>}
      </>}
    </>)
  }

  return (
    <div className="cine">
      {ses && view === null && (
        <div className="banner">
          <span>Tenés una reserva en curso.</span>
          <button className="btn sec" onClick={() => setView('book')}>Continuar</button>
        </div>
      )}
      <header>
        <h1>{CFG.nombre}</h1>
        <p>Elegí tu función, reservá tus asientos y confirmá con una transferencia. Todo en unos minutos.</p>
      </header>
      <main>
        <h2>Próximas funciones</h2>
        <div className="grid">
          {upcoming.length ? upcoming.map(f => {
            const l = left(f), dt = new Date(f.d + 'T' + f.h)
            return (
              <article className="card" key={f.id}>
                <div className="stub"><b>{dt.getDate()}</b><span>{dt.toLocaleDateString('es-AR', { month: 'short' })}</span></div>
                <div className="cb">
                  <h3>{f.t}</h3>
                  <span className="mut">{when(f)} · {f.h} h</span>
                  <span className="mut">{money(f.p)} por asiento</span>
                  <span className={'tag ' + (l === 0 ? 'out' : l <= 5 ? 'low' : '')}>{l === 0 ? 'Agotada' : l + ' asientos disponibles'}</span>
                  <button className="btn" disabled={l === 0} onClick={() => start(f.id)}>Reservar</button>
                </div>
              </article>
            )
          }) : <p className="mut">Todavía no hay funciones publicadas. Volvé pronto o escribinos por WhatsApp.</p>}
        </div>
      </main>
        <MensajeWhatsapp />
      <footer><button className="lnk" onClick={adminLogin}>Acceso administrador</button></footer>

      {view === 'book' && renderBook()}
      {view === 'done' && done && renderDone()}
      {view === 'admin' && renderAdmin()}
      {msg && <div className="toast" role="status">{msg}</div>}
    </div>
  )
}
