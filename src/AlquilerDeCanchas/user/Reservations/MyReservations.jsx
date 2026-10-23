import { useState } from 'react'
import { useClub } from '../../context/ClubContext'
import { formatLong } from '../../utils/dates'
import { StatusBadge, Button, Field } from '../../components/ui/ui'

const HINT = {
  pendiente: 'Estamos revisando tu comprobante.',
  confirmada: 'Reserva confirmada. Llevá tu DNI.',
  rechazada: 'No pudimos validar el pago. Comunicate con el club.',
  cancelada: 'Reserva cancelada.',
}

export default function MyReservations() {
  const { reservationsByDni } = useClub()
  const [dni, setDni] = useState('')
  const [searched, setSearched] = useState(null)
  const [error, setError] = useState('')

  const search = e => {
    e.preventDefault()
    if (!/^\d{7,8}$/.test(dni)) { setError('Ingresá tu DNI sin puntos.'); setSearched(null); return }
    setError('')
    setSearched(dni)
  }
  const list = searched ? reservationsByDni(searched) : []

  return (
    <div className="cl-card cl-mine">
      <h3>Consultar mi reserva</h3>
      <form onSubmit={search} noValidate>
        <Field label="Tu DNI" value={dni} onChange={e => setDni(e.target.value.replace(/\D/g, ''))} inputMode="numeric" maxLength={8} error={error} />
        <Button type="submit" variant="soft" block className="cl-mine__btn">Buscar</Button>
      </form>
      {searched && (list.length ? (
        <ul className="cl-mine__list">
          {list.map(r => (
            <li key={r.id}>
              <div><strong>{formatLong(r.date)}</strong><StatusBadge status={r.status} /></div>
              <span>{r.start} a {r.end}, {r.courtName}</span>
              <span className="cl-field__hint">Código {r.code}. {HINT[r.status]}</span>
            </li>
          ))}
        </ul>
      ) : <p className="cl-field__hint cl-mine__none">No encontramos reservas con ese DNI.</p>)}
    </div>
  )
}
