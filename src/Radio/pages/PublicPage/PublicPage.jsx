import React, { useEffect, useState } from 'react'
import Header from '../../components/Header/Header.jsx'
import RadioPlayer from '../../components/RadioPlayer/RadioPlayer.jsx'
import NewsTicker from '../../components/NewsTicker/NewsTicker.jsx'
import CategoryNav from '../../components/CategoryNav/CategoryNav.jsx'
import LatestHeadlines from '../../components/LatestHeadlines/LatestHeadlines.jsx'
import FeaturedStory from '../../components/FeaturedStory/FeaturedStory.jsx'
import NewsSection from '../../components/NewsSection/NewsSection.jsx'
import NewsModal from '../../components/NewsModal/NewsModal.jsx'
import { getNews, getRadioConfig, CATEGORIES } from '../../data/store.js'
import './PublicPage.css'

const ITEMS_PER_SECTION = 4

export default function PublicPage() {
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

    // Carga los datos cuando la pestaña recupera el foco
    const onFocus = () => {
      loadData()
    }

    window.addEventListener('focus', onFocus)
    return () => {
      window.removeEventListener('focus', onFocus)
    }
  }, [])

  if (!radio) {
    return null // O podés retornar un spinner/cargando si preferís
  }

  const sorted = [...news].sort((a, b) => (a.date < b.date ? 1 : -1))
  const latest = sorted.slice(0, 6)
  const [mainStory, ...others] = sorted

  return (
    <div className="app-root">
      <Header radio={radio} />
      <NewsTicker items={latest} />
      <CategoryNav active="todas" />

      <main>
        <div className="container">
          <section className="radio-strip">
            <RadioPlayer radio={radio} variant="full" />
          </section>

          {/* <LatestHeadlines items={latest} onOpen={setOpenItem} /> */}

          {mainStory && <FeaturedStory item={mainStory} onOpen={setOpenItem} />}

          {CATEGORIES.map((cat) => {
            const items = others
              .filter((n) => n.category === cat.id)
              .slice(0, ITEMS_PER_SECTION)
            return (
              <NewsSection key={cat.id} category={cat} items={items} onOpen={setOpenItem} />
            )
          })}
        </div>
      </main>

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <span>
            {radio.stationName} · {radio.frequency}
          </span>
          <span className="site-footer__note">
            Redacción y transmisión en vivo, 24 horas.
          </span>
        </div>
      </footer>

      <NewsModal item={openItem} onClose={() => setOpenItem(null)} />
    </div>
  )
}