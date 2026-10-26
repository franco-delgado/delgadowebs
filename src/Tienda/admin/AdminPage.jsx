import { useState } from 'react'
import { useTienda } from '../context/TiendaContext'

const STATES = ['Pendiente', 'Pagado', 'Enviado', 'Entregado', 'Cancelado']
const EMPTY = { name: '', category: '', price: '', stock: '', emoji: '🪴', desc: '' }

function Login() {
  const { settings, setAuth } = useTienda()
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')

  const submit = e => {
    e.preventDefault()
    if (pw === settings.password) setAuth(true)
    else setError('Contraseña incorrecta.')
  }

  return (
    <form className="tn-panel tn-login" onSubmit={submit}>
      <h2>Ingresar</h2>
      <label className="tn-field">
        Contraseña
        <input type="password" value={pw} onChange={e => setPw(e.target.value)} autoComplete="off" />
      </label>
      <p className="tn-error" role="alert">{error}</p>
      <button type="submit" className="tn-btn tn-btn-dark">Entrar</button>
      <p className="tn-hint">Demo: la contraseña es <b>admin123</b>. Los cambios se guardan solo en este navegador.</p>
    </form>
  )
}

function Stats() {
  const { products, orders, money } = useTienda()
  const sales = orders.filter(o => o.status !== 'Cancelado').reduce((t, o) => t + o.total, 0)
  const pending = orders.filter(o => o.status === 'Pendiente').length
  const stats = [['Productos', products.length], ['Pedidos', orders.length], ['Pendientes', pending], ['Ventas', money(sales)]]
  return (
    <div className="tn-stats">
      {stats.map(([label, value]) => (
        <div key={label} className="tn-stat"><small>{label}</small><b>{value}</b></div>
      ))}
    </div>
  )
}

function ProductsTab() {
  const { products, categories, money, saveProduct, deleteProduct, notify } = useTienda()
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }))

  const startEdit = p => {
    setEditId(p.id)
    setForm({ name: p.name, category: p.category, price: p.price, stock: p.stock, emoji: p.emoji, desc: p.desc })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const reset = () => { setEditId(null); setForm(EMPTY) }

  const submit = e => {
    e.preventDefault()
    const price = Number(form.price)
    const stock = Number(form.stock)
    if (!form.name.trim() || !form.category.trim() || form.price === '' || form.stock === '' || price < 0 || stock < 0) {
      return notify('Completá nombre, categoría, precio y stock')
    }
    saveProduct(
      { name: form.name.trim(), category: form.category.trim(), price, stock, emoji: form.emoji.trim() || '📦', desc: form.desc.trim() },
      editId,
    )
    notify('Producto guardado')
    reset()
  }

  const remove = p => {
    if (window.confirm(`¿Eliminar “${p.name}”?`)) {
      deleteProduct(p.id)
      if (editId === p.id) reset()
    }
  }

  return (
    <>
      <form className="tn-panel" onSubmit={submit}>
        <h3>{editId ? 'Editar producto' : 'Nuevo producto'}</h3>
        <div className="tn-form">
          <label className="tn-field">Nombre<input value={form.name} onChange={set('name')} /></label>
          <label className="tn-field">
            Categoría
            <input list="tn-cats" value={form.category} onChange={set('category')} />
            <datalist id="tn-cats">{categories.map(c => <option key={c} value={c} />)}</datalist>
          </label>
          <label className="tn-field">Precio<input type="number" min="0" value={form.price} onChange={set('price')} /></label>
          <label className="tn-field">Stock<input type="number" min="0" value={form.stock} onChange={set('stock')} /></label>
          <label className="tn-field">Emoji<input maxLength={4} value={form.emoji} onChange={set('emoji')} /></label>
          <label className="tn-field tn-full">Descripción<input value={form.desc} onChange={set('desc')} /></label>
        </div>
        <button type="submit" className="tn-btn tn-btn-dark">{editId ? 'Guardar cambios' : 'Agregar producto'}</button>
        {editId && <button type="button" className="tn-btn tn-btn-ghost" onClick={reset}>Cancelar edición</button>}
      </form>

      <div className="tn-panel">
        {products.length === 0 && <p className="tn-empty">Todavía no hay productos.</p>}
        {products.map(p => (
          <div key={p.id} className="tn-arow">
            <span className="tn-item-emoji">{p.emoji}</span>
            <div className="tn-grow"><strong>{p.name}</strong><br /><small>{p.category} · {money(p.price)}</small></div>
            <span className={p.stock < 5 ? 'tn-low' : ''}>Stock: {p.stock}</span>
            <button type="button" className="tn-sm" onClick={() => startEdit(p)}>Editar</button>
            <button type="button" className="tn-sm tn-del" onClick={() => remove(p)}>Eliminar</button>
          </div>
        ))}
      </div>
    </>
  )
}

function OrdersTab() {
  const { orders, money, setOrderStatus, notify } = useTienda()
  return (
    <div className="tn-panel">
      {orders.length === 0 && (
        <p className="tn-empty">Todavía no hay pedidos. Hacé una compra de prueba en la tienda para ver cómo llegan acá.</p>
      )}
      {orders.map(o => (
        <div key={o.id} className="tn-arow">
          <div className="tn-grow">
            <strong>Pedido #{o.id}</strong> <small>{o.date} · {o.method}</small>
            <br />
            <small>{o.items.map(i => `${i.qty} x ${i.name}`).join(', ')}</small>
          </div>
          <strong>{money(o.total)}</strong>
          <select
            aria-label={`Estado del pedido ${o.id}`}
            value={o.status}
            onChange={e => { setOrderStatus(o.id, e.target.value); notify('Estado actualizado') }}
          >
            {STATES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      ))}
    </div>
  )
}

function SettingsTab() {
  const { settings, saveSettings, notify } = useTienda()
  const [f, setF] = useState(settings)
  const set = key => e => setF(v => ({ ...v, [key]: e.target.value }))

  const submit = e => {
    e.preventDefault()
    saveSettings({ ...f, currency: f.currency.trim() || '$', password: f.password || 'admin123' })
    notify('Ajustes guardados')
  }

  return (
    <form className="tn-panel" onSubmit={submit}>
      <h3>Datos de la tienda</h3>
      <div className="tn-form">
        <label className="tn-field">Nombre<input value={f.name} onChange={set('name')} /></label>
        <label className="tn-field">Moneda<input maxLength={4} value={f.currency} onChange={set('currency')} /></label>
        <label className="tn-field tn-full">Frase de portada<input value={f.tagline} onChange={set('tagline')} /></label>
        <label className="tn-field tn-full">WhatsApp (con código de país)<input value={f.whatsapp} onChange={set('whatsapp')} /></label>
        <label className="tn-field tn-full">Link de Mercado Pago<input value={f.mpLink} onChange={set('mpLink')} /></label>
        <label className="tn-field tn-full">Datos de transferencia<input value={f.bank} onChange={set('bank')} /></label>
        <label className="tn-field">Contraseña del panel<input value={f.password} onChange={set('password')} /></label>
      </div>
      <button type="submit" className="tn-btn tn-btn-dark">Guardar ajustes</button>
    </form>
  )
}

export default function AdminPage() {
  const { auth } = useTienda()
  const [tab, setTab] = useState('Productos')
  if (!auth) return <Login />

  return (
    <div className="tn-wrap tn-admin">
      <Stats />
      <div className="tn-tabs" role="group" aria-label="Secciones del panel">
        {['Productos', 'Pedidos', 'Ajustes'].map(t => (
          <button key={t} type="button" className="tn-tab" aria-pressed={t === tab} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      {tab === 'Productos' && <ProductsTab />}
      {tab === 'Pedidos' && <OrdersTab />}
      {tab === 'Ajustes' && <SettingsTab />}
    </div>
  )
}
