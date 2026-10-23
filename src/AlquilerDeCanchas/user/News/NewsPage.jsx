import { useMemo, useState } from 'react'
import { useClub } from '../../context/ClubContext'
import { sortNews } from '../../utils/format'
import { EmptyState } from '../../components/ui/ui'
import Icon from '../../components/ui/Icon'
import NewsCard from './NewsCard'
import NewsDetail from './NewsDetail'
import './News.css'

export default function NewsPage() {
  const { news } = useClub()
  const [cat, setCat] = useState('Todas')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(null)

  const cats = useMemo(() => ['Todas', ...new Set(news.map(n => n.category))], [news])
  const list = useMemo(() => {
    const term = q.trim().toLowerCase()
    return [...news]
      .filter(n => (cat === 'Todas' || n.category === cat) && (!term || (n.title + ' ' + n.text).toLowerCase().includes(term)))
      .sort(sortNews)
  }, [news, cat, q])

  return (
    <section>
      <h1 className="cl-page-title">Novedades</h1>
      <p className="cl-page-lead">Torneos, ganadores, comunicados y todo lo que pasa en el club.</p>

      <div className="cl-news-tools">
        <div className="cl-chips" role="tablist" aria-label="Categorías">
          {cats.map(c => (
            <button key={c} type="button" role="tab" aria-selected={cat === c} className={'cl-chip' + (cat === c ? ' is-on' : '')} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
        <label className="cl-search">
          <Icon name="search" size={17} />
          <input type="search" placeholder="Buscar novedades" value={q} onChange={e => setQ(e.target.value)} aria-label="Buscar novedades" />
        </label>
      </div>

      {list.length ? (
        <div className="cl-news-grid">{list.map(n => <NewsCard key={n.id} item={n} onOpen={setOpen} />)}</div>
      ) : (
        <EmptyState title="No encontramos novedades" text={news.length ? 'Probá con otra categoría o búsqueda.' : 'Todavía no hay novedades publicadas.'} />
      )}
      {open && <NewsDetail item={open} onClose={() => setOpen(null)} />}
    </section>
  )
}
