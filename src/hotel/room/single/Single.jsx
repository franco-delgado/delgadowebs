import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Carrusel from "../../Carrusel.jsx";
import "../Habitaciones.css"; // Recordá verificar la ruta de tus estilos
import Footer from "../../footer/Footer.jsx";
//IMAGENES
import habitacion1 from "../../../assets/habitacion1.jpg";
import habitacion2 from "../../../assets/habitacion3.jpg";
import habitacion3 from "../../../assets/habitacion3.jpg";
import habitacion4 from "../../../assets/habitacion4.jpg";

export default function Single() {
  const navigate = useNavigate();
  // Lista de imágenes apuntando directamente a tu carpeta 'public'
  const imagenes = [habitacion1, habitacion2, habitacion3, habitacion4];

  return (
    <div className="habitacion-container">
      {/* BARRA SUPERIOR */}
      <div className="barra-superior">
        <div className="contenedor-h1-menu">
          <h1>EL HOTEL</h1>
          {/* Usamos el navigate(-1) que vuelve exactamente a la página anterior en el historial */}
          <div className="back" onClick={() => navigate(-1)}></div>
        </div>
      </div>

      {/* CUERPO PRINCIPAL */}
      <div className="cuerpo-principal-habitacion">
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

      <Footer />
    </div>
  );
}
