import { useState } from 'react'
import { hueFor, useTienda } from '../context/TiendaContext'

export default function Catalogo() {
  const { settings, products, categories, money, addToCart } = useTienda()
  const [cat, setCat] = useState('Todo')
  const active = cat === 'Todo' || categories.includes(cat) ? cat : 'Todo'
  const visible = products.filter(p => active === 'Todo' || p.category === active)

  return (
    <>
      <section className="tn-hero">
        <h1>Verde para cada rincón.</h1>
        <p>{settings.tagline} Armá tu pedido y pagalo online o coordiná por WhatsApp.</p>
      </section>

      <div className="tn-wrap">
        <div className="tn-tabs" role="group" aria-label="Categorías">
          {['Todo', ...categories].map(c => (
            <button key={c} type="button" className="tn-tab" aria-pressed={c === active} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="tn-empty">Todavía no hay productos en esta categoría.</p>
        ) : (
          <div className="tn-grid">
            {visible.map(p => (
              <article key={p.id} className="tn-card">
                <div className="tn-pic" style={{ background: `hsl(${hueFor(p.category)} 45% 84%)` }} aria-hidden="true">
                  {p.emoji}
                </div>
                <div className="tn-info">
                  <h3>{p.name}</h3>
                  <small>{p.desc}</small>
                  <div className="tn-row">
                    <span className="tn-price">{money(p.price)}</span>
                    <button type="button" className="tn-add" disabled={p.stock < 1} onClick={() => addToCart(p.id)}>
                      {p.stock < 1 ? 'Sin stock' : 'Agregar'}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
