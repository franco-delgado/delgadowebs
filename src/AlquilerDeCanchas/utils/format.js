export const money = n => '$' + Number(n || 0).toLocaleString('es-AR')
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7)

export const resCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // sin caracteres confundibles
  let s = ''
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)]
  return s
}

export const digits = s => (s || '').replace(/\D/g, '')

/* Link de WhatsApp. Si el número tiene 10 dígitos se asume Argentina (549 + número). */
export const waLink = (phone, text) => {
  let d = digits(phone).replace(/^0+/, '')
  if (d.length === 10) d = '549' + d
  if (!d) return null
  return `https://wa.me/${d}${text ? `?text=${encodeURIComponent(text)}` : ''}`
}

export const instagramLink = v => {
  if (!v) return null
  if (/^https?:\/\//i.test(v)) return v
  return 'https://instagram.com/' + v.replace(/^@/, '')
}

export const truncate = (s, n) => (s.length > n ? s.slice(0, n).trimEnd() + '…' : s)

export const youtubeId = url => {
  if (!url) return ''
  const m = url.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/)
  return m ? m[1] : ''
}

export const sortNews = (a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.date.localeCompare(a.date)

/* Texto legible (blanco u oscuro) sobre un color de acento */
export const contrastText = hex => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || '')
  if (!m) return '#ffffff'
  const n = parseInt(m[1], 16)
  const L = (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255
  return L > 0.6 ? '#14201b' : '#ffffff'
}
