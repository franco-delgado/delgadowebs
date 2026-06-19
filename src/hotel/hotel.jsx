import React, { useState } from "react";
import "./hotel.css";

export default function Hotel() {
  // Estado para controlar si el menú desplegable está abierto o cerrado
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Función para alternar el menú
  const clickMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  // Manejadores de navegación (Rutas)
  const navegarA = (ruta) => {
    window.location.href = ruta;
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
        <div className="contenedor-h1-menu">
          <h1>EL HOTEL</h1>
          <div className="menu" onClick={clickMenu}></div>
        </div>

        {/* Pasamos el estilo dinámico al nav */}
        <nav id="barramenu" style={estiloBarraMenu}>
          <button
            className="botonbarra"
            id="room"
            onClick={() => navegarA("/Room")}
          >
            ROOM
          </button>

          <button
            className="botonbarra"
            id="restaurante"
            onClick={() => navegarA("Restaurante")}
          >
            RESTAURANTE
          </button>

          <button
            className="botonbarra"
            id="contacto"
            onClick={() => navegarA("ContactoHotel")}
          >
            CONTACTANOS
          </button>
          <button
            className="botonbarra"
            id="exit"
            onClick={() =>
              navegarA("https://franco-delgado.github.io/delgadowebs/")
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
      <div id="footer">
        <div id="footer-izquierdo">
          <h3>CONTACTOS Y DIRECCIÓN</h3>
          <div id="contactos">
            <div className="divIcon">
              <img className="img-icon" src="/phone.svg" alt="Teléfono" />
              <p className="licon-tel">TEL: ************</p>
            </div>
            <div className="divIcon">
              <img className="img-icon" src="/message.svg" alt="Email" />
              <p className="licon-emal">Email: ****@****.com</p>
            </div>
            <div className="divIcon">
              <img
                className="img-icon"
                src="/map-location-dot.svg"
                alt="Ubicación"
              />
              <p className="licon-dir">Dir: **************</p>
            </div>
          </div>
        </div>

        <div id="footer-derecho">
          <h3>REDES SOCIALES</h3>
          <div id="redes">
            <div className="divIcon">
              <img
                className="img-icon"
                src="/square-facebook.svg"
                alt="Facebook"
              />
              <p className="pIcon">Facebook</p>
            </div>
            <div className="divIcon">
              <img
                className="img-icon"
                src="/square-twitter.svg"
                alt="Twitter"
              />
              <p className="pIcon">Twitter</p>
            </div>
            <div className="divIcon">
              <img
                className="img-icon"
                src="/square-instagram.svg"
                alt="Instagram"
              />
              <p className="pIcon">Instagram</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
