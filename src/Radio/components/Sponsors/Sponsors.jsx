import React from 'react'
import { useSponsors } from '../../data/useSponsors.js'
import { normalizeSponsorUrl } from '../../data/store.js'
import './Sponsors.css'

const PLACEHOLDER_SLOTS = 4

/**
 * Sponsors
 * Franja de sponsors del sitio. Se carga desde el panel admin (pestaña
 * "Sponsors"). Mientras no haya ninguno, muestra espacios reservados.
 *
 * Para moverla de lugar basta con cambiar dónde se escribe <Sponsors />
 * (hoy está al final de la portada y de cada sección, antes del pie).
 */
export default function Sponsors() {
  const sponsors = useSponsors()
  if (sponsors === null) return null

  const hasSponsors = sponsors.length > 0

  return (
    <section className="sponsors" aria-label="Sponsors">
      {/*
      QUITA LA SECCION DE SPONSORS DE ESTA PARTE
      <div className="sponsors__header">
        <span className="sponsors__title">Nuestros sponsors</span>
        <span className="sponsors__line" aria-hidden="true" />
      </div>

      <ul className="sponsors__grid">
        {hasSponsors
          ? sponsors.map((sponsor) => (
              <li key={sponsor.id} className="sponsors__item">
                <SponsorCard sponsor={sponsor} />
              </li>
            ))
          : Array.from({ length: PLACEHOLDER_SLOTS }, (_, i) => (
              <li key={i} className="sponsors__item sponsors__item--slot">
                <span className="sponsors__slot-title">Tu marca acá</span>
                <span className="sponsors__slot-hint">Espacio disponible</span>
              </li>
            ))}
      </ul>*/}
    </section>
  )
}

function SponsorCard({ sponsor }) {
  const content = sponsor.image ? (
    <img src={sponsor.image} alt={sponsor.name} loading="lazy" />
  ) : (
    <span className="sponsors__name">{sponsor.name}</span>
  )

  const href = normalizeSponsorUrl(sponsor.url)
  if (!href) return <div className="sponsors__card">{content}</div>

  return (
    <a
      className="sponsors__card sponsors__card--link"
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      title={sponsor.name}
    >
      {content}
    </a>
  )
}
