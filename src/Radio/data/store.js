import { supabase } from '../../supabaseRadio'
import { mockNews as MOCK_SEED } from './mockNews.js'

export const ADMIN_PASSWORD = 'radio2026'

export const CATEGORIES = [
  { id: 'finanzas', label: 'Finanzas', color: '#F2A93C', freq: '88.1' },
  { id: 'politica', label: 'Política', color: '#2FB8AC', freq: '90.3' },
  { id: 'deportes', label: 'Deportes', color: '#E4483A', freq: '92.7' },
  { id: 'tecnologia', label: 'Tecnología', color: '#7C9EF2', freq: '97.9' },
  { id: 'cultura', label: 'Cultura', color: '#C77DE0', freq: '101.5' },
  { id: 'internacional', label: 'Internacional', color: '#4FCB86', freq: '104.9' },
]

// Quita tildes y mayúsculas: "Política " -> "politica". Se usa SIEMPRE para
// comparar categorías, así la portada y cada sección coinciden.
export function normalizeCategoryId(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export function isValidCategory(id) {
  const key = normalizeCategoryId(id)
  return CATEGORIES.some((c) => c.id === key)
}

// Categoría neutra para noticias con una categoría que ya no existe
// (antes caían en "Finanzas" y se mostraban con la etiqueta equivocada).
const UNKNOWN_CATEGORY = { id: 'otras', label: 'Otras', color: '#868B94', freq: '--.-' }

export function getCategory(id) {
  const key = normalizeCategoryId(id)
  return CATEGORIES.find((c) => c.id === key) || UNKNOWN_CATEGORY
}

// TODAS las noticias de una categoría (sin excluir ninguna).
export function newsInCategory(list, categoryId) {
  const key = normalizeCategoryId(categoryId)
  return list.filter((n) => normalizeCategoryId(n.category) === key)
}

// Más nuevas primero. El comparador anterior devolvía -1 también cuando las
// fechas eran iguales, lo que deja el orden de esas noticias indefinido.
export function sortByDateDesc(list) {
  return [...list].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}

export const DEFAULT_RADIO = {
  stationName: 'ONDA',
  slogan: 'Radio & Noticias, 24 horas',
  frequency: '95.5 FM',
  streamUrl: 'https://stream.zeno.fm/igo1xjsyu23vv',
  logoText: 'ON',
  icecastHost: '',
  icecastMount: '',
  icecastUser: 'source',
  icecastPassword: '',
}

// ==========================================
// CONFIGURACIÓN DE LA RADIO
// ==========================================

const RADIO_KEY = 'onda_radio_config_v1'

function readLocalRadio() {
  try {
    const raw = localStorage.getItem(RADIO_KEY)
    return raw ? { ...DEFAULT_RADIO, ...JSON.parse(raw) } : null
  } catch (e) {
    return null
  }
}

// Lectura inmediata (sin red) para pintar la página sin parpadeos
export function getCachedRadioConfig() {
  return readLocalRadio() || DEFAULT_RADIO
}

export async function getRadioConfig() {
  const fallback = readLocalRadio() || DEFAULT_RADIO
  try {
    const { data, error } = await supabase
      .from('radio_config')
      .select('*')
      .eq('id', 'main')
      .single()

    if (error || !data) return fallback

    const fromDb = {
      stationName: data.station_name || DEFAULT_RADIO.stationName,
      slogan: data.slogan || DEFAULT_RADIO.slogan,
      frequency: data.frequency || DEFAULT_RADIO.frequency,
      streamUrl: data.stream_url || DEFAULT_RADIO.streamUrl,
      logoText: data.logo_text || DEFAULT_RADIO.logoText,
      icecastHost: data.icecast_host || '',
      icecastMount: data.icecast_mount || '',
      icecastUser: data.icecast_user || 'source',
      icecastPassword: data.icecast_password || '',
    }
    try {
      localStorage.setItem(RADIO_KEY, JSON.stringify(fromDb))
    } catch (e) {
      /* ignorar */
    }
    return fromDb
  } catch (e) {
    console.error('Error cargando radio config:', e)
    return fallback
  }
}

export async function saveRadioConfig(cfg) {
  try {
    localStorage.setItem(RADIO_KEY, JSON.stringify(cfg))
  } catch (e) {
    /* sin espacio / modo privado: se ignora */
  }
  try {
    const { error } = await supabase.from('radio_config').upsert({
      id: 'main',
      station_name: cfg.stationName,
      slogan: cfg.slogan,
      frequency: cfg.frequency,
      stream_url: cfg.streamUrl,
      logo_text: cfg.logoText,
      icecast_host: cfg.icecastHost,
      icecast_mount: cfg.icecastMount,
      icecast_user: cfg.icecastUser,
      icecast_password: cfg.icecastPassword,
      updated_at: new Date().toISOString(),
    })
    if (error) console.error('Error guardando radio config:', error)
  } catch (e) {
    console.error('Error en saveRadioConfig:', e)
  }
}

// ==========================================
// GESTIÓN DE NOTICIAS (100% localStorage, sin Supabase)
// ==========================================
//
// - La primera vez que se abre el sitio se cargan las noticias precargadas
//   de data/mockNews.js y se guardan en localStorage.
// - Desde el panel admin se pueden agregar / editar / eliminar; todo queda
//   guardado en el navegador.
// - "Restaurar noticias de ejemplo" (admin) vuelve al set original.
// -------------------------------------------------------------

const NEWS_KEY = 'onda_news_v1'
const NEWS_SEEDED_KEY = 'onda_news_seeded_v1'
export const NEWS_EVENT = 'onda:news-changed'

const seedCopy = () => MOCK_SEED.map((n) => ({ ...n }))

function readNews() {
  try {
    const raw = localStorage.getItem(NEWS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
    // Primera visita: sembrar las noticias precargadas (solo una vez)
    if (!localStorage.getItem(NEWS_SEEDED_KEY)) {
      const seed = seedCopy()
      localStorage.setItem(NEWS_KEY, JSON.stringify(seed))
      localStorage.setItem(NEWS_SEEDED_KEY, '1')
      return seed
    }
    return []
  } catch (e) {
    console.error('Error leyendo noticias de localStorage:', e)
    return seedCopy() // si localStorage no está disponible, al menos mostrar las precargadas
  }
}

function writeNews(list) {
  try {
    localStorage.setItem(NEWS_KEY, JSON.stringify(list))
    localStorage.setItem(NEWS_SEEDED_KEY, '1')
    window.dispatchEvent(new Event(NEWS_EVENT))
    return { ok: true }
  } catch (e) {
    console.error('Error guardando noticias:', e)
    const quota = e && (e.name === 'QuotaExceededError' || e.code === 22)
    return {
      ok: false,
      error: quota
        ? 'No hay espacio en el navegador. Probá con una imagen más liviana o usá una URL de imagen.'
        : 'No se pudo guardar en el navegador.',
    }
  }
}

export async function getNews() {
  return readNews()
}

export async function saveNews(newsItem) {
  const list = readNews()
  const id = newsItem.id || makeId()
  const record = { ...newsItem, id, image: newsItem.image || '' }
  const exists = list.some((n) => n.id === id)
  const next = exists ? list.map((n) => (n.id === id ? record : n)) : [record, ...list]
  return writeNews(next)
}

export async function deleteNews(id) {
  const res = writeNews(readNews().filter((n) => n.id !== id))
  return res.ok
}

export async function resetNewsToSeed() {
  return writeNews(seedCopy())
}

// ==========================================
// SPONSORS (100% localStorage)
// ==========================================
//
// Se administran desde el panel (pestaña "Sponsors"). Mientras no haya
// ninguno cargado, el sitio muestra espacios reservados "Tu marca acá".
// Formato: { id, name, url, image }   (url e image son opcionales)

const SPONSORS_KEY = 'onda_sponsors_v1'
export const SPONSORS_EVENT = 'onda:sponsors-changed'

function readSponsors() {
  try {
    const raw = localStorage.getItem(SPONSORS_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    console.error('Error leyendo sponsors:', e)
    return []
  }
}

function writeSponsors(list) {
  try {
    localStorage.setItem(SPONSORS_KEY, JSON.stringify(list))
    window.dispatchEvent(new Event(SPONSORS_EVENT))
    return { ok: true }
  } catch (e) {
    console.error('Error guardando sponsors:', e)
    const quota = e && (e.name === 'QuotaExceededError' || e.code === 22)
    return {
      ok: false,
      error: quota
        ? 'No hay espacio en el navegador. Probá con un logo más liviano o usá una URL de imagen.'
        : 'No se pudo guardar en el navegador.',
    }
  }
}

// Solo se aceptan enlaces http/https (evita enlaces tipo "javascript:").
export function normalizeSponsorUrl(url) {
  const value = String(url || '').trim()
  if (!value) return ''
  const withProtocol = /^[a-z][a-z0-9+.-]*:/i.test(value) ? value : `https://${value}`
  return /^https?:\/\//i.test(withProtocol) ? withProtocol : ''
}

export async function getSponsors() {
  return readSponsors()
}

export async function saveSponsor(sponsor) {
  const list = readSponsors()
  const id = sponsor.id || makeId()
  const record = {
    id,
    name: String(sponsor.name || '').trim(),
    url: normalizeSponsorUrl(sponsor.url),
    image: sponsor.image || '',
  }
  const exists = list.some((x) => x.id === id)
  const next = exists ? list.map((x) => (x.id === id ? record : x)) : [...list, record]
  return writeSponsors(next)
}

export async function deleteSponsor(id) {
  return writeSponsors(readSponsors().filter((x) => x.id !== id)).ok
}

// ==========================================
// AUTENTICACIÓN ADMIN Y AUXILIARES
// ==========================================

export function isAdminAuthed() {
  return sessionStorage.getItem('onda_admin_auth_v1') === 'true'
}

export function setAdminAuthed(value) {
  if (value) {
    sessionStorage.setItem('onda_admin_auth_v1', 'true')
  } else {
    sessionStorage.removeItem('onda_admin_auth_v1')
  }
}

export function makeId() {
  return 'n_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

// Fecha de hoy en hora LOCAL (YYYY-MM-DD). toISOString() usa UTC y, de noche
// en Argentina, devolvía la fecha de mañana.
export function todayISO() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function formatDate(isoDate) {
  try {
    const d = new Date(isoDate + 'T00:00:00')
    return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch (e) {
    return isoDate
  }
}