import { useCallback, useEffect, useState } from 'react'
import { getSponsors, SPONSORS_EVENT } from './store.js'

// Lista de sponsors (localStorage), sincronizada con el panel admin.
// Devuelve null mientras carga la primera vez.
export function useSponsors() {
  const [sponsors, setSponsors] = useState(null)

  const load = useCallback(async () => {
    const data = await getSponsors()
    setSponsors(Array.isArray(data) ? data : [])
  }, [])

  useEffect(() => {
    load()
    const onStorage = (e) => {
      if (!e.key || e.key === 'onda_sponsors_v1') load()
    }
    window.addEventListener('focus', load)
    window.addEventListener(SPONSORS_EVENT, load)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('focus', load)
      window.removeEventListener(SPONSORS_EVENT, load)
      window.removeEventListener('storage', onStorage)
    }
  }, [load])

  return sponsors
}
