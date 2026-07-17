import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./hotel.css";
import Footer from "./footer/Footer.jsx";
import MensajeWhatsapp from "../components/mensajeWhatsapp.jsx";

export default function Hotel() {
  // Estado para controlar si el menú desplegable está abierto o cerrado
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate();

  // Función para alternar el menú
  const clickMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  // Manejadores de navegación (Rutas)
  const navegarA = (ruta) => {
    navigate(ruta);
    setMenuAbierto(false); // Cierra el menú automáticamente al hacer click en una opción
  };

  return (
    <div className="hotel-container">
      <div className="barra-superior-hotel">
        {/* SECCIÓN SUPERIOR: Título */}
        <div className="contenedor-titulo-hotel">
          <h1>EL HOTEL</h1>
        </div>

        {/* BOTÓN HAMBURGUESA: Llama a clickMenu al tocarlo */}
        <button className="menu-toggle-hotel" onClick={clickMenu}>
          {menuAbierto ? "✕" : "☰"} {/* Cambia el icono a una X si está abierto */}
        </button>

        {/* SECCIÓN INFERIOR: Contenedor de los botones (Se le suma la clase 'open' dinámicamente) */}
        <div className={`barramenu-hotel ${menuAbierto ? "open" : ""}`}>
          <button
            className="botonbarra-hotel"
            id="room"
            onClick={() => navegarA("/room")}
          >
            ROOM
          </button>

          <button
            className="botonbarra-hotel"
            id="restaurante"
            onClick={() => navegarA("/restaurante")}
          >
            RESTAURANTE
          </button>

          <button
            className="botonbarra-hotel"
            id="contacto"
            onClick={() => navegarA("/ContactoHotel")}
          >
            CONTACTANOS
          </button>

          <button
            className="botonbarra-hotel"
            id="exit"
            onClick={() => navegarA("/")}
          >
            EXIT
          </button>
        </div>
      </div>

      {/* IMAGEN PRINCIPAL */}
      <span className="contenedor-imagen">
        <img
          className="img-principal"
          src="./hotel.jpg"
          alt="Imagen ilustrativa"
        />
      </span>
      <MensajeWhatsapp />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}