/* Capa de persistencia. Hoy usa localStorage; para pasar a un servidor
   alcanza con reemplazar estas funciones (load/save) por llamadas a una API. */
import { STORAGE_PREFIX } from '../config/defaults'

const k = key => STORAGE_PREFIX + key

export function load(key, fallback = null) {
  try {
    const v = localStorage.getItem(k(key))
    return v === null ? fallback : JSON.parse(v)
  } catch {
    return fallback
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(k(key), JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export const session = {
  get: key => { try { return sessionStorage.getItem(k(key)) } catch { return null } },
  set: (key, v) => { try { sessionStorage.setItem(k(key), v) } catch { /* sin sesión */ } },
  remove: key => { try { sessionStorage.removeItem(k(key)) } catch { /* sin sesión */ } },
}

export function storageUsage() {
  let bytes = 0
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(STORAGE_PREFIX)) bytes += (key.length + (localStorage.getItem(key) || '').length) * 2
    }
  } catch { /* sin acceso */ }
  return { bytes, limit: 5 * 1024 * 1024 }
}
