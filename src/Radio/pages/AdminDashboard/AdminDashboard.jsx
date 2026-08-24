import React, { useState } from 'react'
import AdminNewsForm from '../AdminNewsForm/AdminNewsForm.jsx'
import AdminRadioConfig from '../AdminRadioConfig/AdminRadioConfig.jsx'
import { getNews, saveNews, getCategory, formatDate, setAdminAuthed } from '../../data/store.js'
import './AdminDashboard.css'

export default function AdminDashboard({ onLogout }) {
  const [tab, setTab] = useState('noticias')
  const [news, setNews] = useState(getNews())
  const [editingItem, setEditingItem] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const openNewForm = () => {
    setEditingItem(null)
    setShowForm(true)
  }

  const openEditForm = (item) => {
    setEditingItem(item)
    setShowForm(true)
  }

  const handleSave = (item) => {
    let updated
    if (editingItem) {
      updated = news.map((n) => (n.id === item.id ? item : n))
    } else {
      updated = [item, ...news]
    }
    setNews(updated)
    saveNews(updated)
    setShowForm(false)
    setEditingItem(null)
  }

  const handleDelete = (id) => {
    if (!window.confirm('¿Eliminar esta noticia? Esta acción no se puede deshacer.')) return
    const updated = news.filter((n) => n.id !== id)
    setNews(updated)
    saveNews(updated)
  }

  const sorted = [...news].sort((a, b) => (a.date < b.date ? 1 : -1))

  return (
    <div className="admin-dash">
      <header className="admin-dash__header">
        <div className="container admin-dash__header-inner">
          <div>
            <span className="eyebrow">Panel de administración</span>
            <h1 className="admin-dash__title">Sala de redacción</h1>
          </div>
          <div className="admin-dash__header-actions">
            <a href="#/" className="admin-dash__view-site">
              Ver sitio →
            </a>
            <button
              type="button"
              className="admin-dash__logout"
              onClick={() => {
                setAdminAuthed(false)
                onLogout()
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <div className="container admin-dash__tabs">
        <button
          type="button"
          className={`admin-dash__tab ${tab === 'noticias' ? 'is-active' : ''}`}
          onClick={() => setTab('noticias')}
        >
          Noticias
        </button>
        <button
          type="button"
          className={`admin-dash__tab ${tab === 'radio' ? 'is-active' : ''}`}
          onClick={() => setTab('radio')}
        >
          Señal de radio
        </button>
      </div>

      <main className="container admin-dash__content">
        {tab === 'noticias' && (
          <>
            <div className="admin-dash__toolbar">
              <p className="admin-dash__count">{news.length} noticias publicadas</p>
              <button type="button" className="admin-dash__add" onClick={openNewForm}>
                + Agregar noticia
              </button>
            </div>

            {sorted.length === 0 ? (
              <div className="admin-dash__empty">
                Todavía no cargaste ninguna noticia. Usá "Agregar noticia" para publicar
                la primera.
              </div>
            ) : (
              <ul className="admin-list">
                {sorted.map((item) => {
                  const cat = getCategory(item.category)
                  return (
                    <li key={item.id} className="admin-list__row">
                      <span
                        className="admin-list__cat"
                        style={{ '--cat-color': cat.color }}
                      >
                        {cat.label}
                      </span>
                      <div className="admin-list__main">
                        <p className="admin-list__title">{item.title}</p>
                        <p className="admin-list__date">{formatDate(item.date)}</p>
                      </div>
                      <div className="admin-list__actions">
                        <button type="button" onClick={() => openEditForm(item)}>
                          Editar
                        </button>
                        <button
                          type="button"
                          className="admin-list__delete"
                          onClick={() => handleDelete(item.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </>
        )}

        {tab === 'radio' && <AdminRadioConfig />}
      </main>

      {showForm && (
        <AdminNewsForm
          initialItem={editingItem}
          onCancel={() => {
            setShowForm(false)
            setEditingItem(null)
          }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
