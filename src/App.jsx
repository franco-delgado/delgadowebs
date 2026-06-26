import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
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

// Componente para la página de inicio
function Inicio() {
  const navigate = useNavigate(); // 👈 Usamos el hook de React Router para navegación interna

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

      {/* SECCIÓN HOTEL */}
      <div className="prueba">
        <Link to="/hotel" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="text">
            <h3 className="thotel">HOTEL</h3>
            <p className="photel">
              ¿Listo para dar vida a tu hotel en línea?...
            </p>
          </div>
        </Link>
      </div>

      {/* SECCIÓN BLOG */}
      <div className="conten-blog">
        <div className="conten-imgblog">
          {/* 👈 Modificado para usar navigate en lugar de window.location.href */}
          <div className="blog" onClick={() => navigate("/LandingPage")}>
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
          {/* Aquí se mantiene window.location.href porque es un enlace externo a Netlify */}
          <div
            className="ecomer"
            onClick={() =>
              (window.location.href = "https://pedidos-qr.netlify.app/")
            }
          >
            <div className="text">
              <h3 className="tecomer">CAFE-BAR pedidos por clientes</h3>
              <p className="pecomer">Descubre la eficiencia y comodidad...</p>
            </div>
            <span className="secomer">
              <img className="img-cliente" src="/cliente.jpg" alt="Cliente" />
            </span>
          </div>
        </div>
      </div>
      <div className="conten-auto">
        <div className="auto" onClick={() => navigate("/concesionaria")}>
          <div className="img-auto">
            <div className="text">
              <h3 className="texauto">Concesionaria</h3>
              <p className="pauto">
                Explora nuestra plantilla de muestra para páginas de
                concesionarias...
              </p>
            </div>
          </div>
        </div>
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
    // 🚀 AQUÍ agregamos el basename sin la "s"
    <Router basename="/delgadowebs">
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
