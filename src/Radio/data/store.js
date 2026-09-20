import { supabase } from '../../supabaseRadio'
import { mockNews as MOCK_SEED } from './mockNews.js'

export const ADMIN_PASSWORD = 'radio2026'

export const CATEGORIES = [
  { id: 'finanzas', label: 'Finanzas', color: '#F2A93C' },
  { id: 'politica', label: 'Política', color: '#2FB8AC' },
  { id: 'deportes', label: 'Deportes', color: '#E4483A' },
  { id: 'tecnologia', label: 'Tecnología', color: '#7C9EF2' },
  { id: 'cultura', label: 'Cultura', color: '#C77DE0' },
  { id: 'internacional', label: 'Internacional', color: '#4FCB86' },
]

export function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[0]
}

const DEFAULT_RADIO = {
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

export async function getRadioConfig() {
  try {
    const { data, error } = await supabase
      .from('radio_config')
      .select('*')
      .eq('id', 'main')
      .single()

    if (error || !data) return DEFAULT_RADIO

    return {
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
  } catch (e) {
    console.error('Error cargando radio config:', e)
    return DEFAULT_RADIO
  }
}

export async function saveRadioConfig(cfg) {
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
// GESTIÓN DE NOTICIAS
// ==========================================

// -------------------------------------------------------------
// MODO DE MUESTRA
// true  -> las noticias salen de data/mockNews.js (no se llama a Supabase).
//          Crear/editar/borrar desde el panel funciona en memoria y se
//          reinicia al recargar la página.
// false -> las noticias vuelven a leerse/guardarse en Supabase (tabla `news`).
// La configuración de la radio NO depende de este interruptor.
// -------------------------------------------------------------
export const USE_MOCK_NEWS = true

let mockStore = MOCK_SEED.map((n) => ({ ...n }))

export async function getNews() {
  if (USE_MOCK_NEWS) return mockStore.map((n) => ({ ...n }))

  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) return []
    return data
  } catch (e) {
    console.error('Error cargando noticias:', e)
    return []
  }
}

export async function saveNews(newsItem) {
  if (USE_MOCK_NEWS) {
    const id = newsItem.id || makeId()
    const record = { ...newsItem, id, image: newsItem.image || '' }
    const exists = mockStore.some((n) => n.id === id)
    mockStore = exists
      ? mockStore.map((n) => (n.id === id ? record : n))
      : [record, ...mockStore]
    return
  }

  try {
    const { error } = await supabase.from('news').upsert({
      id: newsItem.id || makeId(),
      category: newsItem.category,
      title: newsItem.title,
      summary: newsItem.summary,
      content: newsItem.content,
      image: newsItem.image || '',
      date: newsItem.date,
      author: newsItem.author,
    })
    if (error) console.error('Error guardando noticia:', error)
  } catch (e) {
    console.error('Error en saveNews:', e)
  }
}

export async function deleteNews(id) {
  if (USE_MOCK_NEWS) {
    mockStore = mockStore.filter((n) => n.id !== id)
    return true
  }

  try {
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error al eliminar noticia:', error)
      return false
    }
    return true
  } catch (e) {
    console.error('Error en deleteNews:', e)
    return false
  }
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

export function formatDate(isoDate) {
  try {
    const d = new Date(isoDate + 'T00:00:00')
    return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch (e) {
    return isoDate
  }
}