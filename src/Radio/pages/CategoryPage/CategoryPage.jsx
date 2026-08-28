import React, { useEffect, useMemo, useState } from 'react'
import Header from '../../components/Header/Header.jsx'
import NewsTicker from '../../components/NewsTicker/NewsTicker.jsx'
import CategoryNav from '../../components/CategoryNav/CategoryNav.jsx'
import NewsListRow from '../../components/NewsListRow/NewsListRow.jsx'
import NewsModal from '../../components/NewsModal/NewsModal.jsx'
import { getNews, getRadioConfig, getCategory } from '../../data/store.js'
import './CategoryPage.css'

export default function CategoryPage({ categoryId }) {
  const [news, setNews] = useState([])
  const [radio, setRadio] = useState(null)
  const [openItem, setOpenItem] = useState(null)

  const loadData = async () => {
    const [newsData, radioData] = await Promise.all([getNews(), getRadioConfig()])
    setNews(newsData)
    setRadio(radioData)
  }

  useEffect(() => {
    loadData()

    const onFocus = () => {
      loadData()
    }

    window.addEventListener('focus', onFocus)
    return () => {
      window.removeEventListener('focus', onFocus)
    }
  }, [categoryId])

  const cat = getCategory(categoryId)

  const sectionNews = useMemo(() => {
    return [...news]
      .filter((n) => n.category === categoryId)
      .sort((a, b) => (a.date < b.date ? 1 : -1))
  }, [news, categoryId])

  const latestOverall = [...news].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 6)

  if (!radio) {
    return null
  }

  return (
    <div className="rapp-root">
      <Header radio={radio} />
      <NewsTicker items={latestOverall} />
      <CategoryNav active={categoryId} />

      <main>
        <section className="section-page">
          <div className="container">
            <a href="#/" className="section-page__back">
              ← Volver a la portada
            </a>

            <div className="section-page__masthead" style={{ '--cat-color': cat.color }}>
              <span className="section-page__freq">{cat.freq} MHz</span>
              <h1 className="section-page__title">{cat.label}</h1>
              <p className="section-page__tagline">
                Todo lo último de la sección {cat.label.toLowerCase()}.
              </p>
            </div>

            {sectionNews.length === 0 ? (
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