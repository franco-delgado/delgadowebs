import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Carrusel from "../../Carrusel.jsx";
import "../Habitaciones.css"; // Recordá verificar la ruta de tus estilos

export default function Single() {
  const navigate = useNavigate();
  // Lista de imágenes apuntando directamente a tu carpeta 'public'
  const imagenes = [
    "/habitacion1.jpg",
    "/habitacion2.jpg",
    "/habitacion3.jpg",
    "/habitacion4.jpg",
  ];

  return (
    <>
      {/* BARRA SUPERIOR */}
      <div className="barra-superior">
        <div className="contenedor-h1-menu">
          <h1>EL HOTEL</h1>
          {/* Usamos el navigate(-1) que vuelve exactamente a la página anterior en el historial */}
          <div className="back" onClick={() => navigate(-1)}></div>
        </div>
      </div>

      {/* CUERPO PRINCIPAL */}
      <div className="cuerpo-principal">
        {/* Pasamos el estilo dinámico del fondo directo al div de forma limpia en React */}
        <Carrusel imagenes={imagenes} className="contenImagen" />

        <div className="textohabitacin">
          <h2 className="h2Habitacion">CARACTERISTICAS</h2>
          <ul>
            <li className="liHabitacion">Cama</li>
            <li className="liHabitacion">Baño</li>
            <li className="liHabitacion">Mini bar</li>
            <li className="liHabitacion">Escritorio</li>
            <li className="liHabitacion">WI-FI</li>
          </ul>
        </div>
      </div>

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
    </>
  );
}
