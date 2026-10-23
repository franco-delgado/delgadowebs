import Modal from '../../components/Modal/Modal'
import { formatLong } from '../../utils/dates'
import { youtubeId } from '../../utils/format'

export default function NewsDetail({ item, onClose }) {
  const vid = youtubeId(item.video)
  const [first, ...rest] = item.images || []
  return (
    <Modal title={item.title} onClose={onClose} wide>
      <p className="cl-ndetail__meta">
        <span className="cl-ncard__cat">{item.category}</span>
        <span className="cl-ncard__date">{formatLong(item.date)}</span>
      </p>
      {first && <img className="cl-ndetail__hero" src={first} alt="" />}
      <div className="cl-ndetail__text">{item.text}</div>
      {rest.length > 0 && (
        <div className="cl-ndetail__gallery">
          {rest.map((src, i) => <img key={i} src={src} alt="" loading="lazy" />)}
        </div>
      )}
      {vid && (
        <div className="cl-ndetail__video">
          <iframe src={`https://www.youtube-nocookie.com/embed/${vid}`} title="Video" allowFullScreen />
        </div>
      )}
    </Modal>
  )
}
