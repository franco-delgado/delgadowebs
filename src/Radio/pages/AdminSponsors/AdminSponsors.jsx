import React, { useEffect, useRef, useState } from 'react'
import { getSponsors, saveSponsor, deleteSponsor, makeId } from '../../data/store.js'
import { fileToOptimizedDataUrl } from '../../data/imageUtils.js'
import './AdminSponsors.css'

const MAX_LOGO_WIDTH = 600

const emptySponsor = () => ({ id: '', name: '', url: '', image: '' })

// Pestaña "Sponsors" del panel: alta, edición y baja. Se guarda en localStorage.
export default function AdminSponsors() {
  const [sponsors, setSponsors] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // null = form cerrado

  const refresh = async () => {
    const data = await getSponsors()
    setSponsors(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => {
    refresh()
  }, [])

  const handleSave = async (sponsor) => {
    const res = await saveSponsor(sponsor)
    if (res && res.ok === false) {
      alert(res.error || 'No se pudo guardar el sponsor.')
      return
    }
    await refresh()
    setEditing(null)
  }

  const handleDelete = async (sponsor) => {
    if (!window.confirm(`¿Eliminar a "${sponsor.name}" de los sponsors?`)) return
    const ok = await deleteSponsor(sponsor.id)
    if (ok) await refresh()
    else alert('Hubo un error al intentar eliminar el sponsor.')
  }

  return (
    <>
      <div className="admin-dash__toolbar">
        <p className="admin-dash__count">
          {sponsors.length} {sponsors.length === 1 ? 'sponsor' : 'sponsors'} · guardados en este
          navegador
        </p>
        <button type="button" className="admin-dash__add" onClick={() => setEditing(emptySponsor())}>
          + Agregar sponsor
        </button>
      </div>

      {loading ? (
        <p>Cargando sponsors...</p>
      ) : sponsors.length === 0 ? (
        <div className="admin-dash__empty">
          Todavía no cargaste ningún sponsor. Mientras tanto, el sitio muestra espacios reservados
          con el texto "Tu marca acá". Usá "Agregar sponsor" para cargar el primero.
        </div>
      ) : (
        <ul className="admin-list">
          {sponsors.map((s) => (
            <li key={s.id} className="admin-list__row">
              <span className="admin-sponsor__thumb">
                {s.image ? <img src={s.image} alt="" /> : <span>{s.name.slice(0, 2)}</span>}
              </span>
              <div className="admin-list__main">
                <p className="admin-list__title">{s.name}</p>
                <p className="admin-list__date">{s.url || 'Sin enlace'}</p>
              </div>
              <div className="admin-list__actions">
                <button type="button" onClick={() => setEditing(s)}>
                  Editar
                </button>
                <button type="button" className="admin-list__delete" onClick={() => handleDelete(s)}>
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <SponsorForm initial={editing} onCancel={() => setEditing(null)} onSave={handleSave} />
      )}
    </>
  )
}

function SponsorForm({ initial, onCancel, onSave }) {
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})
  const [imageError, setImageError] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const setField = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setImageError('Elegí un archivo de imagen (png, jpg, svg, etc.).')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError('La imagen pesa demasiado (máximo 5 MB).')
      return
    }

    setImageError('')
    setUploading(true)
    try {
      setField('image', await fileToOptimizedDataUrl(file, MAX_LOGO_WIDTH))
    } catch (err) {
      setImageError(err.message || 'No se pudo procesar la imagen.')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = () => {
    setField('image', '')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const submit = async (e) => {
    e.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = 'El nombre es obligatorio.'
    setErrors(next)
    if (Object.keys(next).length) return
    await onSave({ ...form, id: form.id || makeId() })
  }

  return (
    <div className="news-form__backdrop" onClick={onCancel}>
      <form className="news-form" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className="news-form__header">
          <h2>{initial.id ? 'Editar sponsor' : 'Nuevo sponsor'}</h2>
          <button type="button" className="news-form__close" onClick={onCancel} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div className="news-form__grid">
          <div className="news-form__field news-form__field--full">
            <label htmlFor="sp-name">Nombre del sponsor</label>
            <input
              id="sp-name"
              type="text"
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              placeholder="Ej: Ferretería El Tornillo"
              autoFocus
            />
            {errors.name && <span className="news-form__error">{errors.name}</span>}
          </div>

          <div className="news-form__field news-form__field--full">
            <label htmlFor="sp-url">Enlace (opcional)</label>
            <input
              id="sp-url"
              type="text"
              value={form.url}
              onChange={(e) => setField('url', e.target.value)}
              placeholder="https://www.sitio-del-sponsor.com"
            />
          </div>

          <div className="news-form__field news-form__field--full">
            <label htmlFor="sp-file">Logo (opcional)</label>
            <p className="news-form__image-hint">
              Se recomienda un PNG con fondo transparente o un SVG. Si no cargás logo, se muestra el
              nombre en texto.
            </p>
            <div className="news-form__upload">
              <input
                ref={fileInputRef}
                id="sp-file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {uploading && <p className="news-form__upload-hint">Procesando imagen…</p>}
            </div>
            <input
              type="text"
              value={form.image.startsWith('data:') ? '' : form.image}
              onChange={(e) => setField('image', e.target.value)}
              placeholder="…o pegá la URL de una imagen (https://…)"
              aria-label="URL del logo"
            />
            {imageError && <span className="news-form__error">{imageError}</span>}

            {form.image && (
              <div className="news-form__preview admin-sponsor__preview">
                <img src={form.image} alt="Vista previa del logo" />
                <button type="button" onClick={removeImage} className="news-form__preview-remove">
                  Quitar logo
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="news-form__footer">
          <button type="button" className="news-form__cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="news-form__submit">
            {initial.id ? 'Guardar cambios' : 'Agregar sponsor'}
          </button>
        </div>
      </form>
    </div>
  )
}
