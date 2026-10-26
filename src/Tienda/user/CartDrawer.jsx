import { useEffect, useState } from 'react'
import { useTienda } from '../context/TiendaContext'

const METHODS = [
  ['Mercado Pago', 'Mercado Pago (tarjeta, dinero en cuenta)'],
  ['Transferencia', 'Transferencia bancaria'],
  ['Efectivo', 'Efectivo al retirar'],
]

export default function CartDrawer() {
  const { settings, lines, total, count, money, cartOpen, setCartOpen, changeQty, checkout, orderMessage, waLink } = useTienda()
  const [paying, setPaying] = useState(false)
  const [method, setMethod] = useState('Mercado Pago')

  useEffect(() => {
    const onKey = e => e.key === 'Escape' && setCartOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [setCartOpen])

  useEffect(() => {
    if (!count) setPaying(false)
  }, [count])

  const note =
    method === 'Mercado Pago'
      ? 'Te llevamos a Mercado Pago para completar el pago de forma segura.'
      : method === 'Transferencia'
        ? `${settings.bank}. Enviá el comprobante por WhatsApp.`
        : 'Pagás en efectivo cuando retirás tu pedido. Te confirmamos por WhatsApp.'

  const confirm = () => {
    const message = checkout(method)
    if (!message) return
    if (method === 'Mercado Pago') window.open(settings.mpLink, '_blank', 'noopener')
    window.open(waLink(message), '_blank', 'noopener')
  }

  return (
    <>
      <div className={`tn-shade ${cartOpen ? 'tn-on' : ''}`} onClick={() => setCartOpen(false)} />
      <aside className={`tn-drawer ${cartOpen ? 'tn-on' : ''}`} aria-label="Carrito de compras" aria-hidden={!cartOpen}>
        <h2>
          Tu carrito
          <button type="button" className="tn-x" aria-label="Cerrar carrito" onClick={() => setCartOpen(false)}>×</button>
        </h2>

        <div className="tn-items">
          {lines.length === 0 ? (
            <p className="tn-empty">Tu carrito está vacío.<br />Agregá productos para empezar.</p>
          ) : (
            lines.map(({ product: p, qty }) => (
              <div key={p.id} className="tn-item">
                <span className="tn-item-emoji">{p.emoji}</span>
                <div>
                  <strong>{p.name}</strong>
                  <br />
                  <small>{money(p.price)}</small>
                </div>
                <div className="tn-qty">
                  <button type="button" aria-label="Quitar uno" onClick={() => changeQty(p.id, -1)}>−</button>
                  <span>{qty}</span>
                  <button type="button" aria-label="Sumar uno" onClick={() => changeQty(p.id, 1)}>+</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="tn-total"><span>Total</span><span>{money(total)}</span></div>

        {lines.length > 0 && (
          <>
            <button type="button" className="tn-btn tn-btn-dark" onClick={() => setPaying(p => !p)}>Pagar online</button>
            {paying && (
              <div className="tn-pay">
                {METHODS.map(([value, label]) => (
                  <label key={value}>
                    <input type="radio" name="tn-method" checked={method === value} onChange={() => setMethod(value)} /> {label}
                  </label>
                ))}
                <button type="button" className="tn-btn tn-btn-dark" onClick={confirm}>Confirmar pedido</button>
                <p>{note}</p>
              </div>
            )}
            <a className="tn-btn tn-btn-wa" href={waLink(orderMessage())} target="_blank" rel="noopener noreferrer">
              Enviar pedido por WhatsApp
            </a>
          </>
        )}
      </aside>
    </>
  )
}
