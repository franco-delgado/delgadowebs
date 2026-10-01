// Redimensiona y comprime la imagen elegida en el dispositivo antes de
// guardarla como base64, para no llenar el localStorage con archivos
// pesados (las fotos de un celular pueden pesar varios MB).
// Los PNG conservan la transparencia (útil para logos de sponsors) y los
// SVG se guardan tal cual (son livianos y no se pixelan).
export function fileToOptimizedDataUrl(file, maxWidth = 1280) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'))
    reader.onload = () => {
      if (file.type === 'image/svg+xml') {
        if (file.size > 300 * 1024) {
          reject(new Error('El SVG pesa demasiado (máximo 300 KB).'))
        } else {
          resolve(reader.result)
        }
        return
      }

      const img = new Image()
      img.onerror = () => reject(new Error('El archivo no es una imagen válida.'))
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width)
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        const isPng = file.type === 'image/png'
        const dataUrl = isPng
          ? canvas.toDataURL('image/png')
          : canvas.toDataURL('image/jpeg', 0.82)
        resolve(dataUrl)
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}
