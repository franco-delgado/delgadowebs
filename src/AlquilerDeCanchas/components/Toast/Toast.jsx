import { createPortal } from 'react-dom'
import { useClub } from '../../context/ClubContext'
import './Toast.css'

export default function ToastHost() {
  const { toasts, theme } = useClub()
  if (!toasts.length) return null
  return createPortal(
    <div className="cl-app cl-portal" style={theme}>
      <div className="cl-toasts" role="status" aria-live="polite">
        {toasts.map(t => <div key={t.id} className={'cl-toast cl-toast--' + t.type}>{t.message}</div>)}
      </div>
    </div>,
    document.body
  )
}
