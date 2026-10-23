import { useId } from 'react'
import { RESERVATION_STATUS } from '../../config/defaults'
import { useClub } from '../../context/ClubContext'
import Modal from '../Modal/Modal'
import Icon from './Icon'
import './ui.css'

export function Button({ variant = 'primary', size, block, icon, children, className = '', type = 'button', ...props }) {
  const cls = ['cl-btn', 'cl-btn--' + variant, size && 'cl-btn--' + size, block && 'cl-btn--block', className].filter(Boolean).join(' ')
  return (
    <button type={type} className={cls} {...props}>
      {icon && <Icon name={icon} size={size === 'sm' ? 15 : 17} />}
      {children}
    </button>
  )
}

/* Campo de formulario: input, textarea o select con etiqueta, ayuda y error */
export function Field({ label, hint, error, as: Tag = 'input', className = '', children, ...props }) {
  const id = useId()
  const note = error || hint
  return (
    <div className={'cl-field ' + className}>
      <label htmlFor={id}>{label}</label>
      <Tag id={id} aria-invalid={error ? true : undefined} aria-describedby={note ? id + '-n' : undefined} {...props}>
        {children}
      </Tag>
      {note && <p id={id + '-n'} className={error ? 'cl-field__error' : 'cl-field__hint'}>{error || hint}</p>}
    </div>
  )
}

export function StatusBadge({ status }) {
  return <span className={'cl-badge cl-badge--' + status}>{RESERVATION_STATUS[status] || status}</span>
}

export function EmptyState({ title, text, action }) {
  return (
    <div className="cl-empty">
      <p className="cl-empty__title">{title}</p>
      {text && <p className="cl-empty__text">{text}</p>}
      {action}
    </div>
  )
}

/* Diálogo de confirmación: se usa con  await confirm({ title, message, confirmLabel, danger }) */
export function ConfirmHost() {
  const { confirmState, answerConfirm } = useClub()
  if (!confirmState) return null
  const { title, message, confirmLabel = 'Confirmar', danger } = confirmState
  return (
    <Modal title={title} onClose={() => answerConfirm(false)} closeOnBackdrop={false}>
      <p className="cl-confirm__msg">{message}</p>
      <div className="cl-actions cl-actions--end">
        <Button variant="ghost" onClick={() => answerConfirm(false)}>Volver</Button>
        <Button variant={danger ? 'danger' : 'primary'} onClick={() => answerConfirm(true)} autoFocus>{confirmLabel}</Button>
      </div>
    </Modal>
  )
}
