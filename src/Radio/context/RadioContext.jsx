import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { getRadioConfig, getCachedRadioConfig } from '../data/store.js'

/**
 * RadioContext
 * Mantiene UN SOLO <audio> montado en la raíz de la app. Como no pertenece
 * a ninguna página, al navegar entre Portada / Finanzas / Deportes / etc.
 * la transmisión NO se corta. Todos los RadioPlayer (header, portada)
 * son solo botones/indicadores que controlan este mismo audio.
 */
const RadioContext = createContext(null)

export function useRadio() {
  const ctx = useContext(RadioContext)
  if (!ctx) throw new Error('useRadio debe usarse dentro de <RadioProvider>')
  return ctx
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
  const [radio, setRadio] = useState(getCachedRadioConfig)

  const reloadRadio = useCallback(async () => {
    const cfg = await getRadioConfig()
    setRadio(cfg)
  }, [])

  useEffect(() => {
    reloadRadio()
  }, [reloadRadio])

  const engine = useAudioEngine(radio.streamUrl || '')

  const value = {
    radio,
    reloadRadio,
    playing: engine.playing,
    loading: engine.loading,
    error: engine.error,
    volume: engine.volume,
    setVolume: engine.setVolume,
    toggle: engine.toggle,
  }

  return (
    <RadioContext.Provider value={value}>
      {/* Único elemento de audio de toda la app: nunca se desmonta */}
      <audio {...engine.audioProps} />
      {children}
    </RadioContext.Provider>
  )
}
