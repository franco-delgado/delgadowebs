import React from 'react'
import './NewsTicker.css'

export default function NewsTicker({ items }) {
  if (!items || items.length === 0) return null

  // Se duplica el contenido para lograr un loop continuo sin cortes.
  const track = [...items, ...items]

  return (
    <div className="news-ticker" role="marquee" aria-label="Últimas noticias">
      <span className="news-ticker__label">
        <span className="live-dot" /> ÚLTIMO MOMENTO
      </span>
      <div className="news-ticker__viewport">
        <div className="news-ticker__track">
          {track.map((item, i) => (
            <span className="news-ticker__item" key={i}>
              {item.title}
              <span className="news-ticker__dot">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
