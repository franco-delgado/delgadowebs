import React, { useState } from 'react'
import Header from '../../components/Header/Header.jsx'
import RadioPlayer from '../../components/RadioPlayer/RadioPlayer.jsx'
import NewsTicker from '../../components/NewsTicker/NewsTicker.jsx'
import CategoryNav from '../../components/CategoryNav/CategoryNav.jsx'
import LatestHeadlines from '../../components/LatestHeadlines/LatestHeadlines.jsx'
import FeaturedStory from '../../components/FeaturedStory/FeaturedStory.jsx'
import NewsSection from '../../components/NewsSection/NewsSection.jsx'
import NewsModal from '../../components/NewsModal/NewsModal.jsx'
import Sponsors from '../../components/Sponsors/Sponsors.jsx'
import { CATEGORIES, newsInCategory, sortByDateDesc } from '../../data/store.js'
import { useNews } from '../../data/useNews.js'
import { useRadio } from '../../context/RadioContext.jsx'
import './PublicPage.css'

const ITEMS_PER_SECTION = 4

export default function PublicPage() {
  const news = useNews()
  const { radio } = useRadio()
  const [openItem, setOpenItem] = useState(null)

  const sorted = sortByDateDesc(news)
  const latest = sorted.slice(0, 6)
  const mainStory = sorted[0]

  return (
    <div className="rapp-root">
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

          {/* Cada bloque lista las últimas notas de SU categoría, incluida la
              nota destacada de arriba: lo que sale en la portada también sale
              en su sección. */}
          {CATEGORIES.map((cat) => {
            const items = newsInCategory(sorted, cat.id).slice(0, ITEMS_PER_SECTION)
            return (
              <NewsSection key={cat.id} category={cat} items={items} onOpen={setOpenItem} />
            )
          })}

          <Sponsors />
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