import { useCallback, useEffect, useState } from 'react'
import { getNews, NEWS_EVENT } from './store.js'

// Carga las noticias de localStorage y se mantiene sincronizada: al guardar
// desde el admin, al volver a la pestaña, o si se edita desde otra pestaña.
export function useNews() {
  const [news, setNews] = useState([])

  const load = useCallback(async () => {
    const data = await getNews()
    setNews(Array.isArray(data) ? data : [])
  }, [])

  useEffect(() => {
    load()
    const onStorage = (e) => {
      if (!e.key || e.key === 'onda_news_v1') load()
    }
    window.addEventListener('focus', load)
    window.addEventListener(NEWS_EVENT, load)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('focus', load)
      window.removeEventListener(NEWS_EVENT, load)
      window.removeEventListener('storage', onStorage)
    }
  }, [load])

  return news
}
