import React, { useState, useEffect } from 'react'
import AdminNewsForm from '../AdminNewsForm/AdminNewsForm.jsx'
import AdminRadioConfig from '../AdminRadioConfig/AdminRadioConfig.jsx'
// 1. Agregamos deleteNews a las importaciones

import { getNews, saveNews, deleteNews, getCategory, formatDate, setAdminAuthed } from '../../data/store.js'
import './AdminDashboard.css'

export default function AdminDashboard({ onLogout }) {
  const [tab, setTab] = useState('noticias')
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState(null)
  const [showForm, setShowForm] = useState(false)

  // Carga inicial de noticias desde Supabase
  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    setLoading(true)
    const data = await getNews()
    setNews(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  const openNewForm = () => {
    setEditingItem(null)
    setShowForm(true)
  }

  const openEditForm = (item) => {
    setEditingItem(item)
    setShowForm(true)
  }

  const handleSave = async (item) => {
    await saveNews(item)
    await fetchNews()
    setShowForm(false)
    setEditingItem(null)
  }

  // 2. Función handleDelete actualizada para borrar en Supabase
  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta noticia? Esta acción no se puede deshacer.')) return

    // Borrado en Supabase
    const success = await deleteNews(id)

    if (success) {
      // Actualizamos la lista local filtrando el ID eliminado
      setNews((prevNews) => prevNews.filter((n) => n.id !== id))
    } else {
      alert('Hubo un error al intentar eliminar la noticia de la base de datos.')
    }
  }

  const safeNews = Array.isArray(news) ? news : []
  const sorted = [...safeNews].sort((a, b) => (a.date < b.date ? 1 : -1))

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
              <p className="admin-dash__count">{safeNews.length} noticias publicadas</p>
              <button type="button" className="admin-dash__add" onClick={openNewForm}>
                + Agregar noticia
              </button>
            </div>

            {loading ? (
              <p>Cargando noticias desde la base de datos...</p>
            ) : sorted.length === 0 ? (
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
                        style={{ '--cat-color': cat?.color || '#000' }}
                      >
                        {cat?.label || 'Sin categoría'}
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