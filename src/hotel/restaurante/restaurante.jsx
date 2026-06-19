import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Carrusel from "../Carrusel";
import "./restaurante.css"; // Asegurate de adaptar los estilos aquí

const Restaurante = () => {
  const navigate = useNavigate();

  // Array de imágenes (simplificado y ordenado del 0 al 6)
  const arrImagenes = [
    "/restorante1.jpg",
    "/desayunador1.jpg",
    "/restorante2.jpg",
    "/desayunador2.jpg",
    "/restorante3.jpg",
    "/desayunador3.jpg",
    "/desayunador4.jpg",
  ];

  return (
    <>
      {/* BARRA SUPERIOR */}
      <div className="barra-superior">
        <div className="contenedor-h1-menu">
          <h1>EL HOTEL</h1>
          <div className="back" onClick={() => navigate(-1)}></div>
        </div>
      </div>

      {/* CUERPO PRINCIPAL */}
      <div className="cuerpo-principal">
        {/* Pasamos el estilo dinámico del fondo directo al div de forma limpia en React */}
        <Carrusel imagenes={arrImagenes} className="contenImagen" />

        <div className="textohabitacin">
          <h2 className="h2Habitacion">CARACTERISTICAS</h2>
          <ul>
            <li className="liHabitacion">Desayuno</li>
            <li className="liHabitacion">Buffet</li>
            <li className="liHabitacion">Platos regionales</li>
            <li className="liHabitacion">Platos Internacionales</li>
          </ul>
        </div>
      </div>

      {/* FOOTER */}
      <div id="footer">
        <div id="footer-izquierdo">
          <h3>CONTACTOS Y DIRECCON</h3>
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
};

export default Restaurante;
