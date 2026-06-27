import React from "react";
import "./room.css";
import Footer from "../footer/Footer.jsx";
import { useMenu } from "../../hooks/useMenu.js";
import MenuNav from "../../components/MenuNav";

// IMAGENES
import habitacion1 from "../../assets/habitacion1.jpg";
import habitacion2 from "../../assets/habitacion2.jpg";
import habitacion3 from "../../assets/habitacion3.jpg";

export default function Room() {
  // Traemos la lógica reutilizable del Hook
  const { barraMenuRef, clickMenu, navegarA } = useMenu();

  const habitaciones = [
    {
      id: 1,
      tipo: "room-1",
      img: habitacion1,
      nombre: "Habitación Simple",
      ruta: "/Single",
    },
    {
      id: 2,
      tipo: "room-2",
      img: habitacion2,
      nombre: "Habitación Doble",
      ruta: "/Doble",
    },
    {
      id: 3,
      tipo: "room-3",
      img: habitacion3,
      nombre: "Habitación Suite",
      ruta: "/Suit",
    },
    {
      id: 4,
      tipo: "room-1",
      img: habitacion1,
      nombre: "Habitación Simple",
      ruta: "/Single",
    },
    {
      id: 5,
      tipo: "room-2",
      img: habitacion2,
      nombre: "Habitación Doble",
      ruta: "/Doble",
    },
    {
      id: 6,
      tipo: "room-3",
      img: habitacion3,
      nombre: "Habitación Suite",
      ruta: "/Suit",
    },
  ];

  return (
    <>
      {/* BARRA SUPERIOR */}
      <div className="barra-superior">
        <div className="contenedor-h1-menu">
          <h1>HOTEL</h1>
          <div className="menu" onClick={clickMenu}></div>
        </div>

        {/* Usamos el componente del menú inyectándole los datos del Hook */}
        <MenuNav barraMenuRef={barraMenuRef} navegarA={navegarA} />
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
            onClick={() => navegarA(room.ruta)} // Corregido: usa navegarA con rutas absolutas
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
              <img
                className="img-icon"
                src="./map-location-dot.svg"
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
                src="./square-facebook.svg"
                alt="Facebook"
              />
              <p className="pIcon">Facebook</p>
            </div>
            <div className="divIcon">
              <img
                className="img-icon"
                src="./square-twitter.svg"
                alt="Twitter"
              />
              <p className="pIcon">Twitter</p>
            </div>
            <div className="divIcon">
              <img
                className="img-icon"
                src="./square-instagram.svg"
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
