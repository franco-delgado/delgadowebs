import React from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import CategoryPage from "./Radio/pages/CategoryPage/CategoryPage.jsx";
import { RadioProvider } from "./Radio/context/RadioContext";
import Hotel from "./hotel/hotel";
import Room from "./hotel/room/Room";
import Single from "./hotel/room/single/Single";
import Doble from "./hotel/room/doble/Doble";
import Suit from "./hotel/room/suite/Suite";
import Restaurante from "./hotel/restaurante/restaurante-temp";
import ContactoHotel from "./hotel/contacto/ContactoHotel";
import LandingPage from "./LandingPage/LandingPage";
import Concesionaria from "./concesionaria/Concesionaria";
import GestorCobranzasApp from "./Cobranzas_Expres/GestorDeDatos";
import ClinicaTurnos from "./Clinica_Turnos/ClinicaRoutes";
import Radio from "./Radio/Radio";
import GimnasioApp from "./gimnasio/App";
import Chacarita from "./Chacarita/Chacarita";

/* CÓDIGOS DE VEHÍCULOS */
import VentoLanding from "./concesionaria/detalles-de-vehiculos/VentoLanding/VentoLanding";
import "./App.css";
import MensajeWhatsapp from "./components/mensajeWhatsapp";

const EMAIL = "delgadofranco992@gmail.com";

/* Proyectos: para agregar o quitar uno, editá solo esta lista.
   - `to` es una ruta interna; `href` es un link externo.
   - `img` es la clase de imagen definida en App.css (img-hotel, etc.). */
const PROYECTOS = [
  {
    id: "hotel",
    img: "img-hotel",
    titulo: "Web con reservas para hoteles y posadas",
    resumen:
      "Un sitio que muestra tus habitaciones y deja que el huésped reserve directo, a cualquier hora, sin pasar por intermediarios.",
    puntos: [
      "Motor de reservas con disponibilidad en tiempo real",
      "Catálogo de habitaciones con tarifas, servicios y fotos",
      "Diseño pensado para celular, tablet y computadora",
    ],
    etiquetas: ["Hotelería", "Reservas online"],
    to: "/hotel",
  },
  {
    id: "cobranzas",
    img: "img-cobranzas",
    titulo: "Cobranzas Express: control de deudas y cuotas",
    resumen:
      "Un sistema para saber quién te debe, cuánto y desde cuándo, con los pagos registrados en el momento.",
    puntos: [
      "Clientes y planes de pago ordenados por DNI",
      "Tablero con saldo pendiente, cuotas vencidas y atraso",
      "Detalle cuota por cuota con días de mora y registro de pagos",
    ],
    etiquetas: ["Gestión", "Finanzas"],
    to: "/GestorCobranzasApp",
  },
  {
    id: "landing",
    img: "img-blog",
    titulo: "Landing page para eventos y novedades",
    resumen:
      "Una página de presentación para marcas, hoteles y espacios culturales que quieren mostrar su agenda y sumar contactos.",
    puntos: [
      "Portada con llamadas a la acción claras",
      "Agenda de eventos con reserva directa",
      "Sección de noticias y suscripción por correo",
    ],
    etiquetas: ["Marketing", "Eventos"],
    to: "/LandingPage",
  },
  {
    id: "cafe",
    img: "img-cafe",
    titulo: "Café-bar con pedidos desde la mesa",
    resumen:
      "El cliente pide desde su celular y el pedido llega solo a cocina o caja. Menos errores y mesas atendidas más rápido.",
    puntos: [
      "Menú digital para que el cliente haga su pedido",
      "Comandas en tiempo real y stock que se actualiza con cada venta",
      "Tickets al instante, precios y reportes de ventas en un solo lugar",
    ],
    etiquetas: ["Gastronomía", "Pedidos QR"],
    href: "https://pedidos-qr.netlify.app/",
    externo: true,
  },
  {
    id: "clinica",
    img: "img-clinica",
    titulo: "Turnos online para clínicas y consultorios",
    resumen:
      "Los pacientes sacan turno solos, sin llamar, y tu equipo ve toda la agenda en un panel.",
    puntos: [
      "Reserva por profesional, fecha y horario disponible",
      "Cupo diario por profesional que el sistema respeta",
      "Panel para filtrar, cancelar turnos y gestionar el equipo",
    ],
    etiquetas: ["Salud", "Agenda"],
    to: "/clinica",
  },
  {
    id: "concesionaria",
    img: "img-auto",
    titulo: "Catálogo web para concesionarias",
    resumen:
      "Tu showroom abierto las 24 horas: el cliente filtra, compara y te consulta por el vehículo que le interesa.",
    puntos: [
      "Filtros por autos, camionetas, 4x4 y motos",
      "Fichas con fotos, precio y datos de cada unidad",
      "Botón «Consultar» en cada vehículo para recibir contactos",
    ],
    etiquetas: ["Automotriz", "Catálogo"],
    to: "/concesionaria",
  },
  {
    id: "radio",
    img: "img-radio",
    titulo: "Portal de noticias con radio en vivo",
    resumen:
      "El sitio de tu emisora con audio en directo y noticias por sección, administrable sin tocar código.",
    puntos: [
      "Reproductor en vivo con control de volumen",
      "Noticias por categoría y cintillo de último momento",
      "Panel para cargar artículos y gestionar la señal",
    ],
    etiquetas: ["Medios", "Streaming"],
    to: "/Radio",
  },
  {
    id: "gimnasio",
    img: "img-gimnasio",
    titulo: "GymFlow: gestión integral de gimnasios",
    resumen:
      "Un solo lugar para administrar socios, entrenadores, membresías y cobros.",
    puntos: [
      "Alta y seguimiento de socios y entrenadores",
      "Control de membresías y vencimientos",
      "Resumen de ingresos y finanzas en tiempo real",
    ],
    etiquetas: ["Deporte", "Administración"],
    to: "/gimnasio",
  },
];

function Proyecto({ p }) {
  const enlace = p.externo ? (
    <a className="proyecto-link" href={p.href} target="_blank" rel="noopener noreferrer">
      Ver demo
      <span className="sr-only"> de {p.titulo} (se abre en una pestaña nueva)</span>
    </a>
  ) : (
    <Link className="proyecto-link" to={p.to}>
      Ver demo
      <span className="sr-only"> de {p.titulo}</span>
    </Link>
  );

  return (
    <article className="proyecto">
      <div className={`proyecto-img ${p.img}`} role="img" aria-label={`Imagen del proyecto: ${p.titulo}`} />
      <div className="proyecto-cuerpo">
        <ul className="etiquetas">
          {p.etiquetas.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
        <h3>{p.titulo}</h3>
        <p className="proyecto-resumen">{p.resumen}</p>
        <ul className="puntos">
          {p.puntos.map((pt) => (
            <li key={pt}>{pt}</li>
          ))}
        </ul>
        {enlace}
      </div>
    </article>
  );
}

// Página de inicio
function Inicio() {
  return (
    <div className="portfolio">
      <header className="hero">
        <p className="hero-marca">Delgado Webs</p>
        <h1>Sitios y sistemas web para que tu negocio venda y trabaje mejor.</h1>
        <p className="hero-texto">
          Soy Franco Delgado, desarrollador web. Diseño y programo páginas
          y herramientas a medida: reservas, turnos, pedidos, catálogos y
          paneles de gestión. Abajo tenés demos que podés abrir y probar.
        </p>
        <div className="hero-acciones">
          <a className="boton boton-primario" href="#proyectos">
            Ver proyectos
          </a>
          <a className="boton" href={`mailto:${EMAIL}`}>
            Escribime
          </a>
        </div>
      </header>

      <main id="proyectos" className="proyectos">
        <h2 className="seccion-titulo">Proyectos de ejemplo</h2>
        {PROYECTOS.map((p) => (
          <Proyecto key={p.id} p={p} />
        ))}
      </main>

      <footer className="contacto">
        <h2>¿Tenés un negocio y querés tu propia web?</h2>
        <p>
          Contame qué necesitás y te respondo con una propuesta. Escribime a{" "}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
        </p>
        <a className="boton boton-primario" href={`mailto:${EMAIL}?subject=Consulta%20desde%20tu%20portfolio`}>
          Enviar un correo
        </a>
      </footer>

      <MensajeWhatsapp />
    </div>
  );
}

// Enrutamiento
function App() {
  return (
    <RadioProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Inicio />} />
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
          <Route path="/Radio/*" element={<Radio />} />
          <Route path="/admin/*" element={<Radio />} />
          <Route path="/categoria/:id" element={<CategoryPage />} />
          <Route path="/gimnasio/*" element={<GimnasioApp />} />
          <Route path="/detalles-de-vehiculos/VentoLanding" element={<VentoLanding />} />
          <Route path="/chacarita/*" element={<Chacarita />} />
        </Routes>
      </Router>
    </RadioProvider>
  );
}

export default App;
