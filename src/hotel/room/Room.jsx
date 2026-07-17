import React, { useState } from "react";
import "./room.css";
import Footer from "../footer/Footer.jsx";
import { useMenu } from "../../hooks/useMenu.js";
import MenuNav from "../../components/MenuNav";
import MensajeWhatsapp from "../../components/mensajeWhatsapp.jsx";

// IMAGENES
import habitacion1 from "../../assets/habitacion1.jpg";
import habitacion2 from "../../assets/habitacion2.jpg";
import habitacion3 from "../../assets/habitacion3.jpg";

export default function Room() {
  // Estado local para controlar visualmente la hamburguesa y la clase CSS
  const [menuAbierto, setMenuAbierto] = useState(false);
  
  // Traemos las funciones de tu Hook
  const { navegarA } = useMenu();

  const clickMenuLocal = () => {
    setMenuAbierto(!menuAbierto);
  };

  // Envoltura para navegar y cerrar el menú móvil al mismo tiempo
  const manejarNavegacion = (ruta) => {
    navegarA(ruta);
    setMenuAbierto(false); 
  };

  const habitaciones = [
    { id: 1, tipo: "room-1", img: habitacion1, nombre: "Habitación Simple", ruta: "/Single" },
    { id: 2, tipo: "room-2", img: habitacion2, nombre: "Habitación Doble", ruta: "/Doble" },
    { id: 3, tipo: "room-3", img: habitacion3, nombre: "Habitación Suite", ruta: "/Suit" },
    { id: 4, tipo: "room-1", img: habitacion1, nombre: "Habitación Simple", ruta: "/Single" },
    { id: 5, tipo: "room-2", img: habitacion2, nombre: "Habitación Doble", ruta: "/Doble" },
    { id: 6, tipo: "room-3", img: habitacion3, nombre: "Habitación Suite", ruta: "/Suit" },
  ];

  return (
    <>
      {/* BARRA SUPERIOR */}
      <div className="barra-superior-room">
        <div className="contenedor-titulo-room">
          <h1>Room</h1>
        </div>

        {/* BOTÓN DESPLEGABLE MÓVIL */}
        <button className="menu-toggle-room" onClick={clickMenuLocal}>
          {menuAbierto ? "✕" : "☰"}
        </button>

        {/* CONTENEDOR DE BOTONES DINÁMICO */}
        <div className={`barramenu-room ${menuAbierto ? "open" : ""}`}>
          <button
            className="botonbarra-room"
            id="room"
            onClick={() => manejarNavegacion("/hotel")}
          >
            HOME
          </button>

          <button
            className="botonbarra-room"
            id="restaurante"
            onClick={() => manejarNavegacion("/restaurante")}
          >
            RESTAURANTE
          </button>

          <button
            className="botonbarra-room"
            id="contacto"
            onClick={() => manejarNavegacion("/ContactoHotel")}
          >
            CONTACTANOS
          </button>
      
          <button
            className="botonbarra-room"
            id="exit"
            onClick={() => manejarNavegacion("/")}
          >
            EXIT
          </button>
        </div>
      </div>

      {/* IMAGEN PRINCIPAL */}
      <div className="imagenprincipal">
        <img src={habitacion1} alt="Principal" />
      </div>

      {/* CUERPO PRINCIPAL (HABITACIONES) */}
      <div className="room-principal">
        {habitaciones.map((room) => (
          <div
            key={room.id}
            className={`contenedor ${room.tipo}`}
            onClick={() => manejarNavegacion(room.ruta)}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = "10px 10px 5px #000")
            }
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            style={{ cursor: "pointer" }}
          >
            <img src={room.img} alt={room.nombre} />
            <h2>{room.nombre}</h2>
            <p className="texto-detalle-habitacion">
              Características de la habitación
            </p>
          </div>
        ))}
      </div>

      <MensajeWhatsapp />
      
      {/* FOOTER */}
      <div id="footer-room">
        <div id="footer-izquierdo">
          <h3>CONTACTOS Y DIRECCIÓN</h3>
          <div id="contactos">
            <div className="divIcon">
              <img className="img-icon" src="./phone.svg" alt="Teléfono" />
              <p className="licon-tel">TEL: ************</p>
            </div>
            <div className="divIcon">
              <img className="img-icon" src="./message.svg" alt="Email" />
              <p className="licon-emal">Email: ****@****.com</p>
            </div>
            <div className="divIcon">
              <img className="img-icon" src="./map-location-dot.svg" alt="Ubicación" />
              <p className="licon-dir">Dir: **************</p>
            </div>
          </div>
        </div>

        <div id="footer-derecho">
          <h3>REDES SOCIALES</h3>
          <div id="redes">
            <div className="divIcon">
              <img className="img-icon" src="./square-facebook.svg" alt="Facebook" />
              <p className="pIcon">Facebook</p>
            </div>
            <div className="divIcon">
              <img className="img-icon" src="./square-twitter.svg" alt="Twitter" />
              <p className="pIcon">Twitter</p>
            </div>
            <div className="divIcon">
              <img className="img-icon" src="./square-instagram.svg" alt="Instagram" />
              <p className="pIcon">Instagram</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}