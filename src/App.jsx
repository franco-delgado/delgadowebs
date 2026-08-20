import React from "react";
//import { BrowserRoute as Router, Routes, Route } from "react-router-dom";
import {
  HashRouter as Router,
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
import Restaurante from "./hotel/restaurante/restaurante-temp";
import ContactoHotel from "./hotel/contacto/ContactoHotel";
import LandingPage from "./LandingPage/LandingPage";
import Concesionaria from "./concesionaria/Concesionaria";
import GestorCobranzasApp from './Cobranzas_Expres/GestorDeDatos';
import ClinicaTurnos from "./Clinica_Turnos/ClinicaRoutes";
/*CODIGOS DE VEHICULOS*/
import VentoLanding from "./concesionaria/detalles-de-vehiculos/VentoLanding/VentoLanding";
import "./App.css";
import MensajeWhatsapp from "./components/mensajeWhatsapp";

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
              Listo para dar vida a tu hotel en línea y multiplicar tus reservas directas?
              Desarrollamos sitios web modernos, atractivos y funcionales diseñados específicamente para hoteles, posadas y alojamientos.
              ¿Qué incluye el servicio?
              Motor de reservas integrado: Tus huéspedes podrán verificar disponibilidad y reservar su habitación al instante las 24 horas.
              Diseño optimizado y responsivo: Excelente experiencia visual en celulares, tablets y computadoras.
              Catálogo de habitaciones y servicios: Presentación clara de suites, comodidades, tarifas y galerías de fotos.
              Control y autonomía: Administra la disponibilidad y la información de tu hotel de forma rápida y sencilla.
            </p>
          </div>
        </Link>
      </div>

      <div className="conten-clienteDeuda">
        <div className="clienteDeuda" onClick={() => navigate("/GestorCobranzasApp")}>
          <div className="img-clienteDeuda">
            <div className="text">
              <h3 className="texclienteDeuda">Cobranzas Expres</h3>
              <p className="pclienteDeuda">
                Plataforma web diseñada para optimizar y simplificar la gestión financiera de clientes, planes de pago y seguimiento de morosidad en tiempo real.
                Control Centralizado: Gestión integral de clientes por DNI, datos de contacto y planes de pago personalizados.
                Métricas Clave: Tablero con KPIs en tiempo real (Saldo Pendiente, Cuotas Vencidas, Atraso Promedio y Atraso Máximo) para una toma de decisiones rápida.
                Seguimiento Detallado: Desglose cuota por cuota con indicadores de estado (Pendiente, Vencida), días de mora acumulados y registro inmediato de pagos.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN BLOG */}
      <div className="conten-blog">
        <div className="conten-imgblog">
          {/* 👈 Modificado para usar navigate en lugar de window.location.href */}
          <div className="blog" onClick={() => navigate("/LandingPage")}>
            <div className="text">
              <h3 className="textblog">Expandí tu Presencia Digital</h3>
              <p className="pblog">
                Landing Page para Eventos, Noticias y Fidelización
                Presento un prototipo de landing page diseñado para marcas, hoteles o espacios culturales que buscan comunicar sus novedades y conectar de manera directa con su audiencia.
                Secciones y funcionalidades clave:
                Hero Section Impactante: Mensaje principal con llamadas a la acción para exploración rápida de cartelera o suscripción.
                Agenda de Eventos Destacados: Módulos visuales para promocionar festivales, conciertos y actividades especiales con reserva directa.
                Sección de Actualidad: Espacio dedicado a noticias, logros institucionales y novedades del establecimiento.
                Captación de Leads: Formulario de suscripción por correo electrónico para envíos prioritarios e información exclusiva.
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
              <p className="pecomer">Descubre cómo optimizar la operativa de tu negocio y elevar la experiencia de tus clientes en tiempo real. Accede a nuestra demo y prueba todas las funcionalidades de la plataforma:
                Experiencia para el cliente: Menú digital interactivo para autogestión de pedidos de forma rápida y sencilla.
                Comandas en tiempo real: Envío directo e inmediato de los pedidos a la pantalla de cocina o a la caja central.
                Control de inventario: Gestión y actualización de stock automatizada con cada venta.
                Facturación rápida: Emisión e impresión de tickets de consumo al instante.
                Gestión comercial: Administración de precios, carta digital y reportes de ventas en un solo lugar.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="conten-clinica">
        <div className="clinica" onClick={() => navigate("/clinica")}>
          <div className="img-clinica">
            <div className="text">
              <h3 className="texclinica">Turnos Online</h3>
              <p className="pclinica">
                Digitalizá la agenda de tu clínica, consultorio o centro de salud y dejá de perder turnos por teléfono.
                Desarrollamos un sistema de reserva de turnos online pensado para pacientes y para tu equipo administrativo.
                ¿Qué incluye el servicio?
                Reserva 100% online: El paciente carga DNI, nombre, fecha de nacimiento y celular, y elige profesional, fecha y horario disponible al instante.
                Cupos por profesional: Vos definís cuántos turnos por día atiende cada profesional; el sistema respeta ese límite automáticamente.
                Panel administrativo: Visualizá todos los turnos reservados, filtrá por profesional o paciente, y cancelá cuando haga falta.
                Gestión de profesionales: Agregá o quitá profesionales de tu equipo sin tocar código, en cualquier momento.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="conten-auto">
        <div className="auto" onClick={() => navigate("/concesionaria")}>
          <div className="img-auto">
            <div className="text">
              <h3 className="texauto">Concesionaria</h3>
              <p className="pauto">
                Impulsá las ventas de tu Concesionaria con una Web Profesional y Moderna
                Digitalizá tu showroom y permití que tus clientes encuentren su próximo vehículo desde cualquier dispositivo, las 24 horas del día.
                Funcionalidades destacadas del sistema:
                Filtro por Categorías: Clasificación rápida por Autos, Camionetas, 4x4 y Motos.
                Catálogo Multimarca: Exhibición de modelos (Toyota, Ford, Volkswagen, Chevrolet, Honda, Yamaha y más).
                Fichas de Vehículos: Visualización de precios, fotos e información detallada de cada unidad.
                Captación Directa de Leads: Botones inmediatos de "Consultar" en cada vehículo para recibir prospectos de forma rápida.
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
      <MensajeWhatsapp />
    </div>
  );
}

// Componente App que maneja el enrutamiento limpio
function App() {
  return (
    // 🚀 AQUÍ agregamos el basename sin la "s"
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
        <Route path="/Restaurante" element={<Restaurante />} />
        <Route path="/contactoHotel" element={<ContactoHotel />} />
        <Route path="/LandingPage" element={<LandingPage />} />
        <Route path="/concesionaria" element={<Concesionaria />} />
        <Route path="/GestorCobranzasApp" element={<GestorCobranzasApp />} />
        <Route path="/clinica/*" element={<ClinicaTurnos />} />
        <Route
          path="/detalles-de-vehiculos/VentoLanding"
          element={<VentoLanding />}
        />
      </Routes>
    </Router>
  );
}

export default App;
