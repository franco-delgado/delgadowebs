import { formatShort } from '../../utils/dates'
import { truncate, youtubeId } from '../../utils/format'
import Icon from '../../components/ui/Icon'

export function coverOf(item) {
  if (item.images && item.images[0]) return item.images[0]
  const id = youtubeId(item.video)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : ''
}

export default function NewsCard({ item, onOpen }) {
  const cover = coverOf(item)
  return (
    <article className={'cl-ncard' + (cover ? '' : ' cl-ncard--plain')}>
      <button type="button" className="cl-ncard__btn" onClick={() => onOpen(item)}>
        {cover && <span className="cl-ncard__cover"><img src={cover} alt="" loading="lazy" /></span>}
        <span className="cl-ncard__body">
          <span className="cl-ncard__meta">
            <span className="cl-ncard__cat">{item.category}</span>
            <span className="cl-ncard__date">{formatShort(item.date)}</span>
            {item.pinned && <span className="cl-ncard__pin"><Icon name="star" size={13} /> Destacada</span>}
          </span>
          <span className="cl-ncard__title">{item.title}</span>
          <span className="cl-ncard__text">{truncate(item.text, 150)}</span>
        </span>
      </button>
    </article>
  )
}
