import React, { useEffect } from 'react'
import { getCategory, formatDate } from '../../data/store.js'
import './NewsModal.css'

export default function NewsModal({ item, onClose }) {
 /* useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])*/

  if (!item) return null
  const cat = getCategory(item.category)

  return (
    <div className="news-modal__backdrop" onClick={onClose}>
      <div
        className="news-modal"
        role="dialog"
        aria-modal="true"
        aria-label={item.title}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="news-modal__close" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>

        {item.image && (
          <div className="news-modal__media">
            <img src={item.image} alt="" />
          </div>
        )}

        <div className="news-modal__body">
          <div className="news-modal__meta">
            <span className="news-modal__cat" style={{ '--cat-color': cat.color }}>
              {cat.label} · {cat.freq}
            </span>
            <span className="news-modal__date">{formatDate(item.date)}</span>
          </div>

          <h2 className="news-modal__title">{item.title}</h2>
          {item.author && <p className="news-modal__author">Por {item.author}</p>}

          <p className="news-modal__summary">{item.summary}</p>
          <p className="news-modal__content">{item.content}</p>
        </div>
      </div>
    </div>
  )
}
