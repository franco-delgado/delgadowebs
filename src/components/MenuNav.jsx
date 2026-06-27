import React from "react";

export default function MenuNav({ barraMenuRef, navegarA }) {
  return (
    <nav id="barramenu" ref={barraMenuRef} style={{ display: "none" }}>
      <button
        className="botonbarra"
        onClick={() => navegarA("/hotel")}
        id="galeria"
      >
        HOME
      </button>
      <button
        className="botonbarra"
        onClick={() => navegarA("/Restaurante")}
        id="productos"
      >
        RESTAURANTE
      </button>
      <button
        className="botonbarra"
        onClick={() => navegarA("/contactoHotel")}
        id="contacto"
      >
        CONTACTANOS
      </button>
      <button className="botonbarra" id="nosotros">
        QUIENES SOMOS
      </button>
    </nav>
  );
}
