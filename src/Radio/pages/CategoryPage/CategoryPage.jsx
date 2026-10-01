import React, { useEffect, useMemo, useState } from 'react'
import Header from '../../components/Header/Header.jsx'
import NewsTicker from '../../components/NewsTicker/NewsTicker.jsx'
import CategoryNav from '../../components/CategoryNav/CategoryNav.jsx'
import NewsListRow from '../../components/NewsListRow/NewsListRow.jsx'
import NewsModal from '../../components/NewsModal/NewsModal.jsx'

import Sponsors from '../../components/Sponsors/Sponsors.jsx'
import {
  getCategory,
  isValidCategory,
  newsInCategory,
  sortByDateDesc,
} from '../../data/store.js'
import { useNews } from '../../data/useNews.js'
import { useRadio } from '../../context/RadioContext.jsx'
import './CategoryPage.css'

// La sección se toma de la URL (#/categoria/finanzas), que es lo que cambia
// al tocar el menú. Si la URL no la trae, se usa la prop `categoryId`.
// Así la página funciona igual si la dibuja Radio.jsx o App.jsx.
function readCategoryFromUrl() {
  const where = `${window.location.hash} ${window.location.pathname}`
  const match = where.match(/categoria\/([a-z0-9_-]+)/i)
  return match ? match[1].toLowerCase() : ''
}

function useCategoryId(propId) {
  const [fromUrl, setFromUrl] = useState(readCategoryFromUrl)

  useEffect(() => {
    const update = () => setFromUrl(readCategoryFromUrl())
    update()
    window.addEventListener('hashchange', update)
    window.addEventListener('popstate', update)
    return () => {
      window.removeEventListener('hashchange', update)
      window.removeEventListener('popstate', update)
    }
  }, [])

  return fromUrl || propId || ''
}

export default function CategoryPage({ categoryId: categoryIdProp }) {
  const categoryId = useCategoryId(categoryIdProp)
  const news = useNews()
  const { radio } = useRadio()
  const [openItem, setOpenItem] = useState(null)

  // Al cambiar de sección se cierra cualquier nota abierta
  useEffect(() => {
    setOpenItem(null)
  }, [categoryId])

  const valid = isValidCategory(categoryId)
  const cat = getCategory(categoryId)

  // Todas las noticias de esta categoría, de la más nueva a la más vieja
  const sectionNews = useMemo(
    () => (valid ? sortByDateDesc(newsInCategory(news, cat.id)) : []),
    [news, valid, cat.id]
  )

  const latestOverall = sortByDateDesc(news).slice(0, 6)

  return (
    <div className="rapp-root">
      <Header radio={radio} />
      <NewsTicker items={latestOverall} />
      <CategoryNav active={valid ? cat.id : ''} />

      <main>
        <section className="section-page">
          <div className="container">
            <a href="#/Radio" className="section-page__back">
              ← Volver a la portada
            </a>

            <div className="section-page__masthead" style={{ '--cat-color': valid ? cat.color : '#868B94' }}>
              <span className="section-page__freq">{valid ? `${cat.freq} MHz` : '--.- MHz'}</span>
              <h1 className="section-page__title">{valid ? cat.label : 'Sección no encontrada'}</h1>
              <p className="section-page__tagline">
                {valid
                  ? `Todo lo último de la sección ${cat.label.toLowerCase()}.`
                  : 'Elegí una de las secciones del menú de arriba.'}
              </p>
            </div>

            {!valid ? null : sectionNews.length === 0 ? (
              <div className="section-page__empty">
                <p>Todavía no hay noticias publicadas en esta sección.</p>
                <p className="section-page__empty-hint">
                  Volvé a pasar más tarde o mirá otra sección desde el menú de arriba.
                </p>
              </div>
            ) : (
              <div className="section-page__list">
                {sectionNews.map((item) => (
                  <NewsListRow key={item.id} item={item} onOpen={setOpenItem} size="large" />
                ))}
              </div>
            )}

            <Sponsors />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <span>
            {radio.stationName} · {radio.frequency}
          </span>
          <span className="site-footer__note">Redacción y transmisión en vivo, 24 horas.</span>
        </div>
      </footer>

      <NewsModal item={openItem} onClose={() => setOpenItem(null)} />
    </div>
  )
}