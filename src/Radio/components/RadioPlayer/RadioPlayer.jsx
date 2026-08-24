import React, { useEffect, useRef, useState } from 'react'
import './RadioPlayer.css'

/**
 * RadioPlayer
 * Reproduce el stream de audio configurado por el administrador.
 * variant: "mini" (barra compacta para el header) | "full" (módulo destacado del hero)
 */
export default function RadioPlayer({ radio = {}, variant = 'mini' }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const streamUrl = radio?.streamUrl || ''

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  useEffect(() => {
    setPlaying(false)
    setError('')
    setLoading(false)

    if (audioRef.current) {
      audioRef.current.pause()
      if (streamUrl) {
        audioRef.current.load()
      }
    }
  }, [streamUrl])

  const toggle = async () => {
    if (!streamUrl) {
      setError('La radio todavía no tiene una señal conectada.')
      return
    }

    const audio = audioRef.current
    if (!audio) return

    if (playing) {
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
      if (err.name !== 'AbortError') {
        setError('No se pudo conectar con la señal en vivo.')
      }
      setPlaying(false)
    } finally {
      setLoading(false)
    }
  }

  const hasStream = Boolean(streamUrl)

  return (
    <div className={`radio-player radio-player--${variant}`}>
      <audio
        ref={audioRef}
        src={streamUrl || undefined}
        preload="metadata"
        onWaiting={() => setLoading(true)}
        onPlaying={() => {
          setLoading(false)
          setPlaying(true)
        }}
        onError={(e) => {
          // Solo muestra error si hay un intent de stream activo y un código de error real
          if (streamUrl && e.currentTarget.error) {
            setPlaying(false)
            setLoading(false)
            setError('No se pudo conectar con la señal en vivo.')
          }
        }}
      />

      <button
        type="button"
        className="radio-player__toggle"
        onClick={toggle}
        aria-label={playing ? 'Pausar radio' : 'Escuchar radio en vivo'}
        aria-pressed={playing}
      >
        {loading ? (
          <span className="radio-player__spinner" aria-hidden="true" />
        ) : playing ? (
          <PauseIcon />
        ) : (
          <PlayIcon />
        )}
      </button>

      <div className="radio-player__info">
        <div className="radio-player__row">
          <span className="radio-player__name">{radio?.stationName || 'Radio'}</span>
          <span className="radio-player__freq">{radio?.frequency || ''}</span>
        </div>
        {variant === 'full' && radio?.slogan && (
          <span className="radio-player__slogan">{radio.slogan}</span>
        )}
        <div className="radio-player__status">
          {playing && !error && (
            <span className="pill radio-player__live">
              <span className="live-dot" /> EN VIVO
            </span>
          )}
          {!playing && !error && hasStream && (
            <span className="radio-player__hint">Tocá play para sintonizar</span>
          )}
          {error && <span className="radio-player__error">{error}</span>}
        </div>
      </div>

      {variant === 'full' && (
        <div className="radio-player__volume">
          <VolumeIcon />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            aria-label="Volumen"
          />
        </div>
      )}
    </div>
  )
}

function PlayIcon() {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" aria-hidden="true">
      <path d="M0 0L14 8L0 16V0Z" fill="currentColor" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" aria-hidden="true">
      <rect width="4" height="16" fill="currentColor" />
      <rect x="10" width="4" height="16" fill="currentColor" />
    </svg>
  )
}

function VolumeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 6H4.5L8 3V13L4.5 10H2V6Z" fill="currentColor" />
      <path
        d="M10.5 5.5C11.5 6.5 11.5 9.5 10.5 10.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}