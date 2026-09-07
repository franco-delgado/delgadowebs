// ============================================================================
// store.js — Base de datos compartida de GymFlow (localStorage).
//
// Todos los roles (Cliente, Entrenador, Dueño) leen y escriben acá. Como usa
// localStorage, los datos se comparten entre todas las pestañas/roles que
// abras en ESTE navegador/computadora — que es justo lo que se pidió para
// la demo. Para una versión multi-dispositivo real (entrenador en una PC,
// cliente en su celular) esto se reemplazaría por un backend (Firebase,
// Supabase, etc.), pero las funciones de acá abajo (getX/saveX) quedarían
// igual — solo cambiaría lo que hacen por dentro.
// ============================================================================

const KEYS = {
  alumnos: 'gymflow_alumnos_v2',
  entrenadores: 'gymflow_entrenadores_v2',
  grupos: 'gymflow_grupos_v2',
  rutinas: 'gymflow_rutinas_v2',
  servicios: 'gymflow_servicios_v2',
}

const DUENO_ACCOUNT = {
  id: 'dueno-1',
  username: 'dueno',
  password: '1234',
  nombre: 'Alejandro Paz',
  role: 'dueno',
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
  window.dispatchEvent(new StorageEvent('storage', { key }))
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function addMonthsISO(iso, months) {
  const d = new Date(iso + 'T00:00:00')
  d.setMonth(d.getMonth() + months)
  return d.toISOString().slice(0, 10)
}

export function formatFechaCorta(iso) {
  if (!iso) return '—'
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function formatMoneda(valor) {
  return valor.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })
}

// ---------------------------------------------------------------------------
// SERVICIOS / CUOTAS — planes y precios, editables por el Dueño.
// ---------------------------------------------------------------------------

const SEED_SERVICIOS = [
  { id: 1, nombre: 'Básico', precio: 18000 },
  { id: 2, nombre: 'Estándar', precio: 26000 },
  { id: 3, nombre: 'Premium', precio: 34000 },
]

export function getServicios() {
  const existing = readJSON(KEYS.servicios, null)
  if (existing === null) {
    writeJSON(KEYS.servicios, SEED_SERVICIOS)
    return SEED_SERVICIOS
  }
  return existing
}

export function saveServicios(list) {
  writeJSON(KEYS.servicios, list)
}

export function updateServicioPrecio(id, precio) {
  const list = getServicios().map((s) => (s.id === id ? { ...s, precio: Number(precio) } : s))
  saveServicios(list)
  return list
}

export function getPrecioPlan(nombrePlan) {
  const s = getServicios().find((x) => x.nombre === nombrePlan)
  return s ? s.precio : 0
}

// ---------------------------------------------------------------------------
// ENTRENADORES
// ---------------------------------------------------------------------------

const SEED_ENTRENADORES = [
  {
    id: 100,
    username: 'entrenador',
    password: '1234',
    nombre: 'Marcos Ibáñez',
    especialidad: 'Fuerza y rehabilitación',
    jornada: [
      { id: 1, fecha: '25/08/2026', entrada: '07:45', salida: '15:10' },
      { id: 2, fecha: '24/08/2026', entrada: '07:50', salida: '15:05' },
      { id: 3, fecha: '23/08/2026', entrada: '07:48', salida: '15:12' },
    ],
  },
]

export function getEntrenadores() {
  const existing = readJSON(KEYS.entrenadores, null)
  if (existing === null) {
    writeJSON(KEYS.entrenadores, SEED_ENTRENADORES)
    return SEED_ENTRENADORES
  }
  return existing
}

export function saveEntrenadores(list) {
  writeJSON(KEYS.entrenadores, list)
}

export function getEntrenadorById(id) {
  return getEntrenadores().find((e) => e.id === id) || null
}

export function addEntrenador({ nombre, username, password, especialidad }) {
  const list = [
    ...getEntrenadores(),
    { id: Date.now(), nombre, username, password, especialidad, jornada: [] },
  ]
  saveEntrenadores(list)
  return list
}

export function updateEntrenador(id, patch) {
  const list = getEntrenadores().map((e) => (e.id === id ? { ...e, ...patch } : e))
  saveEntrenadores(list)
  return list
}

export function removeEntrenador(id) {
  saveEntrenadores(getEntrenadores().filter((e) => e.id !== id))
  // Los grupos y alumnos que tenían a este entrenador quedan sin asignar.
  saveGrupos(getGrupos().map((g) => (g.entrenadorId === id ? { ...g, entrenadorId: null } : g)))
  saveAlumnos(getAlumnos().map((a) => (a.entrenadorId === id ? { ...a, entrenadorId: null } : a)))
}

export function ficharEntrenador(entrenadorId, { entrada, salida, fecha }) {
  const list = getEntrenadores().map((e) => {
    if (e.id !== entrenadorId) return e
    return { ...e, jornada: [{ id: Date.now(), fecha, entrada, salida }, ...e.jornada] }
  })
  saveEntrenadores(list)
  return list.find((e) => e.id === entrenadorId)
}

// ---------------------------------------------------------------------------
// GRUPOS — para asignar rutinas grupales.
// ---------------------------------------------------------------------------

const SEED_GRUPOS = [
  { id: 1, nombre: 'Grupo Fuerza AM', entrenadorId: 100, alumnoIds: [2, 4] },
]

export function getGrupos() {
  const existing = readJSON(KEYS.grupos, null)
  if (existing === null) {
    writeJSON(KEYS.grupos, SEED_GRUPOS)
    return SEED_GRUPOS
  }
  return existing
}

export function saveGrupos(list) {
  writeJSON(KEYS.grupos, list)
}

export function addGrupo({ nombre, entrenadorId }) {
  const list = [...getGrupos(), { id: Date.now(), nombre, entrenadorId, alumnoIds: [] }]
  saveGrupos(list)
  return list
}

export function updateGrupoMiembros(grupoId, alumnoIds) {
  const list = getGrupos().map((g) => (g.id === grupoId ? { ...g, alumnoIds } : g))
  saveGrupos(list)
  return list
}

export function removeGrupo(grupoId) {
  saveGrupos(getGrupos().filter((g) => g.id !== grupoId))
  saveRutinas(getRutinas().filter((r) => !(r.asignadoA.tipo === 'grupo' && r.asignadoA.grupoId === grupoId)))
}

export function getGrupoDeAlumno(alumnoId) {
  return getGrupos().find((g) => g.alumnoIds.includes(alumnoId)) || null
}

// ---------------------------------------------------------------------------
// ALUMNOS (Clientes)
// ---------------------------------------------------------------------------

const SEED_ALUMNOS = [
  {
    id: 1,
    username: 'cliente',
    password: '1234',
    nombre: 'Lucía Fernández',
    entrenadorId: 100,
    plan: 'Premium',
    fechaProximoPago: addMonthsISO(todayISO(), 0), // vence hoy, para que se vea "por vencer/vencida" en la demo
    asistencias: [],
  },
  {
    id: 2,
    username: 'nahuel',
    password: '1234',
    nombre: 'Nahuel Torres',
    entrenadorId: 100,
    plan: 'Básico',
    fechaProximoPago: addMonthsISO(todayISO(), 1),
    asistencias: [],
  },
  {
    id: 3,
    username: 'camila',
    password: '1234',
    nombre: 'Camila Ríos',
    entrenadorId: 100,
    plan: 'Premium',
    fechaProximoPago: addMonthsISO(todayISO(), -3), // vencida, para mostrar el caso "adeuda"
    asistencias: [],
  },
  {
    id: 4,
    username: 'federico',
    password: '1234',
    nombre: 'Federico Salas',
    entrenadorId: 100,
    plan: 'Estándar',
    fechaProximoPago: addMonthsISO(todayISO(), 1),
    asistencias: [],
  },
]

export function getAlumnos() {
  const existing = readJSON(KEYS.alumnos, null)
  if (existing === null) {
    writeJSON(KEYS.alumnos, SEED_ALUMNOS)
    return SEED_ALUMNOS
  }
  return existing
}

export function saveAlumnos(list) {
  writeJSON(KEYS.alumnos, list)
}

export function getAlumnoById(id) {
  return getAlumnos().find((a) => a.id === id) || null
}

export function addAlumno({ nombre, username, password, plan, entrenadorId }) {
  const list = [
    ...getAlumnos(),
    {
      id: Date.now(),
      nombre,
      username,
      password,
      entrenadorId: entrenadorId || null,
      plan,
      fechaProximoPago: addMonthsISO(todayISO(), 1),
      asistencias: [],
    },
  ]
  saveAlumnos(list)
  return list
}

export function updateAlumno(id, patch) {
  const list = getAlumnos().map((a) => (a.id === id ? { ...a, ...patch } : a))
  saveAlumnos(list)
  return list.find((a) => a.id === id)
}

export function removeAlumno(id) {
  saveAlumnos(getAlumnos().filter((a) => a.id !== id))
  saveGrupos(getGrupos().map((g) => ({ ...g, alumnoIds: g.alumnoIds.filter((aid) => aid !== id) })))
  saveRutinas(getRutinas().filter((r) => !(r.asignadoA.tipo === 'individual' && r.asignadoA.alumnoId === id)))
}

export function registrarPago(alumnoId) {
  return updateAlumno(alumnoId, { fechaProximoPago: addMonthsISO(todayISO(), 1) })
}

export function marcarAsistenciaHoy(alumnoId) {
  const alumno = getAlumnoById(alumnoId)
  if (!alumno) return null
  const hoy = todayISO()
  if (alumno.asistencias.includes(hoy)) return alumno
  return updateAlumno(alumnoId, { asistencias: [...alumno.asistencias, hoy].sort() })
}

// Estado de cuota: 'vencida' | 'por_vencer' (<=5 días) | 'al_dia'
export function getEstadoCuota(alumno) {
  const hoy = new Date(todayISO() + 'T00:00:00')
  const vencimiento = new Date(alumno.fechaProximoPago + 'T00:00:00')
  const diffDias = Math.round((vencimiento - hoy) / (1000 * 60 * 60 * 24))
  if (diffDias < 0) return { estado: 'vencida', diffDias }
  if (diffDias <= 5) return { estado: 'por_vencer', diffDias }
  return { estado: 'al_dia', diffDias }
}

// Rendimiento simple en base a asistencia del mes calendario actual.
export function getRendimiento(alumno) {
  const hoy = new Date()
  const anio = hoy.getFullYear()
  const mes = hoy.getMonth()
  const asistenciasMes = alumno.asistencias.filter((iso) => {
    const d = new Date(iso + 'T00:00:00')
    return d.getFullYear() === anio && d.getMonth() === mes
  })

  // Racha de días consecutivos (calendario) con asistencia, terminando hoy o ayer.
  const set = new Set(alumno.asistencias)
  let racha = 0
  let cursor = new Date()
  while (true) {
    const iso = cursor.toISOString().slice(0, 10)
    if (set.has(iso)) {
      racha += 1
      cursor.setDate(cursor.getDate() - 1)
    } else {
      break
    }
  }

  return {
    asistenciasMes: asistenciasMes.length,
    totalAsistencias: alumno.asistencias.length,
    racha,
  }
}

// ---------------------------------------------------------------------------
// RUTINAS — individuales o grupales, armadas por el entrenador.
// ---------------------------------------------------------------------------

const SEED_RUTINAS = [
  {
    id: 1,
    asignadoA: { tipo: 'individual', alumnoId: 1 },
    actualizada: '20/08/2026',
    notas: 'Progresar carga en tren inferior solo si no hay dolor en la rodilla.',
    dias: [
      {
        id: 'd1',
        nombre: 'Día 1 · Tren superior',
        ejercicios: [
          { id: 'e1', nombre: 'Press banca', series: 4, reps: '8-10', carga: '40kg' },
          { id: 'e2', nombre: 'Remo con barra', series: 4, reps: '10', carga: '35kg' },
        ],
      },
      {
        id: 'd2',
        nombre: 'Día 2 · Tren inferior (cuidado rodilla)',
        ejercicios: [
          { id: 'e3', nombre: 'Prensa (rango parcial)', series: 3, reps: '12', carga: '80kg' },
          { id: 'e4', nombre: 'Isométrico de cuádriceps', series: 3, reps: '30seg', carga: '-' },
        ],
      },
    ],
  },
  {
    id: 2,
    asignadoA: { tipo: 'grupo', grupoId: 1 },
    actualizada: '18/08/2026',
    notas: 'Rutina base del grupo, ajustar cargas por persona en el salón.',
    dias: [
      {
        id: 'd1',
        nombre: 'Full body',
        ejercicios: [
          { id: 'e1', nombre: 'Sentadilla', series: 4, reps: '10', carga: 'A definir' },
          { id: 'e2', nombre: 'Press militar', series: 3, reps: '10', carga: 'A definir' },
        ],
      },
    ],
  },
]

export function getRutinas() {
  const existing = readJSON(KEYS.rutinas, null)
  if (existing === null) {
    writeJSON(KEYS.rutinas, SEED_RUTINAS)
    return SEED_RUTINAS
  }
  return existing
}

export function saveRutinas(list) {
  writeJSON(KEYS.rutinas, list)
}

export function getRutinaIndividual(alumnoId) {
  return getRutinas().find((r) => r.asignadoA.tipo === 'individual' && r.asignadoA.alumnoId === alumnoId) || null
}

export function getRutinaGrupo(grupoId) {
  return getRutinas().find((r) => r.asignadoA.tipo === 'grupo' && r.asignadoA.grupoId === grupoId) || null
}

// La que efectivamente ve el alumno: su rutina individual si existe,
// si no la de su grupo (si pertenece a uno).
export function getRutinaParaAlumno(alumno) {
  const individual = getRutinaIndividual(alumno.id)
  if (individual) return individual
  const grupo = getGrupoDeAlumno(alumno.id)
  if (grupo) return getRutinaGrupo(grupo.id)
  return null
}

export function guardarRutina({ id, asignadoA, notas, dias }) {
  const hoy = formatFechaCorta(todayISO())
  const list = getRutinas()
  const idx = list.findIndex((r) =>
    id ? r.id === id : r.asignadoA.tipo === asignadoA.tipo &&
      (asignadoA.tipo === 'individual' ? r.asignadoA.alumnoId === asignadoA.alumnoId : r.asignadoA.grupoId === asignadoA.grupoId)
  )
  const nueva = { id: id || Date.now(), asignadoA, notas, dias, actualizada: hoy }
  if (idx >= 0) {
    list[idx] = nueva
  } else {
    list.push(nueva)
  }
  saveRutinas(list)
  return nueva
}

// ---------------------------------------------------------------------------
// AUTENTICACIÓN — busca la cuenta entre dueño, entrenadores y alumnos.
// ---------------------------------------------------------------------------

export function findAccount(username, password) {
  const u = username.trim().toLowerCase()

  if (u === DUENO_ACCOUNT.username && password === DUENO_ACCOUNT.password) {
    return { role: 'dueno', profile: DUENO_ACCOUNT }
  }

  const entrenador = getEntrenadores().find((e) => e.username === u && e.password === password)
  if (entrenador) return { role: 'entrenador', profile: entrenador }

  const alumno = getAlumnos().find((a) => a.username === u && a.password === password)
  if (alumno) return { role: 'cliente', profile: alumno }

  return null
}

export function getDemoAccounts() {
  const alumno = getAlumnos()[0]
  const entrenador = getEntrenadores()[0]
  return [
    { role: 'cliente', label: `Cliente (${alumno.nombre.split(' ')[0]})`, username: alumno.username },
    { role: 'entrenador', label: `Entrenador (${entrenador.nombre.split(' ')[0]})`, username: entrenador.username },
    { role: 'dueno', label: 'Dueño del gimnasio', username: DUENO_ACCOUNT.username },
  ]
}
