import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useClub } from '../../context/ClubContext'
import Icon from '../ui/Icon'
import './Modal.css'

/* Los modales se dibujan en document.body (portal) y con z-index alto, así
   ningún header de la página donde se integre puede tapar el botón de cerrar. */
const stack = []
let savedOverflow = ''

export default function Modal({ title, onClose, wide, closeOnBackdrop = true, children }) {
  const { theme } = useClub()
  const titleId = useId()
  const dialogRef = useRef(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    const token = {}
    if (stack.length === 0) { savedOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden' }
    stack.push(token)
    const onKey = e => {
      if (e.key === 'Escape' && stack[stack.length - 1] === token) closeRef.current()
    }
    window.addEventListener('keydown', onKey)
    const previous = document.activeElement
    if (!dialogRef.current.contains(document.activeElement)) dialogRef.current.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      stack.splice(stack.indexOf(token), 1)
      if (stack.length === 0) document.body.style.overflow = savedOverflow
      if (previous && previous.focus) previous.focus()
    }
  }, [])

  return createPortal(
    <div className="cl-app cl-portal" style={theme}>
      <div className="cl-overlay" onMouseDown={e => { if (closeOnBackdrop && e.target === e.currentTarget) onClose() }}>
        <div className={'cl-modal' + (wide ? ' cl-modal--wide' : '')} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} ref={dialogRef}>
          <div className="cl-modal__head">
            <h2 id={titleId}>{title}</h2>
            <button type="button" className="cl-modal__close" onClick={onClose} aria-label="Cerrar"><Icon name="x" size={20} /></button>
          </div>
          <div className="cl-modal__body">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  )
}
