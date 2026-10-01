import React, { useCallback, useEffect, useRef, useState } from 'react'
import { getRadioConfig, getCachedRadioConfig } from '../data/store.js'
import {
  getRadioState,
  subscribeRadio,
  playRadio,
  stopRadio,
  setRadioVolume,
  stopIfPlaying,
} from '../data/radioEngine.js'

/**
 * RadioContext
 *
 * El audio vive en data/radioEngine.js (fuera de React) y la configuración de
 * la radio se guarda a nivel de módulo. Por eso:
 *  - la transmisión NO se corta al navegar entre Portada / Finanzas / Deportes
 *  - useRadio() funciona en CUALQUIER página, esté o no dentro de <RadioProvider>
 *    (por ejemplo cuando App.jsx dibuja CategoryPage por su cuenta).
 *
 * <RadioProvider> se mantiene por compatibilidad, pero ya no es obligatorio.
 */

let radioConfig = getCachedRadioConfig()
let started = false
const configSubscribers = new Set()

async function reloadRadioConfig() {
  const next = await getRadioConfig()
  if (JSON.stringify(next) === JSON.stringify(radioConfig)) return next

  // Si cambió la URL del stream, se detiene la anterior para que no quede sonando
  if (next.streamUrl !== radioConfig.streamUrl) stopIfPlaying(radioConfig.streamUrl)
  radioConfig = next
  configSubscribers.forEach((fn) => fn(radioConfig))
  return next
}

function startConfigSync() {
  if (started) return
  started = true
  reloadRadioConfig()
}

export function useRadio() {
  const [radio, setRadio] = useState(radioConfig)
  const [engine, setEngine] = useState(getRadioState())

  useEffect(() => {
    startConfigSync()
    setRadio(radioConfig)
    setEngine(getRadioState())
    configSubscribers.add(setRadio)
    const unsubscribe = subscribeRadio(setEngine)
    return () => {
      configSubscribers.delete(setRadio)
      unsubscribe()
    }
  }, [])

  const streamUrl = radio.streamUrl || ''
  // ¿El audio del motor es el stream de esta radio?
  const isMine = engine.url === streamUrl
  const playing = isMine && engine.status === 'playing'
  const loading = isMine && engine.status === 'loading'
  const error = isMine && engine.status === 'error' ? engine.error : ''

  const toggle = useCallback(() => {
    if (playing || loading) stopRadio()
    else playRadio(streamUrl)
  }, [playing, loading, streamUrl])

  return {
    radio,
    reloadRadio: reloadRadioConfig,
    playing,
    loading,
    error,
    volume: engine.volume,
    setVolume: setRadioVolume,
    toggle,
  }
}

// Lógica de audio reutilizable (también la usa la vista previa del admin)
export function useAudioEngine(streamUrl) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolumeState] = useState(0.8)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const lastUrlRef = useRef(streamUrl)

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  // Solo se reinicia el audio si la URL del stream realmente cambió
  useEffect(() => {
    if (lastUrlRef.current === streamUrl) return
    lastUrlRef.current = streamUrl
    setPlaying(false)
    setError('')
    setLoading(false)
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      if (streamUrl) audio.load()
    }
  }, [streamUrl])

  const toggle = useCallback(async () => {
    if (!streamUrl) {
      setError('La radio todavía no tiene una señal conectada.')
      return
    }
    const audio = audioRef.current
    if (!audio) return

    if (!audio.paused && !audio.ended) {
      audio.pause()
      setPlaying(false)
      setLoading(false)
      return
    }

    stopRadio() // la vista previa no debe sonar encima de la radio del sitio
    setLoading(true)
    setError('')
    try {
      await audio.play()
      setPlaying(true)
    } catch (err) {
      if (err.name !== 'AbortError') setError('No se pudo conectar con la señal en vivo.')
      setPlaying(false)
    } finally {
      setLoading(false)
    }
  }, [streamUrl])

  const audioProps = {
    ref: audioRef,
    src: streamUrl || undefined,
    preload: 'none',
    onWaiting: () => setLoading(true),
    onPlaying: () => {
      setLoading(false)
      setPlaying(true)
      setError('')
    },
    onPause: () => setPlaying(false),
    onError: (e) => {
      if (streamUrl && e.currentTarget.error) {
        setPlaying(false)
        setLoading(false)
        setError('No se pudo conectar con la señal en vivo.')
      }
    },
  }

  return { audioProps, playing, loading, error, volume, setVolume: setVolumeState, toggle }
}

export function RadioProvider({ children }) {
  // Ya no hace falta para que funcione el audio; solo asegura que la
  // configuración se cargue al abrir la app.
  useEffect(() => {
    startConfigSync()
  }, [])
  return <>{children}</>
}
