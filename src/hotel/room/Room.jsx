import { useState, useRef } from "react";
import "./room.css";
//IMAGENES
import habitacion1 from "../../assets/habitacion1.jpg";
import habitacion2 from "../../assets/habitacion2.jpg";
import habitacion3 from "../../assets/habitacion3.jpg";

// Si estás usando Vite y las imágenes están en la carpeta 'public', dejalas como strings: "/imagen/..."
// Si están dentro de 'src', recordá importarlas arriba (ej: import hab1 from '../imagen/habitacion1.jpg')

export default function Room() {
  // Estado para controlar si el menú desplegable está abierto o cerrado
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Usamos una referencia para poder manipular la altura de la barra con la animación tradicional
  const barraMenuRef = useRef(null);
  const animacionRef = useRef(null);

  // Datos de las habitaciones para no repetir código HTML (Don't Repeat Yourself)
  const habitaciones = [
    {
      id: 1,
      tipo: "room-1",
      img: habitacion1,
      nombre: "Habitación Simple",
      ruta: "Single",
    },
    {
      id: 2,
      tipo: "room-2",
      img: habitacion2,
      nombre: "Habitación Doble",
      ruta: "Doble",
    },
    {
      id: 3,
      tipo: "room-3",
      img: habitacion3,
      nombre: "Habitación Suite",
      ruta: "Suit",
    },
    {
      id: 4,
      tipo: "room-1",
      img: habitacion1,
      nombre: "Habitación Simple",
      ruta: "Single",
    },
    {
      id: 5,
      tipo: "room-2",
      img: habitacion2,
      nombre: "Habitación Doble",
      ruta: "Doble",
    },
    {
      id: 6,
      tipo: "room-3",
      img: habitacion3,
      nombre: "Habitación Suite",
      ruta: "Suit",
    },
  ];

  // Navegación (Mantenemos tus rutas originales por ahora)
  const irA = (ruta) => {
    window.location.href = ruta;
  };

  // Función animada del menú adaptada a React
  const clickMenu = () => {
    clearInterval(animacionRef.current);
    const elemento = barraMenuRef.current;

    if (!menuAbierto) {
      setMenuAbierto(true);
      elemento.style.display = "grid";
      let pos = 0;
      animacionRef.current = setInterval(() => {
        if (pos >= 200) {
          clearInterval(animacionRef.current);
        } else {
          pos += 4; // Un poquito más rápido para compensar el render de React
          elemento.style.height = pos + "px";
        }
      }, 2);
    } else {
      let pos = 200;
      animacionRef.current = setInterval(() => {
        if (pos <= 0) {
          clearInterval(animacionRef.current);
          elemento.style.display = "none";
          setMenuAbierto(false);
        } else {
          pos -= 4;
          elemento.style.height = pos + "px";
        }
      }, 2);
    }
  };

  return (
    <>
      {/* BARRA SUPERIOR */}
      <div className="barra-superior">
        <div className="contenedor-h1-menu">
          <h1>HOTEL</h1>
          <div className="menu" onClick={clickMenu}></div>
        </div>

        <nav id="barramenu" ref={barraMenuRef} style={{ display: "none" }}>
          <button
            className="botonbarra"
            onClick={() => irA("hotel")}
            id="galeria"
          >
            HOME
          </button>
          <button
            className="botonbarra"
            onClick={() => irA("../restaurante/restaurante.html")}
            id="productos"
          >
            RESTAURANTE
          </button>
          <button
            className="botonbarra"
            onClick={() => irA("../contacto/index.php")}
            id="contacto"
          >
            CONTACTANOS
          </button>
          <button className="botonbarra" id="nosotros">
            QUIENES SOMOS
          </button>
        </nav>
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
            onClick={() => irA(room.ruta)}
            // Reemplazamos los addEventListener de JS por eventos nativos de React
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
