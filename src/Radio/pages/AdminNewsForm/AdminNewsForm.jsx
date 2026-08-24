import React, { useRef, useState } from 'react'
import { CATEGORIES, makeId } from '../../data/store.js'
import './AdminNewsForm.css'

const emptyForm = {
  title: '',
  category: CATEGORIES[0].id,
  summary: '',
  content: '',
  image: '',
  date: new Date().toISOString().slice(0, 10),
  author: '',
}

const MAX_IMAGE_WIDTH = 1280

// Redimensiona y comprime la imagen elegida en el dispositivo antes de
// guardarla como base64, para no llenar el localStorage con archivos
// pesados (las fotos de un celular pueden pesar varios MB).
function fileToOptimizedDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('El archivo no es una imagen válida.'))
      img.onload = () => {
        const scale = Math.min(1, MAX_IMAGE_WIDTH / img.width)
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        const isPng = file.type === 'image/png'
        const dataUrl = isPng
          ? canvas.toDataURL('image/png')
          : canvas.toDataURL('image/jpeg', 0.82)
        resolve(dataUrl)
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

export default function AdminNewsForm({ initialItem, onCancel, onSave }) {
  const [form, setForm] = useState(initialItem || emptyForm)
  const [errors, setErrors] = useState({})
  const initialIsUrlImage = Boolean(initialItem?.image) && !initialItem.image.startsWith('data:')
  const [imageTab, setImageTab] = useState(initialIsUrlImage ? 'url' : 'upload') // 'upload' | 'url'
  const [imageError, setImageError] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const setField = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setImageError('Elegí un archivo de imagen (jpg, png, webp, etc.).')
      return
    }
    if (file.size > 8 * 1024 * 1024) {
      setImageError('La imagen pesa demasiado (máximo 8 MB).')
      return
    }

    setImageError('')
    setUploading(true)
    try {
      const dataUrl = await fileToOptimizedDataUrl(file)
      setField('image', dataUrl)
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

  const validate = () => {
    const next = {}
    if (!form.title.trim()) next.title = 'El título es obligatorio.'
    if (!form.summary.trim()) next.summary = 'Agregá una bajada o resumen breve.'
    if (!form.content.trim()) next.content = 'El cuerpo de la noticia no puede estar vacío.'
    if (!form.date) next.date = 'Elegí una fecha de publicación.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSave({ ...form, id: form.id || makeId() })
  }

  return (
    <div className="news-form__backdrop" onClick={onCancel}>
      <form
        className="news-form"
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
      >
        <div className="news-form__header">
          <h2>{initialItem ? 'Editar noticia' : 'Nueva noticia'}</h2>
          <button type="button" className="news-form__close" onClick={onCancel} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div className="news-form__grid">
          <div className="news-form__field news-form__field--full">
            <label htmlFor="nf-title">Título</label>
            <input
              id="nf-title"
              type="text"
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
              placeholder="Ej: El Banco Central anuncia nueva medida"
            />
            {errors.title && <span className="news-form__error">{errors.title}</span>}
          </div>

          <div className="news-form__field">
            <label htmlFor="nf-category">Categoría</label>
            <select
              id="nf-category"
              value={form.category}
              onChange={(e) => setField('category', e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label} — {c.freq}
                </option>
              ))}
            </select>
          </div>

          <div className="news-form__field">
            <label htmlFor="nf-date">Fecha</label>
            <input
              id="nf-date"
              type="date"
              value={form.date}
              onChange={(e) => setField('date', e.target.value)}
            />
            {errors.date && <span className="news-form__error">{errors.date}</span>}
          </div>

          <div className="news-form__field">
            <label htmlFor="nf-author">Autor / sección (opcional)</label>
            <input
              id="nf-author"
              type="text"
              value={form.author}
              onChange={(e) => setField('author', e.target.value)}
              placeholder="Redacción Finanzas"
            />
          </div>

          <div className="news-form__field news-form__field--full">
            <label>Imagen de la noticia (opcional)</label>
            <p className="news-form__image-hint">
              Al subir una foto se optimiza automáticamente para ocupar menos espacio.
              Se guarda en el navegador de este equipo, así que evitá cargar demasiadas
              imágenes muy pesadas.
            </p>

            <div className="news-form__image-tabs">
              <button
                type="button"
                className={`news-form__image-tab ${imageTab === 'upload' ? 'is-active' : ''}`}
                onClick={() => setImageTab('upload')}
              >
                Subir desde mi dispositivo
              </button>
              <button
                type="button"
                className={`news-form__image-tab ${imageTab === 'url' ? 'is-active' : ''}`}
                onClick={() => setImageTab('url')}
              >
                Usar una URL
              </button>
            </div>

            {imageTab === 'upload' ? (
              <div className="news-form__upload">
                <input
                  ref={fileInputRef}
                  id="nf-image-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {uploading && <p className="news-form__upload-hint">Procesando imagen…</p>}
              </div>
            ) : (
              <input
                id="nf-image"
                type="text"
                value={form.image.startsWith('data:') ? '' : form.image}
                onChange={(e) => setField('image', e.target.value)}
                placeholder="https://…"
              />
            )}

            {imageError && <span className="news-form__error">{imageError}</span>}

            {form.image && (
              <div className="news-form__preview">
                <img src={form.image} alt="Vista previa" />
                <button type="button" onClick={removeImage} className="news-form__preview-remove">
                  Quitar imagen
                </button>
              </div>
            )}
          </div>

          <div className="news-form__field news-form__field--full">
            <label htmlFor="nf-summary">Resumen / bajada</label>
            <textarea
              id="nf-summary"
              rows={2}
              value={form.summary}
              onChange={(e) => setField('summary', e.target.value)}
              placeholder="Una o dos frases que resuman la noticia para la tarjeta."
            />
            {errors.summary && <span className="news-form__error">{errors.summary}</span>}
          </div>

          <div className="news-form__field news-form__field--full">
            <label htmlFor="nf-content">Cuerpo de la noticia</label>
            <textarea
              id="nf-content"
              rows={7}
              value={form.content}
              onChange={(e) => setField('content', e.target.value)}
              placeholder="Texto completo que verán los lectores al abrir la noticia."
            />
            {errors.content && <span className="news-form__error">{errors.content}</span>}
          </div>
        </div>

        <div className="news-form__footer">
          <button type="button" className="news-form__cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="news-form__submit">
            {initialItem ? 'Guardar cambios' : 'Publicar noticia'}
          </button>
        </div>
      </form>
    </div>
  )
}
