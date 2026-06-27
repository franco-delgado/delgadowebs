import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Carrusel from "../Carrusel";
import "./restaurante.css";
import Footer from "../footer/Footer.jsx";

const Restaurante = () => {
  const navigate = useNavigate();

  // 2. Las pones en el array como variables (SIN COMILLAS)
  const arrImagenes = [
    "src/assets/restorante1.jpg",
    "src/assets/desayunador1.jpg",
    "src/assets/restorante2.jpg",
    "src/assets/desayunador2.jpg",
    "src/assets/restorante3.jpg",
    "src/assets/desayunador3.jpg",
    "src/assets/desayunador4.jpg",
  ];

  return (
    <div className="restaurante-container">
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
      <Footer />
    </div>
  );
};

export default Restaurante;
