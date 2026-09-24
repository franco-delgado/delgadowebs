import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import escudoImg from './escudo.png';

export default function Chacarita() {
  // Carga las fuentes dinámicamente y ejecuta el script JS existente
  useEffect(() => {
    // Cargar Google Fonts
    const fontLink1 = document.createElement('link');
    fontLink1.rel = 'preconnect';
    fontLink1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(fontLink1);

    const fontLink2 = document.createElement('link');
    fontLink2.rel = 'preconnect';
    fontLink2.href = 'https://fonts.gstatic.com';
    fontLink2.crossOrigin = 'anonymous';
    document.head.appendChild(fontLink2);

    const fontStyle = document.createElement('link');
    fontStyle.rel = 'stylesheet';
    fontStyle.href = 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap';
    document.head.appendChild(fontStyle);

    // Cargar la lógica interactiva de script.js
    const script = document.createElement('script');
    script.src = new URL('./script.js', import.meta.url).href;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Limpieza al desmontar la vista
      document.head.removeChild(fontLink1);
      document.head.removeChild(fontLink2);
      document.head.removeChild(fontStyle);
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="chacarita-container">
      {/* Botón de regreso usando React Router */}
      <Link id="tempBackBtn" to="/" title="Volver a la página principal">
        &#8592;
      </Link>

      <header>
        <div className="headwrap">
          <div className="brand">
            <img className="crest" src={escudoImg} alt="Escudo Club Chacarita Jrs Aimogasta" />
            Club Chacarita Jrs Aimogasta
          </div>
          <nav>
            <button className="navlink" data-view="home">Inicio</button>
            <button className="navlink" data-view="categories">Categorías</button>
            <button className="navlink" data-view="reserve">Reservar cancha</button>
            <button className="navlink" data-view="admin">Admin</button>
          </nav>
        </div>
      </header>

      <main>
        <section id="view-home">
          <div className="hero">
            <div style={{ display: 'flex', alignItems: 'center', gap: '22px', flexWrap: 'wrap' }}>
              <img className="crest-hero" src={escudoImg} alt="Escudo del club" />
              <div>
                <h1>Pasión, esfuerzo y comunidad</h1>
                <p>Todas las novedades del club: fútbol, rugby, vóley y mucho más. Enterate de lo último y reservá la cancha en minutos.</p>
              </div>
            </div>
          </div>
          <h2 className="section-title">Novedades</h2>
          <div className="news-grid" id="newsGrid"></div>
        </section>

        <section id="view-categories" className="hidden">
          <h2 className="section-title">Nuestras disciplinas</h2>
          <div className="cat-grid" id="catGrid"></div>
        </section>

        <section id="view-reserve" className="hidden">
          <h2 className="section-title">Reservar la cancha</h2>
          <div className="date-tabs" id="dateTabs"></div>
          <div className="slots" id="slotsGrid"></div>
        </section>

        <section id="view-admin" className="hidden">
          <div id="adminLogin" className="login-box">
            <h3>Acceso administrador</h3>
            <input type="password" id="adminPass" placeholder="Contraseña" />
            <button className="btn" id="adminLoginBtn">Ingresar</button>
            <p className="small">Demo: contraseña "chacarita2026"</p>
          </div>
          <div id="adminPanel" className="hidden">
            <div className="admin-tabs">
              <button className="atab active" data-atab="news">Novedades</button>
              <button className="atab" data-atab="bookings">Turnos solicitados</button>
              <button className="atab" data-atab="prices">Precios</button>
              <button className="atab" data-atab="cats">Categorías</button>
            </div>

            <div id="atab-news">
              <h3>Publicar novedad</h3>
              <div className="field"><label>Título</label><input id="nTitle" /></div>
              <div className="field"><label>Texto</label><textarea id="nText"></textarea></div>
              <div className="field"><label>URL de imagen (opcional)</label><input id="nImg" placeholder="https://..." /></div>
              <div className="field"><label>URL de video de YouTube (opcional)</label><input id="nVideo" placeholder="https://youtube.com/watch?v=..." /></div>
              <button className="btn" id="nSaveBtn">Publicar</button>
              <input type="hidden" id="nEditId" />
              <h3 style={{ marginTop: '30px' }}>Novedades publicadas</h3>
              <div id="newsAdminList"></div>
            </div>

            <div id="atab-bookings" className="hidden">
              <h3>Turnos solicitados</h3>
              <div id="bookingsList"></div>
            </div>

            <div id="atab-prices" className="hidden">
              <h3>Precios por franja</h3>
              <div className="price-bulk">
                <div className="field"><label>Precio turnos DÍA (08:00–18:59)</label><input type="number" id="dayPriceInput" /></div>
                <button className="btn" id="applyDayBtn">Aplicar a turnos día</button>
                <div className="field"><label>Precio turnos NOCHE (19:00–23:59)</label><input type="number" id="nightPriceInput" /></div>
                <button className="btn" id="applyNightBtn">Aplicar a turnos noche</button>
              </div>
              <h3>Precio individual por horario</h3>
              <table>
                <thead>
                  <tr>
                    <th>Horario</th>
                    <th>Franja</th>
                    <th>Precio</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody id="priceTableBody"></tbody>
              </table>
            </div>

            <div id="atab-cats" className="hidden">
              <h3>Descripciones de categorías</h3>
              <div id="catAdminList"></div>
              <button className="btn" id="catSaveBtn" style={{ marginTop: '10px' }}>Guardar descripciones</button>
            </div>
          </div>
        </section>
      </main>

      <footer>Club Chacarita Jrs Aimogasta — Demo funcional: los datos se guardan en este navegador.</footer>

      <div id="modalRoot"></div>
      <div id="toastRoot"></div>
    </div>
  );
}