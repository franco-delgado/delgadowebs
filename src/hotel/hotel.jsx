import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./hotel.css";
import Footer from "./footer/Footer.jsx";

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
  };

  // Estilo dinámico para el menú basado en el estado (reemplaza la animación por setInterval)
  const estiloBarraMenu = {
    display: menuAbierto ? "grid" : "none",
    height: menuAbierto ? "200px" : "0px",
    transition: "height 0.3s ease", // Esto hace la animación suave sin usar JS pesado
  };

  return (
    <div className="hotel-container">
      {/* BARRA SUPERIOR */}
      <div className="barra-superior">
        <div className="contenedor-h1-menu-hotel">
          <h1>EL HOTEL</h1>
          <div className="menu-hotel" onClick={clickMenu}></div>
        </div>

        {/* Pasamos el estilo dinámico al nav */}
        <nav id="barramenu" style={estiloBarraMenu}>
          <button
            className="botonbarra"
            id="room"
            onClick={() => navegarA("/room")}
          >
            ROOM
          </button>

          <button
            className="botonbarra"
            id="restaurante"
            onClick={() => navegarA("/restaurante")}
          >
            RESTAURANTE
          </button>

          <button
            className="botonbarra"
            id="contacto"
            onClick={() => navegarA("/ContactoHotel")}
          >
            CONTACTANOS
          </button>
          <button
            className="botonbarra"
            id="exit"
            onClick={
              () => navegarA("LandingPage") // Cambié a LandingPage para que sea consistente con la ruta definida en App.jsx
            }
          >
            EXIT
          </button>
        </nav>
      </div>

      {/* IMAGEN PRINCIPAL */}
      <span className="contenedor-imagen">
        <img
          className="img-principal"
          src="./hotel.jpg"
          alt="Imagen ilustrativa"
        />
      </span>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
