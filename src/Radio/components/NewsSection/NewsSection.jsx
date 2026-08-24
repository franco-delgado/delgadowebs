import React from 'react'
import NewsListRow from '../NewsListRow/NewsListRow.jsx'
import './NewsSection.css'

/**
 * NewsSection
 * Un bloque de categoría en la portada: encabezado con el nombre de la
 * sección (link a su portada propia), el listado de las últimas notas de
 * esa categoría, y un link "Ver más". Es el bloque que se repite por cada
 * sección, tal como en la portada de Fénix 951.
 */
export default function NewsSection({ category, items, onOpen }) {
  if (items.length === 0) return null

  return (
    <section className="news-section" style={{ '--cat-color': category.color }}>
      <div className="news-section__header">
        <a href={`#/categoria/${category.id}`} className="news-section__title">
          {category.label}
        </a>
        <span className="news-section__freq">{category.freq} MHz</span>
      </div>

      <div className="news-section__list">
        {items.map((item) => (
          <NewsListRow key={item.id} item={item} onOpen={onOpen} />
        ))}
      </div>

      <a href={`#/categoria/${category.id}`} className="news-section__more">
        Ver más de {category.label} →
      </a>
    </section>
  )
}
