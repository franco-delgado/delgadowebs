import { useRef, useState } from 'react'
import { ACCENTS } from '../../config/defaults'
import { useClub } from '../../context/ClubContext'
import { Button, Field } from '../../components/ui/ui'
import Logo from '../../components/Logo/Logo'
import { downloadBlob, readImage } from '../../utils/files'
import { storageUsage } from '../../utils/storage'
import './Settings.css'

export default function Settings() {
  const { settings, saveSettings, changePassword, exportBackup, importBackup, confirm, toast } = useClub()
  const [d, setD] = useState(settings)
  const [pw, setPw] = useState({ current: '', next: '', again: '' })
  const [pwError, setPwError] = useState('')
  const logoRef = useRef(null)
  const backupRef = useRef(null)
  const set = k => e => setD(x => ({ ...x, [k]: e.target.value }))

  const save = e => {
    e.preventDefault()
    if (!d.name.trim()) { toast('El club necesita un nombre.', 'err'); return }
    if (saveSettings({ ...d, name: d.name.trim(), daysAhead: Number(d.daysAhead) })) toast('Configuración guardada')
  }

  const pickLogo = async e => {
    const f = e.target.files[0]
    e.target.value = ''
    if (!f) return
    try { setD(x => ({ ...x, logo: '' })); const logo = await readImage(f, 320, 'image/png'); setD(x => ({ ...x, logo })) }
    catch (err) { toast(err.message, 'err') }
  }

  const submitPw = async e => {
    e.preventDefault()
    if (pw.next !== pw.again) { setPwError('Las contraseñas nuevas no coinciden.'); return }
    const res = await changePassword(pw.current, pw.next)
    if (!res.ok) { setPwError(res.error); return }
    setPw({ current: '', next: '', again: '' })
    setPwError('')
    toast('Contraseña actualizada')
  }

  const backup = () => {
    const name = `copia-seguridad-${new Date().toISOString().slice(0, 10)}.json`
    downloadBlob(new Blob([JSON.stringify(exportBackup())], { type: 'application/json' }), name)
  }
  const restore = async e => {
    const f = e.target.files[0]
    e.target.value = ''
    if (!f) return
    let obj
    try { obj = JSON.parse(await f.text()) } catch { toast('El archivo no es válido.', 'err'); return }
    if (!(await confirm({ title: 'Restaurar copia de seguridad', message: 'Se reemplazarán todos los datos actuales (novedades, reservas, turnos y configuración) por los de la copia.', confirmLabel: 'Restaurar', danger: true }))) return
    const res = importBackup(obj)
    if (res.ok) { toast('Copia restaurada'); setTimeout(() => window.location.reload(), 900) } else toast(res.error, 'err')
  }

  const usage = storageUsage()
  const pct = Math.min(100, Math.round((usage.bytes / usage.limit) * 100))

  return (
    <div>
      <div className="cl-panel-head">
        <div>
          <h1>Configuración</h1>
          <p>Datos del club, pago por transferencia y apariencia.</p>
        </div>
      </div>

      <form onSubmit={save} noValidate>
        <section className="cl-card cl-block">
          <h2>Datos del club</h2>
          <div className="cl-form-row">
            <Field label="Nombre del club" value={d.name} onChange={set('name')} />
            <Field label="Dirección" value={d.address} onChange={set('address')} />
            <Field label="Teléfono / WhatsApp" value={d.phone} onChange={set('phone')} hint="Con código de área. Ej: 3825 123456" />
            <Field label="Correo" type="email" value={d.email} onChange={set('email')} />
            <Field label="Instagram" value={d.instagram} onChange={set('instagram')} placeholder="@usuario" />
          </div>
          <div className="cl-form-row cl-form-row--full cl-st__gap">
            <Field label="Frase de bienvenida" value={d.tagline} onChange={set('tagline')} />
          </div>
        </section>

        <section className="cl-card cl-block">
          <h2>Datos para transferir</h2>
          <p className="cl-block__lead">Se muestran a quien reserva para que haga el pago.</p>
          <div className="cl-form-row">
            <Field label="Alias" value={d.alias} onChange={set('alias')} />
            <Field label="CBU / CVU" value={d.cbu} onChange={set('cbu')} inputMode="numeric" />
            <Field label="Titular de la cuenta" value={d.holder} onChange={set('holder')} />
            <Field label="Banco o billetera" value={d.bank} onChange={set('bank')} />
          </div>
        </section>

        <section className="cl-card cl-block">
          <h2>Reservas</h2>
          <div className="cl-form-row">
            <Field label="Días de anticipación para reservar" as="select" value={d.daysAhead} onChange={set('daysAhead')}>
              {[7, 14, 21, 30].map(n => <option key={n} value={n}>{n} días</option>)}
            </Field>
          </div>
          <div className="cl-form-row cl-form-row--full cl-st__gap">
            <Field label="Condiciones de reserva" as="textarea" value={d.rules} onChange={set('rules')} hint="Se muestran en la pantalla de reservas." />
          </div>
        </section>

        <section className="cl-card cl-block">
          <h2>Apariencia</h2>
          <div className="cl-st__brand">
            <div className="cl-st__logo">
              <Logo size={64} />
              <div className="cl-actions">
                <Button variant="ghost" size="sm" icon="image" onClick={() => logoRef.current.click()}>Subir escudo</Button>
                {d.logo && <Button variant="ghost" size="sm" onClick={() => setD(x => ({ ...x, logo: '' }))}>Quitar</Button>}
              </div>
              <input ref={logoRef} type="file" accept="image/*" hidden onChange={pickLogo} />
            </div>
            <div>
              <span className="cl-st__label">Color principal</span>
              <div className="cl-swatches">
                {ACCENTS.map(a => (
                  <button key={a.value} type="button" className={'cl-swatch' + (d.accent === a.value ? ' is-on' : '')} style={{ background: a.value }} aria-label={a.name} aria-pressed={d.accent === a.value} onClick={() => setD(x => ({ ...x, accent: a.value }))} />
                ))}
                <label className="cl-swatch cl-swatch--custom" title="Otro color">
                  <input type="color" value={d.accent} onChange={set('accent')} aria-label="Elegir otro color" />
                </label>
              </div>
            </div>
          </div>
        </section>

        <div className="cl-actions"><Button type="submit" icon="check">Guardar configuración</Button></div>
      </form>

      <section className="cl-card cl-block cl-st__sec">
        <h2>Contraseña del panel</h2>
        <form onSubmit={submitPw} noValidate>
          <div className="cl-form-row">
            <Field label="Contraseña actual" type="password" value={pw.current} onChange={e => setPw({ ...pw, current: e.target.value })} autoComplete="current-password" />
            <Field label="Nueva contraseña" type="password" value={pw.next} onChange={e => setPw({ ...pw, next: e.target.value })} autoComplete="new-password" hint="Mínimo 6 caracteres." />
            <Field label="Repetir nueva contraseña" type="password" value={pw.again} onChange={e => setPw({ ...pw, again: e.target.value })} autoComplete="new-password" />
          </div>
          {pwError && <p className="cl-field__error cl-st__gap" role="alert">{pwError}</p>}
          <div className="cl-actions"><Button type="submit" variant="soft" icon="lock" disabled={!pw.current || !pw.next}>Cambiar contraseña</Button></div>
        </form>
      </section>

      <section className="cl-card cl-block">
        <h2>Copia de seguridad</h2>
        <p className="cl-block__lead">Los datos se guardan en este navegador. Descargá una copia seguido para no perderlos.</p>
        <div className="cl-meter" role="img" aria-label={`Almacenamiento usado: ${pct}%`}><i style={{ width: pct + '%' }} /></div>
        <p className="cl-field__hint">{(usage.bytes / 1048576).toFixed(2)} MB de unos 5 MB disponibles ({pct}%)</p>
        <div className="cl-actions">
          <Button variant="soft" icon="download" onClick={backup}>Descargar copia</Button>
          <Button variant="ghost" icon="upload" onClick={() => backupRef.current.click()}>Restaurar copia</Button>
          <input ref={backupRef} type="file" accept="application/json,.json" hidden onChange={restore} />
        </div>
      </section>
    </div>
  )
}
