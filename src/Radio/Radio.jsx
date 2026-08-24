import React, { useEffect, useState } from 'react'
import PublicPage from './pages/PublicPage/PublicPage.jsx'
import CategoryPage from './pages/CategoryPage/CategoryPage.jsx'
import AdminLogin from './pages/AdminLogin/AdminLogin.jsx'
import AdminDashboard from './pages/AdminDashboard/AdminDashboard.jsx'
import { isAdminAuthed } from './data/store.js'
import './Radio.css'

function getRoute() {
  const hash = window.location.hash.replace('#', '')
  
  // Detecta /admin o /Radio/admin
  if (hash.includes('admin')) return { name: 'admin' }
  
  // Detecta categorías
  const catMatch = hash.match(/categoria\/([a-z0-9_-]+)/i)
  if (catMatch) return { name: 'category', category: catMatch[1] }
  
  return { name: 'home' }
}

export default function Radio() {
  const [route, setRoute] = useState(getRoute())
  const [authed, setAuthed] = useState(isAdminAuthed())

  useEffect(() => {
    const onHashChange = () => {
      setRoute(getRoute())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  if (route.name === 'admin') {
    if (!authed) {
      return <AdminLogin onSuccess={() => setAuthed(true)} />
    }
    return (
      <AdminDashboard
        onLogout={() => {
          setAuthed(false)
          window.location.hash = '#/Radio/admin'
        }}
      />
    )
  }

  if (route.name === 'category') {
    return <CategoryPage categoryId={route.category} />
  }

  return <PublicPage />
}