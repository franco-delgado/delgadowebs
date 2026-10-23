/* Configuración base y datos de ejemplo. Todo lo que el club edita desde el
   panel de administración se guarda por encima de estos valores. */
import { todayYMD } from '../utils/dates'

export const STORAGE_PREFIX = 'club_'

// Contraseña inicial del panel. Cambiala desde Administración > Configuración.
export const DEFAULT_ADMIN_PASSWORD = 'admin1234'

export const NEWS_CATEGORIES = ['Comunicados', 'Torneos', 'Ganadores', 'Eventos', 'General']

export const RESERVATION_STATUS = {
  pendiente: 'Pendiente',
  confirmada: 'Confirmada',
  rechazada: 'Rechazada',
  cancelada: 'Cancelada',
}
// Estados que ocupan el turno (los demás lo liberan)
export const ACTIVE_STATUS = ['pendiente', 'confirmada']

export const ACCENTS = [
  { name: 'Verde cancha', value: '#0f6b4f' },
  { name: 'Azul', value: '#1d4ed8' },
  { name: 'Rojo', value: '#b42323' },
  { name: 'Naranja', value: '#b45309' },
  { name: 'Violeta', value: '#6d3fc4' },
  { name: 'Petróleo', value: '#0e6b7a' },
]

export const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
export const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0] // para mostrar de lunes a domingo

// Los turnos que empiezan antes de esta hora son "de día"; desde esta hora, "de noche"
export const NIGHT_FROM = '19:00'

export const LIMITS = {
  proofMaxBytes: 1.2e6, // PDF de comprobante
  maxActivePerDni: 3, // reservas activas por DNI
  maxNewsImages: 6,
}

export const DEFAULT_SETTINGS = {
  name: 'Club Deportivo',
  tagline: 'Enterate de las novedades del club y reservá tu cancha en minutos.',
  logo: '',
  accent: '#0f6b4f',
  address: '',
  phone: '',
  email: '',
  instagram: '',
  alias: '',
  cbu: '',
  holder: '',
  bank: '',
  rules:
    'La reserva queda pendiente hasta que el club verifique el comprobante de transferencia.\n' +
    'Si necesitás cancelar o cambiar el horario, avisá con al menos 24 horas de anticipación.\n' +
    'Presentá tu DNI al llegar. En caso de lluvia, el club se comunicará con vos para reprogramar.',
  daysAhead: 14,
  passHash: '',
}

export const seedCourts = () => [
  { id: 'c1', name: 'Cancha 1', sport: 'Fútbol 5', active: true },
  { id: 'c2', name: 'Cancha 2', sport: 'pádel', active: true },
]

export const seedTurns = () => {
  const out = []
  for (let h = 8; h < 24; h++) {
    const start = String(h).padStart(2, '0') + ':00'
    const end = String((h + 1) % 24).padStart(2, '0') + ':00'
    out.push({
      id: 't' + start.replace(':', ''),
      start,
      end,
      price: h < 19 ? 4000 : 6000,
      days: [0, 1, 2, 3, 4, 5, 6],
      active: true,
    })
  }
  return out
}

export const seedNews = () => [
  {
    id: 'n1',
    title: 'Ya podés reservar tu cancha online',
    category: 'Comunicados',
    text:
      'Elegí cancha, día y horario, completá tus datos y adjuntá el comprobante de la transferencia. ' +
      'El club revisa tu pago y te avisa por teléfono cuando la reserva queda confirmada.',
    images: [],
    video: '',
    date: todayYMD(),
    pinned: true,
  },
  {
    id: 'n2',
    title: 'Se viene el próximo torneo',
    category: 'Torneos',
    text:
      'Muy pronto publicaremos fechas, categorías e inscripción. ' +
      'Seguí esta sección para enterarte de todos los detalles.',
    images: [],
    video: '',
    date: todayYMD(),
    pinned: false,
  },
]
