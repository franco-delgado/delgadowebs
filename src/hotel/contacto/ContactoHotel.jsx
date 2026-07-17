import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ContactoHotel.css";

const ContactoHotel = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Leemos el estado de React Router

  // Estados del Formulario (agregamos 'habitacion' para guardar lo que viene de la suite)
  const [formulario, setFormulario] = useState({
    nombre: "",
    email: "",
    tel: "",
    habitacion: "",
    consulta: "",
  });

  // Si el usuario venía de "suite.jsx", auto-completamos la habitación
  useEffect(() => {
    if (location.state?.habitacionSeleccionada) {
      setFormulario((prevData) => ({
        ...prevData,
        habitacion: location.state.habitacionSeleccionada,
      }));
    }
  }, [location]);

  // Estados del Calendario
  const [fechaActual, setFechaActual] = useState(new Date());
  const [fechaIngreso, setFechaIngreso] = useState(null);
  const [fechaSalida, setFechaSalida] = useState(null);

  const nombresMeses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const año = fechaActual.getFullYear();
  const mes = fechaActual.getMonth();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormulario((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const mesAnterior = () => {
    setFechaActual(new Date(año, mes - 1, 1));
  };

  const mesSiguiente = () => {
    setFechaActual(new Date(año, mes + 1, 1));
  };

  const generarDias = () => {
    const primerDiaMes = new Date(año, mes, 1).getDay();
    const numeroPrimerDia = primerDiaMes === 0 ? 6 : primerDiaMes - 1;
    const totalDiasMes = new Date(año, mes + 1, 0).getDate();

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const dias = [];

    for (let i = 0; i < numeroPrimerDia; i++) {
      dias.push(
        <div
          key={`empty-${i}`}
          className="calendarDay calendarItem empty"
        ></div>,
      );
    }

    for (let dia = 1; dia <= totalDiasMes; dia++) {
      const fechaDia = new Date(año, mes, dia);
      fechaDia.setHours(0, 0, 0, 0);

      const esPasado = fechaDia < hoy;

      let claseSeleccion = "";
      if (esPasado) {
        claseSeleccion = " pasado";
      } else if (
        fechaIngreso &&
        fechaDia.getTime() === fechaIngreso.getTime()
      ) {
        claseSeleccion = " seleccionado-ingreso";
      } else if (fechaSalida && fechaDia.getTime() === fechaSalida.getTime()) {
        claseSeleccion = " seleccionado-salida";
      } else if (
        fechaIngreso &&
        fechaSalida &&
        fechaDia > fechaIngreso &&
        fechaDia < fechaSalida
      ) {
        claseSeleccion = " en-rango";
      }

      dias.push(
        <div
          key={`day-${dia}`}
          className={`calendarDay calendarItem ${esPasado ? "day-disabled" : "day-clickable"}${claseSeleccion}`}
          onClick={() => !esPasado && handleSeleccionarFecha(fechaDia)}
        >
          {dia}
        </div>,
      );
    }

    return dias;
  };

  const handleSeleccionarFecha = (fecha) => {
    if (!fechaIngreso || (fechaIngreso && fechaSalida)) {
      setFechaIngreso(fecha);
      setFechaSalida(null);
    } else if (fechaIngreso && !fechaSalida) {
      if (fecha < fechaIngreso) {
        setFechaIngreso(fecha);
      } else {
        setFechaSalida(fecha);
      }
    }
  };

  // Función de envío por WhatsApp
  const handleEnviar = (e) => {
    e.preventDefault();

    if (!formulario.nombre || !formulario.tel) {
      alert(
        "Por favor, completa al menos tu nombre y un teléfono de contacto.",
      );
      return;
    }

    const ingresoStr = fechaIngreso
      ? fechaIngreso.toLocaleDateString()
      : "No seleccionada";
    const salidaStr = fechaSalida
      ? fechaSalida.toLocaleDateString()
      : "No seleccionada";

    // Reemplazá este número con el de tu cliente (código de país + número sin espacios ni símbolos)
    const numeroTelefonoWhatsapp = "5491111111111";

    // Mensaje predeterminado estructurado con emojis para que quede muy visual
    const mensajeWhatsApp =
      `🏨 *Nueva Solicitud de Reserva*\n\n` +
      `👤 *Huésped:* ${formulario.nombre}\n` +
      `📞 *Teléfono:* ${formulario.tel}\n` +
      `📧 *Email:* ${formulario.email || "No especificado"}\n` +
      `🛏️ *Habitación:* ${formulario.habitacion || "No especificada"}\n` +
      `📅 *Ingreso:* ${ingresoStr}\n` +
      `📅 *Salida:* ${salidaStr}\n\n` +
      `💬 *Consulta:* ${formulario.consulta || "Sin comentarios adicionales"}`;

    const mensajeCodificado = encodeURIComponent(mensajeWhatsApp);
    const urlWhatsapp = `https://api.whatsapp.com/send?phone=${numeroTelefonoWhatsapp}&text=${mensajeCodificado}`;

    // Alerta demostrativa para el administrador
    alert("Redirigiendo a WhatsApp con los detalles de tu reserva...");

    // Abrimos el chat de WhatsApp en una pestaña nueva
    window.open(urlWhatsapp, "_blank");

    // Reseteamos el formulario
    setFormulario({
      nombre: "",
      email: "",
      tel: "",
      habitacion: "",
      consulta: "",
    });
    setFechaIngreso(null);
    setFechaSalida(null);
  };

  return (
    <>
      {/* ENCABEZADO */}
      <div className="contenedor-h1-menu">
        <h1>EL HOTEL</h1>
        <div className="back" onClick={() => navigate(-1)}></div>
      </div>

      {/* CALENDARIO */}
      <div className="calendario">
        <h4>Calendario</h4>
        <div className="calendarInfo">
          <div className="calendarPrev" id="prevMonth" onClick={mesAnterior}>
            ◀
          </div>
          <div className="calendarMonth" id="month">
            {nombresMeses[mes]} {año}
          </div>
          <div className="calendarNext" id="nextMonth" onClick={mesSiguiente}>
            ▶
          </div>
        </div>

        <div className="calendarWeek">
          <div className="calendarDay calendarItemHeader">L</div>
          <div className="calendarDay calendarItemHeader">M</div>
          <div className="calendarDay calendarItemHeader">Mi</div>
          <div className="calendarDay calendarItemHeader">J</div>
          <div className="calendarDay calendarItemHeader">V</div>
          <div className="calendarDay calendarItemHeader">S</div>
          <div className="calendarDay calendarItemHeader">D</div>
        </div>

        <div className="calendarDates" id="dates">
          {generarDias()}
        </div>

        <div className="rango-info">
          <p>
            <strong>Ingreso:</strong>{" "}
            {fechaIngreso ? fechaIngreso.toLocaleDateString() : "---"}
          </p>
          <p>
            <strong>Salida:</strong>{" "}
            {fechaSalida ? fechaSalida.toLocaleDateString() : "---"}
          </p>
        </div>
      </div>

      {/* FORMULARIO */}
      <form className="formul" onSubmit={handleEnviar}>
        <h2>¡DEJANOS TU MENSAJE!</h2>

        {/* Banner informativo de la habitación preseleccionada si existe */}
        {formulario.habitacion && (
          <div
            style={{
              backgroundColor: "#f0f7f4",
              borderLeft: "4px solid #128C7E",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "4px",
              fontSize: "0.9em",
              textAlign: "left",
            }}
          >
            Estás consultando por la habitación:{" "}
            <strong>{formulario.habitacion}</strong>
          </div>
        )}

        <input
          id="nombre"
          type="text"
          placeholder="Nombre completo"
          value={formulario.nombre}
          onChange={handleChange}
          required
        />
        <input
          id="email"
          type="email"
          placeholder="Email"
          value={formulario.email}
          onChange={handleChange}
        />
        <input
          id="tel"
          type="tel"
          placeholder="N° tel:"
          value={formulario.tel}
          onChange={handleChange}
          required
        />
        <textarea
          id="consulta"
          placeholder="dejenos su mensaje"
          value={formulario.consulta}
          onChange={handleChange}
        ></textarea>

        <input id="enviarForm" type="submit" value="Enviar por WhatsApp" />
      </form>
    </>
  );
};

export default ContactoHotel;
