// ============================================================================
// store.js — Capa de datos de la aplicación.
//
// Usa localStorage como "base de datos" del lado del cliente para que las
// noticias y la configuración de radio que carga el administrador persistan
// y se reflejen en la vista pública (incluso entre pestañas, vía el evento
// "storage"). En un proyecto real esto se reemplazaría por llamadas a una
// API/backend, pero la forma de los datos y las funciones no cambiarían.
// ============================================================================

const NEWS_KEY = 'onda_news_v1'
const RADIO_KEY = 'onda_radio_v1'
const AUTH_KEY = 'onda_admin_auth_v1'

// Contraseña de demo para el panel administrador.
// NOTA: esto es solo una protección de interfaz para la demo.
// En producción, la autenticación debe resolverse en un backend real.
export const ADMIN_PASSWORD = 'radio2026'

export const CATEGORIES = [
  { id: 'finanzas', label: 'Finanzas', freq: '101.3', color: '#F2A93C' },
  { id: 'politica', label: 'Política', freq: '95.7', color: '#2FB8AC' },
  { id: 'deportes', label: 'Deportes', freq: '88.5', color: '#E4483A' },
  { id: 'tecnologia', label: 'Tecnología', freq: '104.9', color: '#7C9EF2' },
  { id: 'cultura', label: 'Cultura', freq: '92.1', color: '#C77DE0' },
  { id: 'internacional', label: 'Internacional', freq: '99.9', color: '#4FCB86' },
]

export function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[0]
}

const SEED_NEWS = [
  {
    id: 'n1',
    category: 'finanzas',
    title: 'El dólar blue cierra la semana con una leve baja',
    summary:
      'La cotización paralela retrocedió tras cinco ruedas al alza, en medio de mayor oferta de divisas del agro.',
    content:
      'La cotización del dólar blue cerró la semana con una leve baja, luego de cinco ruedas consecutivas de subas. Analistas del mercado señalan que la mayor liquidación de divisas del sector agroexportador aportó oferta adicional, mientras que el Banco Central continuó con su estrategia de intervención en el mercado de futuros. De cara a la semana próxima, se espera que la volatilidad se mantenga acotada salvo sorpresas en los datos de inflación.',
    image: '',
    date: '2026-08-20',
    author: 'Redacción Finanzas',
  },
  {
    id: 'n2',
    category: 'politica',
    title: 'El Congreso debate mañana la nueva ley de presupuesto',
    summary:
      'Bloques oficialistas y opositores negocian los últimos artículos antes de la sesión clave de este martes.',
    content:
      'Con la sesión ya convocada, los bloques legislativos afinan los últimos acuerdos sobre los artículos más discutidos del proyecto de presupuesto. Fuentes parlamentarias adelantaron que las partidas de obra pública y coparticipación serán el centro del debate. Se espera una jornada extensa, con oradores de todos los bloques y la posibilidad de un dictamen dividido antes de pasar al recinto.',
    image: '',
    date: '2026-08-21',
    author: 'Redacción Política',
  },
  {
    id: 'n3',
    category: 'deportes',
    title: 'La selección confirmó la lista para las próximas eliminatorias',
    summary:
      'El cuerpo técnico convocó a 26 jugadores, con dos sorpresas en la lista de delanteros.',
    content:
      'El entrenador dio a conocer la nómina de convocados para los próximos dos partidos de las eliminatorias. La lista incluye a dos delanteros que no habían sido citados en el ciclo anterior, y confirma la continuidad del bloque titular que disputó el último torneo. La concentración comenzará el lunes en el predio de la federación.',
    image: '',
    date: '2026-08-19',
    author: 'Redacción Deportes',
  },
  {
    id: 'n4',
    category: 'tecnologia',
    title: 'Una startup local desarrolla un sensor de riego inteligente',
    summary:
      'El dispositivo promete reducir el consumo de agua en cultivos hasta un 30% usando sensores de humedad.',
    content:
      'Un equipo de ingenieros presentó un sensor de bajo costo que mide la humedad del suelo en tiempo real y ajusta automáticamente el riego de cultivos extensivos. Según sus desarrolladores, el sistema ya se probó en parcelas piloto con resultados que muestran un ahorro de agua cercano al 30%, sin afectar el rendimiento de la cosecha. La empresa busca ahora financiamiento para escalar la producción.',
    image: '',
    date: '2026-08-18',
    author: 'Redacción Tecnología',
  },
  {
    id: 'n5',
    category: 'cultura',
    title: 'Vuelve el festival de cine independiente a la ciudad',
    summary:
      'La octava edición proyectará más de 40 películas de directores emergentes de la región.',
    content:
      'El festival regresa con una programación de más de 40 títulos, entre largometrajes y cortos, de realizadores independientes de la región. Habrá funciones al aire libre, charlas con directores y un premio del público. La organización adelantó que este año se suma una sección dedicada exclusivamente al documental.',
    image: '',
    date: '2026-08-17',
    author: 'Redacción Cultura',
  },
  {
    id: 'n6',
    category: 'internacional',
    title: 'Cumbre regional busca acuerdo sobre tarifas comerciales',
    summary:
      'Los ministros de comercio se reúnen esta semana para destrabar el acuerdo pendiente desde 2024.',
    content:
      'Delegaciones de la región se reunirán durante tres días para intentar destrabar un acuerdo comercial que lleva más de dos años en negociación. Los principales puntos de fricción son los aranceles a productos industriales y las cláusulas de origen. Se espera un comunicado conjunto al cierre de la cumbre.',
    image: '',
    date: '2026-08-16',
    author: 'Redacción Internacional',
  },
]

const DEFAULT_RADIO = {
  stationName: 'ONDA',
  slogan: 'Radio & Noticias, 24 horas',
  frequency: '95.5 FM',
  streamUrl: '',
  logoText: 'ON',
  // Datos del servidor Icecast/Shoutcast usados por el modo
  // "Transmitir desde el estudio" (ver StudioBroadcaster). Se guardan acá
  // para que el administrador no tenga que volver a tipearlos cada vez.
  // NOTA: la contraseña de fuente queda en localStorage del navegador del
  // administrador, sin cifrar. Es aceptable para uso personal/demo, pero
  // no se debe compartir ese navegador ni ese equipo con terceros.
  icecastHost: '',
  icecastMount: '',
  icecastUser: 'source',
  icecastPassword: '',
}

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch (e) {
    return fallback
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getNews() {
  const existing = readJSON(NEWS_KEY, null)
  if (existing === null) {
    writeJSON(NEWS_KEY, SEED_NEWS)
    return SEED_NEWS
  }
  return existing
}

export function saveNews(list) {
  writeJSON(NEWS_KEY, list)
}

export function getRadioConfig() {
  const existing = readJSON(RADIO_KEY, null)
  if (existing === null) {
    writeJSON(RADIO_KEY, DEFAULT_RADIO)
    return DEFAULT_RADIO
  }
  return { ...DEFAULT_RADIO, ...existing }
}

export function saveRadioConfig(cfg) {
  writeJSON(RADIO_KEY, cfg)
}

export function isAdminAuthed() {
  return sessionStorage.getItem(AUTH_KEY) === 'true'
}

export function setAdminAuthed(value) {
  if (value) {
    sessionStorage.setItem(AUTH_KEY, 'true')
  } else {
    sessionStorage.removeItem(AUTH_KEY)
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
