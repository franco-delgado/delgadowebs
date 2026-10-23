import { useRef, useState } from 'react'
import { LIMITS, NEWS_CATEGORIES } from '../../config/defaults'
import { useClub } from '../../context/ClubContext'
import { Button, EmptyState, Field } from '../../components/ui/ui'
import Icon from '../../components/ui/Icon'
import { formatShort, todayYMD } from '../../utils/dates'
import { readImage } from '../../utils/files'
import { sortNews, uid, youtubeId } from '../../utils/format'
import './NewsManager.css'

const blank = () => ({ id: '', title: '', category: NEWS_CATEGORIES[0], text: '', images: [], video: '', date: todayYMD(), pinned: false })

export default function NewsManager() {
  const { news, saveNews, deleteNews, confirm, toast } = useClub()
  const [form, setForm] = useState(blank)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const fileRef = useRef(null)
  const formRef = useRef(null)
  const editing = !!form.id

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const addImages = async e => {
    const files = Array.from(e.target.files)
    e.target.value = ''
    if (!files.length) return
    const room = LIMITS.maxNewsImages - form.images.length
    if (room <= 0) { toast(`Máximo ${LIMITS.maxNewsImages} fotos por novedad.`, 'err'); return }
    setBusy(true)
    try {
      const imgs = await Promise.all(files.slice(0, room).map(f => readImage(f, 1200)))
      setForm(f => ({ ...f, images: [...f.images, ...imgs] }))
      if (files.length > room) toast(`Solo se agregaron ${room} fotos (máximo ${LIMITS.maxNewsImages}).`, 'err')
    } catch (err) { toast(err.message, 'err') }
    setBusy(false)
  }

  const submit = e => {
    e.preventDefault()
    const errs = {}
    if (!form.title.trim()) errs.title = 'Escribí un título.'
    if (!form.text.trim()) errs.text = 'Escribí el texto de la novedad.'
    if (form.video.trim() && !youtubeId(form.video)) errs.video = 'No reconocemos ese link de YouTube.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    const item = { ...form, id: form.id || uid(), title: form.title.trim(), text: form.text.trim(), video: form.video.trim() }
    if (saveNews(item)) {
      toast(editing ? 'Novedad actualizada' : 'Novedad publicada')
      setForm(blank())
    }
  }

  const edit = n => {
    setForm({ ...blank(), ...n })
    setErrors({})
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const cancel = () => { setForm(blank()); setErrors({}) }

  const remove = async n => {
    if (await confirm({ title: 'Eliminar novedad', message: `Se eliminará “${n.title}”. No se puede deshacer.`, confirmLabel: 'Eliminar', danger: true })) {
      deleteNews(n.id)
      if (form.id === n.id) cancel()
      toast('Novedad eliminada')
    }
  }

  return (
    <div>
      <div className="cl-panel-head">
        <div>
          <h1>Novedades</h1>
          <p>Publicá torneos, ganadores y avisos con texto y fotos.</p>
        </div>
      </div>

      <form ref={formRef} className="cl-card cl-block" onSubmit={submit} noValidate>
        <h2>{editing ? 'Editar novedad' : 'Nueva novedad'}</h2>
        <div className="cl-form-row">
          <Field label="Título" value={form.title} onChange={set('title')} error={errors.title} maxLength={120} />
          <Field label="Categoría" as="select" value={form.category} onChange={set('category')}>
            {NEWS_CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </Field>
          <Field label="Fecha" type="date" value={form.date} onChange={set('date')} />
        </div>
        <div className="cl-form-row cl-form-row--full cl-nm__gap">
          <Field label="Texto" as="textarea" value={form.text} onChange={set('text')} error={errors.text} />
        </div>

        <div className="cl-nm__photos">
          <span className="cl-nm__label">Fotos ({form.images.length}/{LIMITS.maxNewsImages})</span>
          <div className="cl-nm__thumbs">
            {form.images.map((src, i) => (
              <div key={i} className="cl-nm__thumb">
                <img src={src} alt={`Foto ${i + 1}`} />
                <button type="button" aria-label={`Quitar foto ${i + 1}`} onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}><Icon name="x" size={14} /></button>
              </div>
            ))}
            {form.images.length < LIMITS.maxNewsImages && (
              <button type="button" className="cl-nm__add" disabled={busy} onClick={() => fileRef.current.click()}>
                <Icon name="image" size={22} /><span>{busy ? 'Procesando' : 'Agregar fotos'}</span>
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={addImages} />
        </div>

        <div className="cl-form-row cl-nm__gap">
          <Field label="Video de YouTube (opcional)" placeholder="https://youtube.com/watch?v=..." value={form.video} onChange={set('video')} error={errors.video} />
          <label className="cl-check cl-nm__pin">
            <input type="checkbox" checked={form.pinned} onChange={e => setForm(f => ({ ...f, pinned: e.target.checked }))} />
            <span>Destacar (aparece primero)</span>
          </label>
        </div>

        <div className="cl-actions">
          <Button type="submit" icon={editing ? 'check' : 'plus'} disabled={busy}>{editing ? 'Guardar cambios' : 'Publicar novedad'}</Button>
          {editing && <Button variant="ghost" onClick={cancel}>Cancelar edición</Button>}
        </div>
      </form>

      <section className="cl-block">
        <h2>Publicadas ({news.length})</h2>
        {news.length ? (
          <ul className="cl-nlist">
            {[...news].sort(sortNews).map(n => (
              <li key={n.id} className="cl-card cl-nrow">
                {n.images[0] ? <img src={n.images[0]} alt="" /> : <span className="cl-nrow__ph"><Icon name="news" size={22} /></span>}
                <div className="cl-nrow__info">
                  <strong>{n.title}</strong>
                  <span>{n.category}, {formatShort(n.date)}{n.pinned ? ', destacada' : ''}</span>
                </div>
                <div className="cl-nrow__actions">
                  <Button size="sm" variant="ghost" icon="edit" onClick={() => edit(n)}>Editar</Button>
                  <Button size="sm" variant="ghost" icon="trash" onClick={() => remove(n)}>Eliminar</Button>
                </div>
              </li>
            ))}
          </ul>
        ) : <EmptyState title="No hay novedades publicadas" text="Usá el formulario de arriba para publicar la primera." />}
      </section>
    </div>
  )
}
