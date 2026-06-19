import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();
  // Estado para el input de suscripción
  const [email, setEmail] = useState("");

  const eventos = [
    {
      id: 1,
      titulo: "Festival Gastronómico 2026",
      fecha: "15 de Octubre, 2026",
      descripcion:
        "Disfrutá de los mejores platos locales, bodegas exclusivas y música en vivo.",
      imagen:
        "https://images.pexels.com/photos/9901432/pexels-photo-9901432.jpeg",
    },
    {
      id: 2,
      titulo: "Concierto Acústico Bajo las Estrellas",
      fecha: "05 de Noviembre, 2026",
      descripcion:
        "Una noche íntima con artistas locales en los jardines principales del hotel.",
      imagen:
        "https://images.pexels.com/photos/4545044/pexels-photo-4545044.jpeg",
    },
  ];

  const noticias = [
    {
      id: 1,
      titulo: "Renovación total de nuestras suites ejecutivas",
      categoria: "Novedades",
      resumen:
        "Presentamos un nuevo concepto de diseño minimalista y sustentable para tu máximo confort.",
      fecha: "Hace 2 días",
    },
    {
      id: 2,
      titulo: "Ganadores del premio Excelencia Hotelera 2026",
      categoria: "Logros",
      resumen:
        "Fuimos galardonados por nuestro servicio al cliente y compromiso ecológico en la región.",
      fecha: "Hace 1 semana",
    },
  ];

  const handleSuscripcion = (e) => {
    e.preventDefault();
    alert(`¡Gracias por suscribirte con: ${email}!`);
    setEmail("");
  };

  return (
    <div className="landing-contenedor">
      <div className="barra-superior">
        <div className="contenedor-h1-menu">
          <h1>LANDING PAGE</h1>
          <div className="back" onClick={() => navigate(-1)}></div>
        </div>
      </div>
      {/* SECCIÓN HERO */}
      <header className="hero-seccion">
        <div className="hero-contenido">
          <h2 className="hero-titulo">
            Conectá, informá y hacé crecer tu marca.
          </h2>
          <p className="hero-subtitulo">
            Tu nueva plataforma web diseñada para comunicar tus mejores eventos
            y novedades, rompiendo fronteras para llegar exactamente a donde
            están tus clientes.
          </p>
          <div className="hero-botones">
            <a href="#eventos" className="btn-primario">
              Próximos Eventos
            </a>
            <a href="#newsletter" className="btn-secundario">
              Suscribirse
            </a>
          </div>
        </div>
      </header>

      {/* SECCIÓN EVENTOS */}
      <section id="eventos" className="seccion-bloque">
        <div className="seccion-encabezado">
          <span className="seccion-tagline">Agenda</span>
          <h2 className="seccion-titulo">Eventos Destacados</h2>
          <div className="linea-decorativa"></div>
        </div>

        <div className="eventos-grid">
          {eventos.map((evento) => (
            <div key={evento.id} className="tarjeta-evento">
              <div className="tarjeta-imagen-wrapper">
                <img
                  src={evento.imagen}
                  alt={evento.titulo}
                  className="tarjeta-imagen"
                />
              </div>
              <div className="tarjeta-contenido">
                <span className="evento-fecha">{evento.fecha}</span>
                <h3 className="evento-titulo">{evento.titulo}</h3>
                <p className="evento-descripcion">{evento.descripcion}</p>
                <button className="btn-enlace">Reservar Lugar →</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN NOTICIAS */}
      <section id="noticias" className="seccion-bloque bg-alterno">
        <div className="seccion-encabezado">
          <span className="seccion-tagline">Actualidad</span>
          <h2 className="seccion-titulo">Últimas Noticias</h2>
          <div className="linea-decorativa"></div>
        </div>

        <div className="noticias-grid">
          {noticias.map((noticia) => (
            <article key={noticia.id} className="tarjeta-noticia">
              <div className="noticia-arriba">
                <div className="noticia-meta">
                  <span className="noticia-categoria">{noticia.categoria}</span>
                  <span className="noticia-tiempo">{noticia.fecha}</span>
                </div>
                <h3 className="noticia-titulo">{noticia.titulo}</h3>
                <p className="noticia-resumen">{noticia.resumen}</p>
              </div>
              <button className="btn-leer-mas">Leer artículo completo</button>
            </article>
          ))}
        </div>
      </section>

      {/* SECCIÓN NEWSLETTER */}
      <section id="newsletter" className="seccion-bloque">
        <div className="newsletter-caja">
          <h2 className="newsletter-titulo">¿No querés perderte nada?</h2>
          <p className="newsletter-texto">
            Dejanos tu correo electrónico para recibir invitaciones prioritarias
            e información de cartelera antes que nadie.
          </p>
          <form className="newsletter-formulario" onSubmit={handleSuscripcion}>
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="newsletter-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn-formulario">
              Unirse
            </button>
          </form>
        </div>
      </section>

      {/* PIE DE PÁGINA */}
      <footer className="landing-footer">
        <p>© 2026 El Hotel - Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
