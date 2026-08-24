import React from 'react'
import { getCategory, formatDate } from '../../data/store.js'
import './FeaturedStory.css'

/**
 * FeaturedStory
 * La nota principal de una portada de sección: imagen grande, título en
 * tipografía de diario y bajada. Es el equivalente al "título de tapa".
 */
export default function FeaturedStory({ item, onOpen }) {
  const cat = getCategory(item.category)

  return (
    <article className="featured-story" style={{ '--cat-color': cat.color }}>
      <button
        type="button"
        className="featured-story__media"
        onClick={() => onOpen(item)}
        aria-label={`Leer: ${item.title}`}
      >
        {item.image ? (
          <img src={item.image} alt="" />
        ) : (
          <span className="featured-story__media-fallback">{cat.freq}</span>
        )}
      </button>

      <div className="featured-story__body">
        <div className="featured-story__meta">
          <span className="featured-story__cat">{cat.label} · {cat.freq}</span>
          <span className="featured-story__date">{formatDate(item.date)}</span>
        </div>

        <h2 className="featured-story__title">
          <button type="button" onClick={() => onOpen(item)}>
            {item.title}
          </button>
        </h2>

        <p className="featured-story__summary">{item.summary}</p>

        {item.author && <p className="featured-story__author">Por {item.author}</p>}

        <button type="button" className="featured-story__link" onClick={() => onOpen(item)}>
          Leer nota completa →
        </button>
      </div>
    </article>
  )
}
