/* Fechas en formato local "YYYY-MM-DD" (sin desfase de zona horaria). */
const pad = n => String(n).padStart(2, '0')

export const toYMD = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const parseYMD = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d) }
export const todayYMD = () => toYMD(new Date())
export const addDays = (ymd, n) => { const d = parseYMD(ymd); d.setDate(d.getDate() + n); return toYMD(d) }

export const toMin = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m }
export const endMin = t => (toMin(t) === 0 ? 1440 : toMin(t)) // "00:00" como fin = medianoche
export const fromMin = m => `${pad(Math.floor(m / 60) % 24)}:${pad(m % 60)}`

export const isPastSlot = (ymd, start) => {
  const today = todayYMD()
  if (ymd < today) return true
  if (ymd > today) return false
  const now = new Date()
  return toMin(start) <= now.getHours() * 60 + now.getMinutes()
}

export const formatLong = ymd =>
  parseYMD(ymd).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
export const formatShort = ymd => {
  const [y, m, d] = ymd.split('-')
  return `${d}/${m}/${y}`
}
export const dayParts = ymd => {
  const d = parseYMD(ymd)
  return {
    wd: d.toLocaleDateString('es-AR', { weekday: 'short' }).replace('.', ''),
    day: d.getDate(),
    mon: d.toLocaleDateString('es-AR', { month: 'short' }).replace('.', ''),
  }
}
export const formatDateTime = iso =>
  new Date(iso).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })
