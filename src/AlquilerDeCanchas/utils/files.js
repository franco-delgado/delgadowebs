import { LIMITS } from '../config/defaults'

const readDataURL = file =>
  new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result)
    r.onerror = () => reject(new Error('No se pudo leer el archivo.'))
    r.readAsDataURL(file)
  })

const loadImg = src =>
  new Promise((resolve, reject) => {
    const im = new Image()
    im.onload = () => resolve(im)
    im.onerror = () => reject(new Error('El archivo no es una imagen válida.'))
    im.src = src
  })

/* Reduce la imagen para que ocupe poco espacio en el navegador */
export async function compressImage(file, max = 1100, quality = 0.72, type = 'image/jpeg') {
  const im = await loadImg(await readDataURL(file))
  const k = Math.min(1, max / Math.max(im.width, im.height))
  const c = document.createElement('canvas')
  c.width = Math.max(1, Math.round(im.width * k))
  c.height = Math.max(1, Math.round(im.height * k))
  c.getContext('2d').drawImage(im, 0, 0, c.width, c.height)
  return c.toDataURL(type, quality)
}

/* Comprobante de pago: imagen (se comprime) o PDF liviano */
export async function readProof(file) {
  if (file.type.startsWith('image/')) {
    return { name: file.name, type: 'image/jpeg', data: await compressImage(file, 1100, 0.72) }
  }
  if (file.type === 'application/pdf') {
    if (file.size > LIMITS.proofMaxBytes) throw new Error('El PDF pesa demasiado (máx. 1,2 MB).')
    return { name: file.name, type: file.type, data: await readDataURL(file) }
  }
  throw new Error('Adjuntá una imagen o un PDF.')
}

export async function readImage(file, max = 1200, type = 'image/jpeg') {
  if (!file.type.startsWith('image/')) throw new Error('Elegí un archivo de imagen.')
  return compressImage(file, max, 0.78, type)
}

function dataUrlToBlob(dataUrl) {
  const [head, body] = dataUrl.split(',')
  const mime = /data:([^;]+)/.exec(head)[1]
  const bin = atob(body)
  const arr = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i)
  return new Blob([arr], { type: mime })
}

// Los navegadores bloquean abrir "data:" en una pestaña nueva; se usa un Blob.
export function openDataUrl(dataUrl) {
  const url = URL.createObjectURL(dataUrlToBlob(dataUrl))
  window.open(url, '_blank', 'noopener')
  setTimeout(() => URL.revokeObjectURL(url), 60000)
}

export function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}
export const downloadDataUrl = (dataUrl, name) => downloadBlob(dataUrlToBlob(dataUrl), name)
