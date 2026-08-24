import React from 'react'
import { getCategory, formatDate } from '../../data/store.js'
import './NewsListRow.css'

/**
 * NewsListRow
 * Fila de una noticia dentro de un listado, con imagen + título + copete +
 * fecha — el formato clásico de un portal de noticias.
 *
 * size: "compact" (miniatura chica, usado en los bloques de la portada) |
 *       "large" (imagen grande al lado del texto, usado en la portada de
 *       cada sección, para un listado largo y scrolleable)
 */
export default function NewsListRow({ item, onOpen, showCategory = false, size = 'compact' }) {
  const cat = getCategory(item.category)

  return (
    <article className={`news-row news-row--${size}`}>
      <button
        type="button"
        className="news-row__thumb"
        onClick={() => onOpen(item)}
        style={{ '--cat-color': cat.color }}
        aria-label={`Leer: ${item.title}`}
      >
        {item.image ? (
          <img src={item.image} alt="" />
        ) : (
          <span className="news-row__thumb-fallback">{cat.freq}</span>
        )}
      </button>

      <div className="news-row__body">
        {showCategory && (
          <span className="news-row__cat" style={{ '--cat-color': cat.color }}>
            {cat.label}
          </span>
        )}
        <h3 className="news-row__title">
          <button type="button" onClick={() => onOpen(item)}>
            {item.title}
          </button>
        </h3>
        <p className="news-row__summary">{item.summary}</p>
        <span className="news-row__date">{formatDate(item.date)}</span>
      </div>
    </article>
  )
}
