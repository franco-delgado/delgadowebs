import React from 'react'
import { CATEGORIES } from '../../data/store.js'
import './CategoryNav.css'

/**
 * CategoryNav
 * Barra de navegación por categorías. Cada botón es un link real que lleva
 * a la portada de esa sección (#/categoria/:id), como en un diario digital.
 * "Todas" vuelve a la portada principal (#/).
 */
export default function CategoryNav({ active }) {
  return (
    <nav className="category-nav" aria-label="Secciones del diario">
      <div className="category-nav__inner">
        <a
          href="#/Radio"
          className={`category-nav__btn ${active === 'todas' ? 'is-active' : ''}`}
          style={{ '--cat-color': '#F5F3EE' }}
        >
          <span className="category-nav__name">Portada</span>
          <span className="category-nav__freq">--.-</span>
        </a>

        {CATEGORIES.map((cat) => (
          <a
            key={cat.id}
            href={`#/categoria/${cat.id}`}
            className={`category-nav__btn ${active === cat.id ? 'is-active' : ''}`}
            style={{ '--cat-color': cat.color }}
          >
            <span className="category-nav__name">{cat.label}</span>
            <span className="category-nav__freq">{cat.freq}</span>
          </a>
        ))}
      </div>
    </nav>
  )
}
