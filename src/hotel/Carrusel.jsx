import { useState, useEffect } from "react";
//import "./carrusel.css"; // Movés tus estilos del carrusel acá

export default function Carrusel({ imagenes }) {
  const [indiceActual, setIndiceActual] = useState(0);

  const next = () => {
    setIndiceActual((prevIndice) =>
      prevIndice === imagenes.length - 1 ? 0 : prevIndice + 1,
    );
  };

  const previous = () => {
    setIndiceActual((prevIndice) =>
      prevIndice === 0 ? imagenes.length - 1 : prevIndice - 1,
    );
  };

  useEffect(() => {
    const temporizador = setInterval(() => {
      next();
    }, 4000);

    return () => clearInterval(temporizador);
  }, [indiceActual, imagenes.length]);

  return (
    <div className="carrusel-contenedor">
      {/* Acá va el JSX de tu carrusel, usando imagenes[indiceActual] */}
      <button id="left" onClick={previous}></button>
      <img src={imagenes[indiceActual]} alt="Habitación" />
      <button id="right" onClick={next}></button>
    </div>
  );
}
