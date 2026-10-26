import './Tienda.css'
import { TiendaProvider, useTienda } from './context/TiendaContext'
import Catalogo from './user/Catalogo'
import CartDrawer from './user/CartDrawer'
import AdminPage from './admin/AdminPage'

function Shell({ onBack, backHref, backLabel, showBack }) {
  const { settings, view, setView, auth, setAuth, count, setCartOpen, waLink, toast, resetDemo, notify } = useTienda()
  const goBack = () => (onBack ? onBack() : window.history.back())
  const isAdmin = view === 'admin'

  const reset = () => {
    if (window.confirm('Se borrarán los cambios y pedidos de esta demo. ¿Continuar?')) {
      resetDemo()
      notify('Demo restablecida')
    }
  }

  return (
    <div className="tn-app">
      {showBack && (
        <div className="tn-back">
          {backHref && !onBack ? (
            <a href={backHref}>← {backLabel}</a>
          ) : (
            <button type="button" onClick={goBack}>← {backLabel}</button>
          )}
        </div>
      )}

      <header className="tn-header">
        <button type="button" className="tn-logo" onClick={() => setView('shop')}>
          {settings.name.toLowerCase()}
          {isAdmin && <small> admin</small>}
        </button>
        <nav className="tn-nav">
          {isAdmin ? (
            <>
              <button type="button" className="tn-sm" onClick={reset}>Restablecer demo</button>
              <button type="button" className="tn-sm" onClick={() => setView('shop')}>Ver tienda</button>
              {auth && <button type="button" className="tn-sm" onClick={() => { setAuth(false); setView('shop') }}>Salir</button>}
            </>
          ) : (
            <button type="button" className="tn-cartbtn" onClick={() => setCartOpen(true)} aria-label="Abrir carrito">
              Carrito<b>{count}</b>
            </button>
          )}
        </nav>
      </header>

      <main>{isAdmin ? <AdminPage /> : <Catalogo />}</main>

      {!isAdmin && (
        <>
          <footer className="tn-footer">
            Tienda de demostración ·{' '}
            <button type="button" className="tn-link" onClick={() => setView('admin')}>Panel de administración</button>
          </footer>
          <a className="tn-wa" href={waLink('Hola, quisiera hacer una consulta.')} target="_blank" rel="noopener noreferrer">
            💬 Consultanos por WhatsApp
          </a>
          <CartDrawer />
        </>
      )}

      <div className={`tn-toast ${toast ? 'tn-on' : ''}`} role="status">{toast}</div>
    </div>
  )
}

/* Punto de entrada: importá este componente donde quieras mostrar la tienda.
   Botón "Volver al portfolio" (props opcionales):
   - onBack:    función que se ejecuta al hacer clic (ej. () => navigate('/'))
   - backHref:  alternativa: link a la página del portfolio
   - backLabel: texto del botón (por defecto "Volver al portfolio")
   - showBack:  false para ocultarlo
   Si no pasás onBack ni backHref, vuelve a la página anterior del navegador. */
export default function Tienda({ onBack, backHref, backLabel = 'Volver al portfolio', showBack = true }) {
  return (
    <TiendaProvider>
      <Shell onBack={onBack} backHref={backHref} backLabel={backLabel} showBack={showBack} />
    </TiendaProvider>
  )
}
