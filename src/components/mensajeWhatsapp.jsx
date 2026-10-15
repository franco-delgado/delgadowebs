import React from "react";
import "./mensajeWhatsapp.css";

export default function MensajeWhatsapp() {
  return (
    <a
      href="https://wa.me/5493827439978?text=Hola!%20Tengo%20una%20consulta"
      className="btn-whatsapp"
      target="_blank"
      rel="noopener noreferrer"
      title="Chat en WhatsApp"
    >
      <span className="icono-wa">💬</span>
    </a>
  );
}