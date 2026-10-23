import { downloadBlob } from './files'

/* CSV con ";" y BOM para que Excel en español lo abra bien */
export function downloadCSV(name, headers, rows) {
  const esc = v => {
    const s = String(v ?? '')
    return /[";\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
  }
  const text = [headers, ...rows].map(r => r.map(esc).join(';')).join('\r\n')
  downloadBlob(new Blob(['\ufeff' + text], { type: 'text/csv;charset=utf-8' }), name)
}
