import { useRef, useState } from 'react'
import Modal from '../../components/Modal/Modal'
import { Button, Field } from '../../components/ui/ui'
import Icon from '../../components/ui/Icon'
import { useClub } from '../../context/ClubContext'
import { formatLong } from '../../utils/dates'
import { digits, money, waLink } from '../../utils/format'
import { readProof } from '../../utils/files'

const validate = f => {
  const e = {}
  if (f.name.trim().length < 2) e.name = 'Ingresá tu nombre.'
  if (f.surname.trim().length < 2) e.surname = 'Ingresá tu apellido.'
  if (!/^\d{7,8}$/.test(f.dni)) e.dni = 'El DNI debe tener 7 u 8 números, sin puntos.'
  const n = digits(f.phone).length
  if (n < 8 || n > 15) e.phone = 'Ingresá un teléfono válido, con código de área.'
  return e
}

export default function BookingModal({ court, date, turn, onClose }) {
  const { settings, createReservation, toast } = useClub()
  const [step, setStep] = useState('data') // data | pay | done
  const [form, setForm] = useState({ name: '', surname: '', dni: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [proof, setProof] = useState(null)
  const [proofError, setProofError] = useState('')
  const [accept, setAccept] = useState(false)
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState('')
  const [done, setDone] = useState(null)
  const fileRef = useRef(null)

  const set = k => e => setForm(f => ({ ...f, [k]: k === 'dni' ? e.target.value.replace(/\D/g, '') : e.target.value }))

  const next = e => {
    e.preventDefault()
    const errs = validate(form)
    setErrors(errs)
    if (!Object.keys(errs).length) setStep('pay')
  }

  const pickFile = async e => {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    setProofError('')
    try { setProof(await readProof(file)) } catch (err) { setProof(null); setProofError(err.message) }
  }

  const submit = e => {
    e.preventDefault()
    if (!proof) { setProofError('Adjuntá el comprobante de la transferencia.'); return }
    if (!accept) { setFormError('Aceptá las condiciones de reserva para continuar.'); return }
    setBusy(true)
    const res = createReservation({
      courtId: court.id, date, turnId: turn.id, proof,
      name: form.name.trim(), surname: form.surname.trim(), dni: form.dni, phone: form.phone.trim(),
    })
    setBusy(false)
    if (!res.ok) { setFormError(res.error); return }
    setDone(res.reservation)
    setStep('done')
  }

  const copy = async text => {
    try { await navigator.clipboard.writeText(text); toast('Copiado') } catch { toast('No se pudo copiar', 'err') }
  }

  const pay = [
    ['Alias', settings.alias], ['CBU / CVU', settings.cbu], ['Titular', settings.holder], ['Banco', settings.bank],
  ].filter(([, v]) => v)

  const summary = (
    <dl className="cl-summary">
      <div><dt>Cancha</dt><dd>{court.name}{court.sport ? ` (${court.sport})` : ''}</dd></div>
      <div><dt>Día</dt><dd>{formatLong(date)}</dd></div>
      <div><dt>Horario</dt><dd>{turn.start} a {turn.end}</dd></div>
      <div><dt>Importe</dt><dd><strong>{money(turn.price)}</strong></dd></div>
    </dl>
  )

  if (step === 'done') {
    const wa = waLink(settings.phone, `Hola, hice la reserva ${done.code} para ${done.courtName} el ${formatLong(done.date)} a las ${done.start}.`)
    return (
      <Modal title="Reserva enviada" onClose={onClose}>
        <div className="cl-done">
          <span className="cl-done__icon"><Icon name="check" size={28} /></span>
          <p>Recibimos tu solicitud. El club revisará el comprobante y te avisará por teléfono cuando quede confirmada.</p>
          <p className="cl-done__code">Tu código <strong>{done.code}</strong></p>
          <p className="cl-field__hint">Podés consultar el estado desde “Consultar mi reserva” con tu DNI.</p>
        </div>
        {summary}
        <div className="cl-actions cl-actions--end">
          {wa && <a className="cl-btn cl-btn--ghost" href={wa} target="_blank" rel="noreferrer"><Icon name="phone" size={17} />Avisar por WhatsApp</a>}
          <Button onClick={onClose}>Listo</Button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal title={step === 'data' ? 'Tus datos' : 'Pago y comprobante'} onClose={onClose} closeOnBackdrop={false}>
      {summary}
      <p className="cl-booking__step">Paso {step === 'data' ? 1 : 2} de 2</p>

      {step === 'data' ? (
        <form onSubmit={next} noValidate>
          <div className="cl-form-grid">
            <Field label="Nombre" value={form.name} onChange={set('name')} error={errors.name} autoComplete="given-name" autoFocus />
            <Field label="Apellido" value={form.surname} onChange={set('surname')} error={errors.surname} autoComplete="family-name" />
            <Field label="DNI" value={form.dni} onChange={set('dni')} error={errors.dni} inputMode="numeric" maxLength={8} />
            <Field label="Teléfono" type="tel" value={form.phone} onChange={set('phone')} error={errors.phone} hint="Lo usamos solo para avisarte novedades de tu reserva." autoComplete="tel" />
          </div>
          <div className="cl-actions cl-actions--end">
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Continuar</Button>
          </div>
        </form>
      ) : (
        <form onSubmit={submit} noValidate>
          <div className="cl-paybox">
            <h3>Transferí {money(turn.price)} a</h3>
            {pay.length ? (
              <ul>
                {pay.map(([k, v]) => (
                  <li key={k}>
                    <span>{k}</span><strong>{v}</strong>
                    <button type="button" className="cl-copy" onClick={() => copy(v)} aria-label={`Copiar ${k}`}><Icon name="copy" size={16} /></button>
                  </li>
                ))}
              </ul>
            ) : <p className="cl-field__hint">El club todavía no cargó sus datos bancarios. Consultá por teléfono cómo abonar.</p>}
          </div>

          <div className="cl-upload">
            <input ref={fileRef} type="file" accept="image/*,application/pdf" onChange={pickFile} hidden />
            {proof ? (
              <div className="cl-upload__file">
                {proof.type.startsWith('image/') ? <img src={proof.data} alt="Vista previa del comprobante" /> : <Icon name="file" size={28} />}
                <span>{proof.name}</span>
                <Button variant="ghost" size="sm" onClick={() => fileRef.current.click()}>Cambiar</Button>
              </div>
            ) : (
              <Button variant="soft" icon="upload" block onClick={() => fileRef.current.click()}>Adjuntar comprobante (imagen o PDF)</Button>
            )}
            {proofError && <p className="cl-field__error">{proofError}</p>}
          </div>

          <label className="cl-check">
            <input type="checkbox" checked={accept} onChange={e => { setAccept(e.target.checked); setFormError('') }} />
            <span>Acepto las condiciones de reserva del club.</span>
          </label>
          {formError && <p className="cl-field__error cl-booking__err" role="alert">{formError}</p>}

          <div className="cl-actions cl-actions--end">
            <Button variant="ghost" onClick={() => setStep('data')}>Volver</Button>
            <Button type="submit" disabled={busy}>Enviar reserva</Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
