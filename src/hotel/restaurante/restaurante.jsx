import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Carrusel from "../Carrusel";
import "./restaurante.css";
import Footer from "../footer/Footer.jsx";

import restorante1 from "../../assets/restorante1.jpg";
import desayunador1 from "../../assets/desayunador1.jpg";
import restorante2 from "../../assets/restorante2.jpg";
import desayunador2 from "../../assets/desayunador2.jpg";
import restorante3 from "../../assets/restorante3.jpg";
import desayunador3 from "../../assets/desayunador3.jpg";
import desayunador4 from "../../assets/desayunador4.jpg";

const Restaurante = () => {
  const navigate = useNavigate();

  // 2. Las pones en el array como variables (SIN COMILLAS)
  const arrImagenes = [
    restorante1,
    desayunador1,
    restorante2,
    desayunador2,
    restorante3,
    desayunador3,
    desayunador4,
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
