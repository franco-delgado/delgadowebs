import React, { useState } from 'react'
import RadioPlayer from '../../components/RadioPlayer/RadioPlayer.jsx'
import StudioBroadcaster from '../../components/StudioBroadcaster/StudioBroadcaster.jsx'
import { getRadioConfig, saveRadioConfig } from '../../data/store.js'
import './AdminRadioConfig.css'

export default function AdminRadioConfig() {
  const [form, setForm] = useState(getRadioConfig())
  const [saved, setSaved] = useState(false)
  const [source, setSource] = useState('url') // 'url' | 'studio'

  const setField = (field, value) => {
    setSaved(false)
    setForm((f) => ({ ...f, [field]: value }))
  }

  const submit = (e) => {
    e.preventDefault()
    saveRadioConfig(form)
    setSaved(true)
  }

  // Usado por StudioBroadcaster para persistir sus propios cambios
  // (datos de conexión Icecast, y opcionalmente la URL para oyentes)
  // manteniendo sincronizado el resto del formulario y la vista previa.
  const handleStudioSave = (partial) => {
    setForm((f) => {
      const updated = { ...f, ...partial }
      saveRadioConfig(updated)
      return updated
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="radio-config">
      <div className="radio-config__form-col">
        <p className="radio-config__lead">
          Hay dos formas de conectar la señal de tu radio: pegando la URL de un
          stream que ya estás transmitiendo, o transmitiendo directo desde el
          navegador de la computadora del estudio.
        </p>

        <div className="radio-config__source-tabs">
          <button
            type="button"
            className={`radio-config__source-tab ${source === 'url' ? 'is-active' : ''}`}
            onClick={() => setSource('url')}
          >
            Por URL
          </button>
          <button
            type="button"
            className={`radio-config__source-tab ${source === 'studio' ? 'is-active' : ''}`}
            onClick={() => setSource('studio')}
          >
            Desde el estudio
          </button>
        </div>

        {source === 'url' && (
          <>
            <p className="radio-config__tab-hint">
              Pegá la URL del stream (la que te da tu proveedor: Shoutcast, Icecast,
              Radio.co, Zeno.FM, etc. — normalmente termina en <code>.mp3</code>,{' '}
              <code>.aac</code> o similar) y guardá los cambios.
            </p>
            <form onSubmit={submit} className="radio-config__fields">
              <div className="radio-config__field">
                <label htmlFor="rc-stream">URL del stream de audio</label>
                <input
                  id="rc-stream"
                  type="text"
                  value={form.streamUrl}
                  onChange={(e) => setField('streamUrl', e.target.value)}
                  placeholder="https://tuproveedor.com/stream/tu-radio"
                />
              </div>

              <div className="radio-config__row">
                <div className="radio-config__field">
                  <label htmlFor="rc-name">Nombre de la radio</label>
                  <input
                    id="rc-name"
                    type="text"
                    value={form.stationName}
                    onChange={(e) => setField('stationName', e.target.value)}
                  />
                </div>
                <div className="radio-config__field">
                  <label htmlFor="rc-freq">Frecuencia / etiqueta</label>
                  <input
                    id="rc-freq"
                    type="text"
                    value={form.frequency}
                    onChange={(e) => setField('frequency', e.target.value)}
                    placeholder="95.5 FM"
                  />
                </div>
              </div>

              <div className="radio-config__row">
                <div className="radio-config__field">
                  <label htmlFor="rc-slogan">Eslogan</label>
                  <input
                    id="rc-slogan"
                    type="text"
                    value={form.slogan}
                    onChange={(e) => setField('slogan', e.target.value)}
                  />
                </div>
                <div className="radio-config__field">
                  <label htmlFor="rc-logo">Iniciales del logo</label>
                  <input
                    id="rc-logo"
                    type="text"
                    maxLength={3}
                    value={form.logoText}
                    onChange={(e) => setField('logoText', e.target.value.toUpperCase())}
                  />
                </div>
              </div>

              <button type="submit" className="radio-config__submit">
                Guardar configuración de radio
              </button>
              {saved && (
                <p className="radio-config__saved">
                  Cambios guardados. Ya están en vivo para los usuarios.
                </p>
              )}
            </form>
          </>
        )}

        {source === 'studio' && (
          <>
            <p className="radio-config__tab-hint">
              El navegador captura el micrófono o la línea de audio de tu estudio y la
              transmite en vivo hacia tu servidor Icecast, sin necesitar un programa
              externo. La <strong>URL para oyentes</strong> (arriba, en la pestaña "Por
              URL") sigue siendo la que reproducen los usuarios en el sitio.
            </p>
            <StudioBroadcaster config={form} onSaveConfig={handleStudioSave} />
            {saved && (
              <p className="radio-config__saved">Cambios guardados correctamente.</p>
            )}
          </>
        )}
      </div>

      <div className="radio-config__preview-col">
        <span className="eyebrow">Vista previa</span>
        <div className="radio-config__preview">
          <RadioPlayer radio={form} variant="full" />
        </div>
        <p className="radio-config__preview-hint">
          Así se ve y se escucha el reproductor que verán los usuarios en la página
          principal. Probá el botón de play para confirmar que la señal conecta bien.
        </p>
      </div>
    </div>
  )
}
