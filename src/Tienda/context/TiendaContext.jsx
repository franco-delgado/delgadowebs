import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const DB_KEY = 'tienda-db-v1'
const CART_KEY = 'tienda-cart-v1'

/* Datos iniciales de la demo. Editá productos y ajustes desde el panel de administración. */
const seed = () => ({
  settings: {
    name: 'Brote',
    tagline: 'Plantas, macetas y accesorios elegidos a mano.',
    whatsapp: '5491100000000', // con código de país, sin + ni espacios
    mpLink: 'https://mpago.la/TU-LINK', // link de pago de Mercado Pago del cliente
    bank: 'Alias: BROTE.TIENDA · CBU 0000000000000000000000',
    currency: '$',
    password: 'admin123',
  },
  nextProductId: 11,
  nextOrderId: 1,
  orders: [],
  products: [
    { id: 1, name: 'Monstera deliciosa', category: 'Plantas', price: 18500, emoji: '🌿', desc: 'Maceta 17 cm', stock: 12 },
    { id: 2, name: 'Potus colgante', category: 'Plantas', price: 9800, emoji: '🍃', desc: 'Maceta 12 cm', stock: 20 },
    { id: 3, name: 'Suculenta mix x3', category: 'Plantas', price: 7200, emoji: '🌵', desc: 'Pack de tres', stock: 30 },
    { id: 4, name: 'Lengua de suegra', category: 'Plantas', price: 14900, emoji: '🪴', desc: 'Maceta 15 cm', stock: 8 },
    { id: 5, name: 'Maceta de cerámica', category: 'Macetas', price: 11200, emoji: '🏺', desc: 'Esmaltada, 18 cm', stock: 15 },
    { id: 6, name: 'Maceta colgante macramé', category: 'Macetas', price: 8600, emoji: '🧶', desc: 'Algodón natural', stock: 10 },
    { id: 7, name: 'Set 3 macetas de barro', category: 'Macetas', price: 9900, emoji: '🟤', desc: '10, 13 y 16 cm', stock: 14 },
    { id: 8, name: 'Regadera de cobre', category: 'Accesorios', price: 13500, emoji: '🚿', desc: '1,5 litros', stock: 6 },
    { id: 9, name: 'Sustrato premium 5 L', category: 'Accesorios', price: 5400, emoji: '🌱', desc: 'Mezcla universal', stock: 40 },
    { id: 10, name: 'Kit de herramientas', category: 'Accesorios', price: 12300, emoji: '✂️', desc: 'Pala, tijera y rastrillo', stock: 9 },
  ],
})

const read = (key, fallback) => {
  try {
    const v = JSON.parse(localStorage.getItem(key))
    return v ?? fallback
  } catch {
    return fallback
  }
}
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* sin almacenamiento disponible: la tienda sigue funcionando en memoria */
  }
}

const Ctx = createContext(null)
export const useTienda = () => useContext(Ctx)

export const hueFor = text => [...text].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 0)

export function TiendaProvider({ children }) {
  const [db, setDb] = useState(() => {
    const saved = read(DB_KEY, null)
    return saved && saved.products ? saved : seed()
  })
  const [cart, setCart] = useState(() => read(CART_KEY, {}))
  const [view, setView] = useState('shop') // 'shop' | 'admin'
  const [auth, setAuth] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => write(DB_KEY, db), [db])
  useEffect(() => write(CART_KEY, cart), [cart])
  useEffect(() => {
    if (!toast) return undefined
    const t = setTimeout(() => setToast(''), 1800)
    return () => clearTimeout(t)
  }, [toast])

  const { settings, products, orders } = db
  const money = useCallback(n => `${settings.currency}${Number(n).toLocaleString('es-AR')}`, [settings.currency])
  const waLink = useCallback(text => `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(text)}`, [settings.whatsapp])
  const categories = useMemo(() => [...new Set(products.map(p => p.category))], [products])

  const lines = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => ({ product: products.find(p => p.id === Number(id)), qty }))
        .filter(l => l.product && l.qty > 0),
    [cart, products],
  )
  const total = lines.reduce((t, l) => t + l.product.price * l.qty, 0)
  const count = lines.reduce((t, l) => t + l.qty, 0)

  const notify = setToast

  const addToCart = id => {
    const p = products.find(x => x.id === id)
    if (!p) return
    if ((cart[id] || 0) >= p.stock) return notify('No hay más stock disponible')
    setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }))
    notify('Agregado al carrito')
  }
  const changeQty = (id, delta) => {
    const p = products.find(x => x.id === id)
    if (!p) return
    const next = Math.min(p.stock, Math.max(0, (cart[id] || 0) + delta))
    if (delta > 0 && next === (cart[id] || 0)) notify('No hay más stock disponible')
    setCart(c => ({ ...c, [id]: next }))
  }

  const orderMessage = method =>
    `Hola, quiero hacer este pedido:\n${lines
      .map(l => `• ${l.qty} x ${l.product.name} (${money(l.product.price * l.qty)})`)
      .join('\n')}\nTotal: ${money(total)}${method ? `\nForma de pago: ${method}` : ''}`

  /* Registra el pedido, descuenta stock y vacía el carrito. Devuelve el mensaje para WhatsApp. */
  const checkout = method => {
    if (!lines.length) return null
    const message = orderMessage(method)
    const order = {
      id: db.nextOrderId,
      date: new Date().toLocaleString('es-AR'),
      method,
      status: 'Pendiente',
      total,
      items: lines.map(l => ({ name: l.product.name, qty: l.qty, price: l.product.price })),
    }
    setDb(d => ({
      ...d,
      nextOrderId: d.nextOrderId + 1,
      orders: [order, ...d.orders],
      products: d.products.map(p => {
        const l = lines.find(x => x.product.id === p.id)
        return l ? { ...p, stock: Math.max(0, p.stock - l.qty) } : p
      }),
    }))
    setCart({})
    setCartOpen(false)
    notify('¡Pedido registrado!')
    return message
  }

  /* Acciones del administrador */
  const saveProduct = (data, id) =>
    setDb(d =>
      id
        ? { ...d, products: d.products.map(p => (p.id === id ? { ...p, ...data } : p)) }
        : { ...d, nextProductId: d.nextProductId + 1, products: [...d.products, { id: d.nextProductId, ...data }] },
    )
  const deleteProduct = id => {
    setDb(d => ({ ...d, products: d.products.filter(p => p.id !== id) }))
    setCart(c => {
      const { [id]: _removed, ...rest } = c
      return rest
    })
  }
  const setOrderStatus = (id, status) =>
    setDb(d => ({ ...d, orders: d.orders.map(o => (o.id === id ? { ...o, status } : o)) }))
  const saveSettings = patch => setDb(d => ({ ...d, settings: { ...d.settings, ...patch } }))
  const resetDemo = () => {
    setDb(seed())
    setCart({})
  }

  const value = {
    settings, products, orders, categories, lines, total, count, money, waLink,
    view, setView, auth, setAuth, cartOpen, setCartOpen, toast, notify,
    addToCart, changeQty, checkout, orderMessage,
    saveProduct, deleteProduct, setOrderStatus, saveSettings, resetDemo,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
