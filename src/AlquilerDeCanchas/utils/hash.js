/* Hash de la contraseña del panel (SHA-256). */
export async function sha256(text) {
  const input = 'club:' + text
  if (globalThis.crypto && globalThis.crypto.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
  }
  let h = 5381
  for (const ch of input) h = ((h << 5) + h + ch.charCodeAt(0)) | 0
  return 'f' + (h >>> 0).toString(16)
}
