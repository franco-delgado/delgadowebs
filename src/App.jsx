import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Hotel from "./hotel/hotel";
import Room from "./hotel/room/Room";
import Single from "./hotel/room/single/Single";
import Doble from "./hotel/room/doble/Doble";
import Suit from "./hotel/room/suite/Suite";
import Restaurante from "./hotel/restaurante/Restaurante";
import ContactoHotel from "./hotel/contacto/ContactoHotel";
import LandingPage from "./LandingPage/LandingPage";
import Concesionaria from "./concesionaria/Concesionaria";
/*CODIGOS DE VEHICULOS*/
import VentoLanding from "./concesionaria/detalles-de-vehiculos/VentoLanding/VentoLanding";
import "./App.css";

// Componente para la página de inicio (mantiene todas tus clases intactas)
function Inicio() {
  const irA = (ruta) => {
    window.location.href = ruta;
  };

  return (
    <div className="conten-principal">
      <div className="title">
        <h1 title="etiqueta">DELGADO WEBS</h1>
      </div>

      <div className="primerp">
        <h2 className="pprimer">
          En nuestra plataforma, te ofrecemos una amplia variedad de soluciones
          digitales...
        </h2>
      </div>

      {/* SECCIÓN HOTEL: Usa Link para ir a tu componente .jsx respetando el CSS */}
      <div className="prueba">
        <Link to="/hotel" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="hotel">
            <div className="texth">
              <h3 className="thotel">HOTEL</h3>
              <p className="photel">
                ¿Listo para dar vida a tu hotel en línea?...
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* SECCIÓN BLOG */}
      <div className="conten-blog">
        <div className="conten-imgblog">
          <div className="blog" onClick={() => irA("/LandingPage")}>
            <div className="text">
              <h3 className="textblog">Expandí tu Presencia Digital</h3>
              <p className="pblog">
                El portal definitivo para comunicar tus eventos, conectar con tu
                audiencia y proyectar tu negocio hacia el próximo nivel.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN RESTORANT */}
      <div className="conten-interno">
        <div className="conten-imginterno">
          <div
            className="ecomer"
            onClick={() => irA("https://pedidos-qr.netlify.app/")}
          >
            <div className="texte">
              <h3 className="tecomer">CAFE-BAR pedidos por clientes</h3>
              <p className="pecomer">Descubre la eficiencia y comodidad...</p>
            </div>
            <span className="secomer">
              <img className="img-cliente" src="/cliente.jpg" alt="Cliente" />
            </span>
          </div>
        </div>
      </div>

      {/* SECCIÓN AUTOS */}
      <div className="auto" onClick={() => irA("/concesionaria")}>
        <div className="text">
          <h3 className="texauto">Concesionaria</h3>
          <p className="pauto">
            Explora nuestra plantilla de muestra para páginas de
            concesionarias...
          </p>
        </div>
        <span className="secomer">
          <img className="img-auto" src="/imagen2.jpg" alt="Auto" />
        </span>
      </div>

      <footer>
        <div className="fin">
          <p className="pfin">
            Contactanos a nuestro email: delgadofranco992@gmail.com o haciendo{" "}
            <b className="email">
              <a href="hotel/contacto/index.php">click aqui.</a>
            </b>
          </p>
        </div>
      </footer>
    </div>
  );
}

// Componente App que maneja el enrutamiento limpio
function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal */}
        <Route path="/" element={<Inicio />} />

        {/* Ruta hacia el componente Hotel que migramos */}
        <Route path="/hotel" element={<Hotel />} />
        <Route path="/room" element={<Room />} />
        <Route path="/single" element={<Single />} />
        <Route path="/doble" element={<Doble />} />
        <Route path="/suit" element={<Suit />} />
        <Route path="/restaurante" element={<Restaurante />} />
        <Route path="/contactoHotel" element={<ContactoHotel />} />
        <Route path="/LandingPage" element={<LandingPage />} />
        <Route path="/concesionaria" element={<Concesionaria />} />
        <Route
          path="/detalles-de-vehiculos/VentoLanding"
          element={<VentoLanding />}
        />
      </Routes>
    </Router>
  );
}

export default App;
