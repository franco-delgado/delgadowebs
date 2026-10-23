import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import {
  ACTIVE_STATUS, DEFAULT_ADMIN_PASSWORD, DEFAULT_SETTINGS, LIMITS, NIGHT_FROM,
  seedCourts, seedNews, seedTurns,
} from '../config/defaults'
import { load, save, session } from '../utils/storage'
import { endMin, isPastSlot, parseYMD, toMin, todayYMD } from '../utils/dates'
import { contrastText, resCode, uid } from '../utils/format'
import { sha256 } from '../utils/hash'

const ClubContext = createContext(null)
export const useClub = () => useContext(ClubContext)

const NO_SPACE = 'No hay espacio para guardar. Probá con imágenes más livianas o eliminá datos antiguos.'

/* Estado persistente: guarda en el almacenamiento y avisa si no hay espacio */
function useStored(key, seed, onFail) {
  const [value, setValue] = useState(() => {
    const stored = load(key)
    if (stored !== null) return stored
    const initial = typeof seed === 'function' ? seed() : seed
    save(key, initial)
    return initial
  })
  const ref = useRef(value)
  const failRef = useRef(onFail)
  failRef.current = onFail
  const set = useCallback(next => {
    const n = typeof next === 'function' ? next(ref.current) : next
    if (!save(key, n)) { failRef.current?.(); return false }
    ref.current = n
    setValue(n)
    return true
  }, [key])
  return [value, set, ref]
}

export function ClubProvider({ children }) {
  /* ---------- avisos y confirmaciones ---------- */
  const [toasts, setToasts] = useState([])
  const toast = useCallback((message, type = 'ok') => {
    const id = uid()
    setToasts(t => [...t, { id, message, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3800)
  }, [])
  const fail = useCallback(() => toast(NO_SPACE, 'err'), [toast])

  const [confirmState, setConfirmState] = useState(null)
  const confirm = useCallback(opts => new Promise(resolve => setConfirmState({ ...opts, resolve })), [])
  const answerConfirm = useCallback(ok => {
    setConfirmState(c => { c?.resolve(ok); return null })
  }, [])

  /* ---------- datos ---------- */
  const [storedSettings, setSettings] = useStored('settings', DEFAULT_SETTINGS, fail)
  const [news, setNews] = useStored('news', seedNews, fail)
  const [courts, setCourts] = useStored('courts', seedCourts, fail)
  const [turns, setTurns] = useStored('turns', seedTurns, fail)
  const [reservations, setReservations, resRef] = useStored('reservations', [], fail)
  const [blocked, setBlocked] = useStored('blocked', [], fail)

  const settings = useMemo(() => ({ ...DEFAULT_SETTINGS, ...storedSettings }), [storedSettings])
  const theme = useMemo(() => ({ '--accent': settings.accent, '--accent-ink': contrastText(settings.accent) }), [settings.accent])
  const activeCourts = useMemo(() => courts.filter(c => c.active), [courts])
  const blockedMap = useMemo(() => Object.fromEntries(blocked.map(b => [b.date, b])), [blocked])
  const pendingCount = useMemo(() => reservations.filter(r => r.status === 'pendiente').length, [reservations])

  /* ---------- navegación ---------- */
  const [view, setView] = useState('home') // home | news | reserve | admin
  const go = useCallback(v => { setView(v); window.scrollTo({ top: 0 }) }, [])

  /* ---------- sesión de administrador ---------- */
  const [isAdmin, setIsAdmin] = useState(() => session.get('admin') === '1')
  const attempts = useRef({ n: 0, until: 0 })

  const login = useCallback(async pass => {
    const a = attempts.current
    if (Date.now() < a.until) {
      return { ok: false, error: `Demasiados intentos. Esperá ${Math.ceil((a.until - Date.now()) / 1000)} segundos.` }
    }
    const target = settings.passHash || (await sha256(DEFAULT_ADMIN_PASSWORD))
    if ((await sha256(pass)) === target) {
      a.n = 0
      session.set('admin', '1')
      setIsAdmin(true)
      return { ok: true }
    }
    a.n += 1
    if (a.n >= 5) { a.n = 0; a.until = Date.now() + 30000 }
    return { ok: false, error: 'Contraseña incorrecta.' }
  }, [settings.passHash])

  const logout = useCallback(() => { session.remove('admin'); setIsAdmin(false); go('home') }, [go])

  const changePassword = useCallback(async (current, next) => {
    const target = settings.passHash || (await sha256(DEFAULT_ADMIN_PASSWORD))
    if ((await sha256(current)) !== target) return { ok: false, error: 'La contraseña actual no es correcta.' }
    if (next.length < 6) return { ok: false, error: 'La nueva contraseña debe tener al menos 6 caracteres.' }
    const passHash = await sha256(next)
    return setSettings(s => ({ ...s, passHash })) ? { ok: true } : { ok: false, error: NO_SPACE }
  }, [settings.passHash, setSettings])

  /* ---------- configuración ---------- */
  const saveSettings = useCallback(patch => setSettings(s => ({ ...s, ...patch })), [setSettings])

  /* ---------- novedades ---------- */
  const saveNews = useCallback(item => {
    const exists = ref => ref.some(n => n.id === item.id)
    return setNews(list => (exists(list) ? list.map(n => (n.id === item.id ? item : n)) : [...list, item]))
  }, [setNews])
  const deleteNews = useCallback(id => setNews(list => list.filter(n => n.id !== id)), [setNews])

  /* ---------- canchas ---------- */
  const saveCourt = useCallback(court => {
    const c = { ...court, id: court.id || 'c' + uid() }
    return setCourts(list => (list.some(x => x.id === c.id) ? list.map(x => (x.id === c.id ? c : x)) : [...list, c]))
  }, [setCourts])
  const deleteCourt = useCallback(id => {
    if (resRef.current.some(r => r.courtId === id)) {
      return { ok: false, error: 'Tiene reservas registradas. Desactivala en lugar de eliminarla.' }
    }
    return { ok: setCourts(list => list.filter(c => c.id !== id)) }
  }, [setCourts, resRef])

  /* ---------- turnos ---------- */
  const validateTurn = (t, list) => {
    if (!t.start || !t.end) return 'Completá el horario de inicio y de fin.'
    if (endMin(t.end) <= toMin(t.start)) return 'El horario de fin debe ser posterior al de inicio.'
    if (!(Number(t.price) >= 0)) return 'Ingresá un precio válido.'
    if (!t.days.length) return 'Elegí al menos un día de la semana.'
    if (list.some(x => x.id !== t.id && x.start === t.start)) return `Ya existe un turno que empieza a las ${t.start}.`
    return ''
  }
  const saveTurn = useCallback(turn => {
    const t = { ...turn, id: turn.id || 't' + uid(), price: Number(turn.price) }
    const error = validateTurn(t, turns)
    if (error) return { ok: false, error }
    return { ok: setTurns(list => (list.some(x => x.id === t.id) ? list.map(x => (x.id === t.id ? t : x)) : [...list, t])) }
  }, [turns, setTurns])
  const addTurns = useCallback(newTurns => {
    const starts = new Set(turns.map(t => t.start))
    const fresh = newTurns.filter(t => !starts.has(t.start)).map(t => ({ ...t, id: 't' + uid() }))
    if (!fresh.length) return { ok: false, error: 'Esos horarios ya existen.' }
    return { ok: setTurns(list => [...list, ...fresh]), count: fresh.length }
  }, [turns, setTurns])
  const deleteTurn = useCallback(id => setTurns(list => list.filter(t => t.id !== id)), [setTurns])
  const applyPrice = useCallback((kind, price) => setTurns(list => list.map(t => {
    const night = toMin(t.start) >= toMin(NIGHT_FROM)
    return kind === 'all' || (kind === 'night') === night ? { ...t, price: Number(price) } : t
  })), [setTurns])

  /* ---------- días cerrados ---------- */
  const addBlocked = useCallback(b => setBlocked(list => [...list.filter(x => x.date !== b.date), b].sort((a, c) => a.date.localeCompare(c.date))), [setBlocked])
  const removeBlocked = useCallback(date => setBlocked(list => list.filter(b => b.date !== date)), [setBlocked])

  /* ---------- disponibilidad y reservas ---------- */
  const isTaken = (list, courtId, date, start) =>
    list.some(r => r.courtId === courtId && r.date === date && r.start === start && ACTIVE_STATUS.includes(r.status))

  const slotsFor = useCallback((courtId, date) => {
    const dow = parseYMD(date).getDay()
    return turns
      .filter(t => t.active && t.days.includes(dow))
      .sort((a, b) => toMin(a.start) - toMin(b.start))
      .map(t => ({
        ...t,
        state: blockedMap[date] ? 'cerrado'
          : isPastSlot(date, t.start) ? 'pasado'
          : isTaken(reservations, courtId, date, t.start) ? 'ocupado' : 'libre',
      }))
  }, [turns, reservations, blockedMap])

  const createReservation = useCallback(input => {
    const court = courts.find(c => c.id === input.courtId && c.active)
    const turn = turns.find(t => t.id === input.turnId && t.active)
    if (!court || !turn) return { ok: false, error: 'Ese turno ya no está disponible.' }
    if (blockedMap[input.date]) return { ok: false, error: 'El club no atiende ese día.' }
    if (!turn.days.includes(parseYMD(input.date).getDay()) || isPastSlot(input.date, turn.start)) {
      return { ok: false, error: 'Ese turno ya no está disponible.' }
    }
    const list = resRef.current
    if (isTaken(list, court.id, input.date, turn.start)) {
      return { ok: false, error: 'Ese turno acaba de ser reservado. Elegí otro horario.' }
    }
    const active = list.filter(r => r.dni === input.dni && ACTIVE_STATUS.includes(r.status) && r.date >= todayYMD()).length
    if (active >= LIMITS.maxActivePerDni) {
      return { ok: false, error: `Ya tenés ${active} reservas activas con ese DNI. Esperá a que se cumplan o consultá con el club.` }
    }
    let code = resCode()
    while (list.some(r => r.code === code)) code = resCode()
    const reservation = {
      id: uid(), code,
      courtId: court.id, courtName: court.name, sport: court.sport,
      date: input.date, turnId: turn.id, start: turn.start, end: turn.end, price: turn.price,
      name: input.name, surname: input.surname, dni: input.dni, phone: input.phone, proof: input.proof,
      status: 'pendiente', createdAt: new Date().toISOString(),
    }
    return setReservations(l => [...l, reservation]) ? { ok: true, reservation } : { ok: false, error: NO_SPACE }
  }, [courts, turns, blockedMap, resRef, setReservations])

  const reservationsByDni = useCallback(dni =>
    reservations.filter(r => r.dni === dni).sort((a, b) => (b.date + b.start).localeCompare(a.date + a.start)), [reservations])

  const setReservationStatus = useCallback((id, status) =>
    setReservations(list => list.map(r => (r.id === id ? { ...r, status } : r))), [setReservations])
  const deleteReservation = useCallback(id => setReservations(list => list.filter(r => r.id !== id)), [setReservations])

  /* ---------- copia de seguridad ---------- */
  const exportBackup = useCallback(() => ({
    app: 'club-reservas', version: 1, exportedAt: new Date().toISOString(),
    data: { settings: storedSettings, news, courts, turns, reservations, blocked },
  }), [storedSettings, news, courts, turns, reservations, blocked])

  const importBackup = useCallback(obj => {
    const d = obj && obj.app === 'club-reservas' ? obj.data : null
    if (!d || !Array.isArray(d.news) || !Array.isArray(d.courts) || !Array.isArray(d.turns) ||
        !Array.isArray(d.reservations) || !Array.isArray(d.blocked) || typeof d.settings !== 'object') {
      return { ok: false, error: 'El archivo no es una copia de seguridad válida.' }
    }
    const ok = [setSettings(d.settings), setNews(d.news), setCourts(d.courts), setTurns(d.turns),
      setReservations(d.reservations), setBlocked(d.blocked)].every(Boolean)
    return ok ? { ok: true } : { ok: false, error: NO_SPACE }
  }, [setSettings, setNews, setCourts, setTurns, setReservations, setBlocked])

  const value = {
    view, go, theme, settings, saveSettings,
    news, saveNews, deleteNews,
    courts, activeCourts, saveCourt, deleteCourt,
    turns, saveTurn, addTurns, deleteTurn, applyPrice,
    blocked, blockedMap, addBlocked, removeBlocked,
    reservations, slotsFor, createReservation, reservationsByDni, setReservationStatus, deleteReservation, pendingCount,
    isAdmin, login, logout, changePassword,
    exportBackup, importBackup,
    toasts, toast, confirm, confirmState, answerConfirm,
  }
  return <ClubContext.Provider value={value}>{children}</ClubContext.Provider>
}
