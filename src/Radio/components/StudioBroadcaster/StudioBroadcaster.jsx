import React, { useEffect, useRef, useState } from 'react'
import './StudioBroadcaster.css'

/**
 * StudioBroadcaster
 *
 * Permite transmitir en vivo directamente desde el navegador del estudio:
 * captura el micrófono/línea de audio seleccionado y lo empuja, en tiempo
 * real, al mount point de un servidor Icecast (protocolo de fuente por
 * HTTP PUT). Es una alternativa a instalar un programa como BUTT/Mixxx.
 *
 * Requisitos para que funcione:
 *  - El servidor Icecast debe aceptar conexiones de fuente por HTTP PUT
 *    y tener CORS habilitado (ver nota en la interfaz y en el README).
 *  - Navegador de escritorio con soporte de MediaRecorder + subida por
 *    streaming en fetch (Chrome/Edge recientes funcionan mejor).
 *  - La pestaña del navegador debe permanecer abierta mientras se
 *    transmite: si se cierra, la transmisión se corta.
 */
export default function StudioBroadcaster({ config, onSaveConfig }) {
  const [host, setHost] = useState(config.icecastHost || '')
  const [mount, setMount] = useState(config.icecastMount || '')
  const [sourceUser, setSourceUser] = useState(config.icecastUser || 'source')
  const [sourcePassword, setSourcePassword] = useState(config.icecastPassword || '')

  const [devices, setDevices] = useState([])
  const [selectedDeviceId, setSelectedDeviceId] = useState('')
  const [devicesReady, setDevicesReady] = useState(false)

  const [status, setStatus] = useState('idle') // idle | requesting | live | error
  const [errorMsg, setErrorMsg] = useState('')
  const [savedNotice, setSavedNotice] = useState(false)

  const mediaStreamRef = useRef(null)
  const recorderRef = useRef(null)
  const controllerRef = useRef(null)

  const supported =
    typeof window !== 'undefined' &&
    'MediaRecorder' in window &&
    navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === 'function' &&
    typeof ReadableStream !== 'undefined'

  useEffect(() => {
    return () => {
      // Si el componente se desmonta mientras transmite, cortamos todo.
      stopBroadcast()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [])

  const detectDevices = async () => {
    try {
      // Se pide permiso una vez para poder ver los nombres de los
      // dispositivos (sin permiso, el navegador los devuelve sin etiqueta).
      const tempStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      tempStream.getTracks().forEach((t) => t.stop())

      const list = await navigator.mediaDevices.enumerateDevices()
      const inputs = list.filter((d) => d.kind === 'audioinput')
      setDevices(inputs)
      setDevicesReady(true)
      if (inputs.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(inputs[0].deviceId)
      }
    } catch (err) {
      setStatus('error')
      setErrorMsg('No se pudo acceder al micrófono/interfaz de audio. Revisá los permisos del navegador.')
    }
  }

  const buildListenUrl = () => {
    if (!host || !mount) return ''
    const cleanHost = host.replace(/\/+$/, '')
    const cleanMount = mount.startsWith('/') ? mount : '/' + mount
    return cleanHost + cleanMount
  }

  const saveConnectionSettings = (extra = {}) => {
    onSaveConfig({
      icecastHost: host,
      icecastMount: mount,
      icecastUser: sourceUser,
      icecastPassword: sourcePassword,
      ...extra,
    })
    setSavedNotice(true)
    setTimeout(() => setSavedNotice(false), 2500)
  }

  const useAsListenerUrl = () => {
    const url = buildListenUrl()
    if (!url) return
    saveConnectionSettings({ streamUrl: url })
  }

  const startBroadcast = async () => {
    setErrorMsg('')

    if (!host || !mount || !sourcePassword) {
      setStatus('error')
      setErrorMsg('Completá el servidor, el mount y la contraseña de fuente antes de transmitir.')
      return
    }

    setStatus('requesting')

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : true,
      })
      mediaStreamRef.current = stream

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm'

      const recorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000,
      })
      recorderRef.current = recorder

      const readable = new ReadableStream({
        start(controller) {
          controllerRef.current = controller
        },
        cancel() {
          stopBroadcast()
        },
      })

      recorder.ondataavailable = async (e) => {
        if (e.data && e.data.size > 0 && controllerRef.current) {
          try {
            const buf = new Uint8Array(await e.data.arrayBuffer())
            controllerRef.current.enqueue(buf)
          } catch (err) {
            // El controller puede haberse cerrado si ya se cortó la conexión.
          }
        }
      }

      recorder.onstop = () => {
        try {
          controllerRef.current?.close()
        } catch (err) {
          // ya estaba cerrado
        }
      }

      const url = buildListenUrl()
      const auth = 'Basic ' + btoa(`${sourceUser}:${sourcePassword}`)

      recorder.start(1000)
      setStatus('live')

      fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: auth,
          'Content-Type': mimeType,
          'Ice-Public': '1',
          'Ice-Name': config.stationName || 'Radio en vivo',
        },
        body: readable,
        duplex: 'half',
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(
              'El servidor Icecast respondió con un error (código ' + res.status + ').'
            )
          }
        })
        .catch(() => {
          setStatus('error')
          setErrorMsg(
            'No se pudo conectar con el servidor Icecast. Verificá el host, el mount, el usuario, la contraseña y que el servidor tenga CORS habilitado para conexiones PUT desde el navegador.'
          )
          stopBroadcast()
        })
    } catch (err) {
      setStatus('error')
      setErrorMsg('No se pudo acceder al micrófono/interfaz de audio seleccionado.')
    }
  }

  const stopBroadcast = () => {
    try {
      recorderRef.current?.state !== 'inactive' && recorderRef.current?.stop()
    } catch (err) {
      // no-op
    }
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop())
    recorderRef.current = null
    mediaStreamRef.current = null
    controllerRef.current = null
    setStatus((s) => (s === 'live' || s === 'requesting' ? 'idle' : s))
  }

  if (!supported) {
    return (
      <div className="studio-broadcaster">
        <div className="studio-broadcaster__warning">
          Tu navegador no soporta la transmisión directa desde el estudio. Usá Chrome
          o Edge de escritorio, o transmití con un programa externo (BUTT, Mixxx,
          RadioBOSS) y pegá la URL pública en la pestaña "Por URL".
        </div>
      </div>
    )
  }

  return (
    <div className="studio-broadcaster">
      <div className="studio-broadcaster__notice">
        <strong>Función experimental.</strong> Necesitás un servidor Icecast propio
        (o de un proveedor) que acepte conexiones de fuente por HTTP PUT con CORS
        habilitado. Funciona mejor en Chrome/Edge de escritorio, y la pestaña debe
        quedar abierta mientras se transmite. Si tu proveedor no lo soporta, usá la
        pestaña "Por URL" con un programa como BUTT en su lugar.
      </div>

      <div className="studio-broadcaster__grid">
        <div className="studio-broadcaster__field">
          <label htmlFor="sb-host">Servidor Icecast</label>
          <input
            id="sb-host"
            type="text"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            placeholder="https://tuservidor.com:8000"
            disabled={status === 'live'}
          />
        </div>

        <div className="studio-broadcaster__field">
          <label htmlFor="sb-mount">Mount point</label>
          <input
            id="sb-mount"
            type="text"
            value={mount}
            onChange={(e) => setMount(e.target.value)}
            placeholder="/stream"
            disabled={status === 'live'}
          />
        </div>

        <div className="studio-broadcaster__field">
          <label htmlFor="sb-user">Usuario de fuente</label>
          <input
            id="sb-user"
            type="text"
            value={sourceUser}
            onChange={(e) => setSourceUser(e.target.value)}
            placeholder="source"
            disabled={status === 'live'}
          />
        </div>

        <div className="studio-broadcaster__field">
          <label htmlFor="sb-pass">Contraseña de fuente</label>
          <input
            id="sb-pass"
            type="password"
            value={sourcePassword}
            onChange={(e) => setSourcePassword(e.target.value)}
            placeholder="••••••••"
            disabled={status === 'live'}
          />
        </div>
      </div>

      <div className="studio-broadcaster__actions-row">
        <button
          type="button"
          className="studio-broadcaster__secondary"
          onClick={() => saveConnectionSettings()}
        >
          Guardar datos de conexión
        </button>
        <button
          type="button"
          className="studio-broadcaster__secondary"
          onClick={useAsListenerUrl}
          disabled={!host || !mount}
        >
          Usar como URL para los oyentes
        </button>
        {savedNotice && <span className="studio-broadcaster__saved">Guardado.</span>}
      </div>

      <div className="studio-broadcaster__device">
        <div className="studio-broadcaster__device-row">
          <label htmlFor="sb-device">Micrófono / entrada de audio del estudio</label>
          <button type="button" onClick={detectDevices} className="studio-broadcaster__detect">
            {devicesReady ? 'Actualizar dispositivos' : 'Detectar dispositivos'}
          </button>
        </div>
        <select
          id="sb-device"
          value={selectedDeviceId}
          onChange={(e) => setSelectedDeviceId(e.target.value)}
          disabled={status === 'live' || devices.length === 0}
        >
          {devices.length === 0 ? (
            <option value="">Ningún dispositivo detectado todavía</option>
          ) : (
            devices.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label || 'Entrada de audio'}
              </option>
            ))
          )}
        </select>
        <p className="studio-broadcaster__device-hint">
          Elegí acá la interfaz o consola de tu estudio si aparece como dispositivo de
          entrada de tu sistema operativo (por ejemplo, una placa de sonido USB
          conectada a la mezcladora de aire).
        </p>
      </div>

      <div className="studio-broadcaster__control">
        <button
          type="button"
          className={`studio-broadcaster__toggle ${status === 'live' ? 'is-live' : ''}`}
          onClick={status === 'live' ? stopBroadcast : startBroadcast}
          disabled={status === 'requesting'}
        >
          {status === 'live'
            ? 'Cortar transmisión'
            : status === 'requesting'
            ? 'Conectando…'
            : 'Iniciar transmisión desde este equipo'}
        </button>

        {status === 'live' && (
          <span className="pill studio-broadcaster__live-pill">
            <span className="live-dot" /> TRANSMITIENDO EN VIVO
          </span>
        )}

        {status === 'error' && errorMsg && (
          <p className="studio-broadcaster__error">{errorMsg}</p>
        )}
      </div>
    </div>
  )
}
