import React from 'react'
import { useRadio, useAudioEngine } from '../../context/RadioContext.jsx'
import './RadioPlayer.css'

/**
 * RadioPlayer
 * Reproduce el stream de audio configurado por el administrador.
 * variant: "mini" (barra compacta para el header) | "full" (módulo destacado del hero)
 */
export default function RadioPlayer({ radio: radioProp, variant = 'mini', standalone = false }) {
  // Por defecto controla el audio global (persistente entre páginas).
  // Con standalone=true usa un audio propio: se usa en la vista previa del
  // admin para probar una URL que todavía no fue guardada.
  return standalone ? (
    <StandalonePlayer radio={radioProp} variant={variant} />
  ) : (
    <GlobalPlayer variant={variant} />
  )
}

function GlobalPlayer({ variant }) {
  const ctx = useRadio()
  return <PlayerView radio={ctx.radio} variant={variant} {...ctx} />
}

function StandalonePlayer({ radio, variant }) {
  const engine = useAudioEngine(radio?.streamUrl || '')
  return (
    <>
      <audio {...engine.audioProps} />
      <PlayerView radio={radio} variant={variant} {...engine} />
    </>
  )
}

function PlayerView({ radio = {}, variant, playing, loading, error, volume, setVolume, toggle }) {
  const streamUrl = radio?.streamUrl || ''

  const hasStream = Boolean(streamUrl)

  return (
    <div className={`radio-player radio-player--${variant}`}>
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