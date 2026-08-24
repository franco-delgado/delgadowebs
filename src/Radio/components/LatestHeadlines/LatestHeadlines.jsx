import React from 'react'
import { getCategory, formatDate } from '../../data/store.js'
import './LatestHeadlines.css'

/**
 * LatestHeadlines
 * Bloque "Lo último": lista de texto con los titulares más recientes de
 * todas las secciones, con su copete breve — el primer bloque que se ve
 * al entrar, como en la portada de referencia.
 */
export default function LatestHeadlines({ items, onOpen }) {
  if (!items || items.length === 0) return null

  return (
    <section className="latest-headlines">
      <div className="latest-headlines__badge">
        <span className="live-dot" /> LO ÚLTIMO
      </div>
      <ul className="latest-headlines__list">
        {items.map((item) => {
          const cat = getCategory(item.category)
          return (
            <li key={item.id} className="latest-headlines__item">
              <button type="button" onClick={() => onOpen(item)}>
                <span className="latest-headlines__title">{item.title}</span>
                <span className="latest-headlines__meta">
                  <span style={{ color: cat.color }}>{cat.label}</span>
                  <span className="latest-headlines__dot">·</span>
                  <span>{formatDate(item.date)}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
