// data/radioEngine.js
//
// Motor de audio ÚNICO de la radio, fuera de React (singleton del módulo).
//
// Como el <audio> no pertenece a ninguna página ni a ningún componente, la
// transmisión NO se corta al cambiar de ventana (portada, finanzas, deportes,
// admin...) aunque la app que la contiene monte y desmonte páginas por su
// cuenta. Los botones de play solo muestran y controlan este estado.
//
// Estado: { url, status, error, volume }
//   url    -> stream que está sonando/cargando ('' si ninguno)
//   status -> 'idle' | 'loading' | 'playing' | 'error'

const listeners = new Set()
let audio = null
let token = 0
let state = { url: '', status: 'idle', error: '', volume: 0.8 }

function setState(patch) {
  state = { ...state, ...patch }
  listeners.forEach((fn) => fn(state))
}

export function getRadioState() {
  return state
}

export function subscribeRadio(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

// Corta la conexión con el stream: al volver a dar play se entra "en vivo"
// y no con audio viejo acumulado en el buffer.
function release() {
  if (!audio) return
  audio.pause()
  audio.removeAttribute('src')
  audio.load()
}

function fail(message) {
  if (state.status === 'error') return
  setState({ status: 'error', error: message })
  release()
}

function ensureAudio() {
  if (audio || typeof Audio === 'undefined') return audio

  audio = new Audio()
  audio.preload = 'none'
  audio.volume = state.volume

  audio.addEventListener('playing', () => {
    if (state.url) setState({ status: 'playing', error: '' })
  })
  const buffering = () => {
    if (state.status === 'playing') setState({ status: 'loading' })
  }
  audio.addEventListener('waiting', buffering)
  audio.addEventListener('stalled', buffering)
  audio.addEventListener('error', () => {
    if (state.url && audio.getAttribute('src')) {
      fail('No se pudo conectar con la señal en vivo.')
    }
  })
  audio.addEventListener('ended', () => {
    if (state.url) fail('Se perdió la conexión con la señal.')
  })
  // Pausa externa (teclas multimedia, auriculares, sistema operativo)
  audio.addEventListener('pause', () => {
    if (state.status === 'playing') stopRadio()
  })

  return audio
}

export async function playRadio(url) {
  if (!url) {
    setState({ url: '', status: 'error', error: 'La radio todavía no tiene una señal conectada.' })
    return
  }
  const a = ensureAudio()
  if (!a) return

  const mine = ++token
  setState({ url, status: 'loading', error: '' })
  a.src = url

  try {
    await a.play()
    if (mine === token && state.status === 'loading') setState({ status: 'playing' })
  } catch (err) {
    if (mine !== token || err?.name === 'AbortError') return
    fail('No se pudo conectar con la señal en vivo.')
  }
}

export function stopRadio() {
  token++
  setState({ url: '', status: 'idle', error: '' })
  release()
}

export function setRadioVolume(value) {
  const v = Math.min(1, Math.max(0, Number(value) || 0))
  setState({ volume: v })
  if (audio) audio.volume = v
}

// Si el administrador cambia la URL del stream mientras suena la anterior,
// se detiene la vieja para que no quede sonando una señal "huérfana".
export function stopIfPlaying(url) {
  if (url && state.url === url && state.status !== 'idle') stopRadio()
}
