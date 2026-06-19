import React from "react";
import { useNavigate } from "react-router-dom";
import "./VentoLanding.css"; // Archivo de estilos personalizado

function VentoLanding() {
  const navigate = useNavigate();

  // Datos de contacto de ejemplo
  const contactWhatsApp = "5493804112233";

  return (
    <div className="landing-container">
      {/* --- BARRA DE NAVEGACIÓN --- */}
      <nav className="landing-nav">
        <button className="back-button" onClick={() => navigate(-1)}>
          &larr; Volver
        </button>
        <div className="brand-logo">MAX MOTORS</div>
      </nav>

      {/* --- SECCIÓN HERO (PORTADA principal) --- */}
      <header className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Vento</h1>
          </div>
        </div>
      </header>

      {/* --- SECCIÓN NOVEDADES --- */}
      <section className="novedades-section">
        <h2 className="section-main-title">Tecnología que te moviliza</h2>
        <p className="section-subtitle">Novedades</p>
        <p className="section-description">Con Vento, el presente es digital</p>

        <div className="video-container">
          {/* Aquí puedes usar una imagen destacada o una etiqueta <video> */}
          <img
            src="https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80"
            alt="Faro Vento destacado"
            className="highlight-image"
          />
        </div>
      </section>

      {/* --- SECCIÓN CARACTERÍSTICAS (Grid Alternado) --- */}
      <section className="features-section">
        <div className="features-header">
          <h2>Características</h2>
          <p>Un auto que se adapta a vos.</p>
        </div>

        {/* Característica 1: Tablero Digital (Imagen Izquierda, Texto Derecha) */}
        <div className="feature-row">
          <div className="feature-image-block">
            <img
              src="https://images.unsplash.com/photo-1504215680048-db15dc05967b?auto=format&fit=crop&w=600&q=80"
              alt="Tablero Digital Vento"
            />
          </div>
          <div className="feature-text-block">
            <h3>Tablero Digital</h3>
            <h4>Tecnología para todos tus viajes</h4>
            <p>
              El Vento incorpora la segunda generación del tablero digital
              Active Info Display, brindando una lectura clara, dinámica y 100%
              personalizada de toda la información de viaje.
            </p>
          </div>
        </div>

        {/* Característica 2: Light Assist (Imagen Derecha, Texto Izquierda) */}
        <div className="feature-row reverse">
          <div className="feature-image-block">
            <img
              src="https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=600&q=80"
              alt="Asistente de luces Light Assist"
            />
          </div>
          <div className="feature-text-block">
            <h3>Light Assist</h3>
            <h4>Tu camino más claro</h4>
            <p>
              El sistema Light Assist te permite iluminar hasta el mínimo
              detalle, activando y desactivando las luces altas de manera
              automática en momentos claves de tu viaje para evitar encandilar a
              otros conductores.
            </p>
          </div>
        </div>

        {/* Característica 3: Motor (Imagen Izquierda, Texto Derecha) */}
        <div className="feature-row">
          <div className="feature-image-block">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCXONevbT3Q-mw5Ay2fWR4juOlVmt-ugHE1Q&s"
              alt="Motor TSI"
            />
          </div>
          <div className="feature-text-block">
            <h3>Motor</h3>
            <h4>Potencia y eficiencia</h4>
            <p>
              El motor TSI está diseñado para lograr altos niveles de potencia
              combinados con un bajo consumo. Tiene cuatro modos de manejo
              integrados: Eco, Sport, Normal y Personalizada, adaptándose a tu
              estilo.
            </p>
          </div>
        </div>
      </section>

      {/* --- BOTONES FLOTANTES DE CONTACTO --- */}
      <div className="floating-actions">
        <a
          href={`https://wa.me/${contactWhatsApp}?text=Hola,%20estoy%20interesado%20en%20el%20Vento`}
          target="_blank"
          rel="noreferrer"
          className="floating-btn whatsapp-btn"
          title="Consultar por WhatsApp"
        >
          💬
        </a>
        <button
          onClick={() => window.print()}
          className="floating-btn contact-btn"
          title="Soporte / Ficha Técnica"
        >
          🎧
        </button>
      </div>
    </div>
  );
}
export default VentoLanding;
