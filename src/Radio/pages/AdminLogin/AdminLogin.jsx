import React, { useState } from 'react'
import { ADMIN_PASSWORD, setAdminAuthed } from '../../data/store.js'
import './AdminLogin.css'

export default function AdminLogin({ onSuccess }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAdminAuthed(true)
      setError('')
      onSuccess()
    } else {
      setError('Contraseña incorrecta. Intentá de nuevo.')
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <a href="#/" className="admin-login__back">
          ← Volver al sitio
        </a>

        <span className="eyebrow">Acceso restringido</span>
        <h1 className="admin-login__title">Panel de la radio</h1>
        <p className="admin-login__subtitle">
          Ingresá la contraseña de administrador para cargar noticias y conectar la
          señal de la radio.
        </p>

        <form onSubmit={submit} className="admin-login__form">
          <label htmlFor="admin-password">Contraseña</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoFocus
          />
          {error && <p className="admin-login__error">{error}</p>}
          <button type="submit" className="admin-login__submit">
            Ingresar
          </button>
        </form>

        <p className="admin-login__hint">
          Demo: la contraseña por defecto es <code>radio2026</code>. Cambiala en{' '}
          <code>src/data/store.js</code> antes de publicar el sitio.
        </p>
      </div>
    </div>
  )
}
