import React from "react";
import "./mensajeWhatsapp.css"; // Asegúrate de que apunte bien a su CSS

export default function MensajeWhatsapp() {
  return (
    <a 
      href="https://wa.me/xxxxxxxxxxx?text=Hola!%20Tengo%20una%20consulta" 
      className="btn-whatsapp" 
      target="_blank" 
      rel="noopener noreferrer"
      title="Chat en WhatsApp"
    >
      <span className="icono-wa">💬</span>
    </a>
  );
}