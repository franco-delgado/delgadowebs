import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ContactoHotel.css";

const ContactoHotel = () => {
  const navigate = useNavigate();

  // Estados del Formulario
  const [formulario, setFormulario] = useState({
    nombre: "",
    email: "",
    tel: "",
    consulta: "",
  });

  // Estados del Calendario (Mes actual de visualización)
  const [fechaActual, setFechaActual] = useState(new Date());

  // Estados para la selección de rango
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

  // Captura los cambios del formulario
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormulario((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Navegación de meses
  const mesAnterior = () => {
    setFechaActual(new Date(año, mes - 1, 1));
  };

  const mesSiguiente = () => {
    setFechaActual(new Date(año, mes + 1, 1));
  };

  // Lógica para generar los días del mes en cuadrícula
  // Lógica para generar los días del mes en cuadrícula
  const generarDias = () => {
    const primerDiaMes = new Date(año, mes, 1).getDay();
    const numeroPrimerDia = primerDiaMes === 0 ? 6 : primerDiaMes - 1;
    const totalDiasMes = new Date(año, mes + 1, 0).getDate();

    // Obtener la fecha de hoy a la medianoche para comparar correctamente
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const dias = [];

    // Rellenar espacios vacíos del inicio del mes
    for (let i = 0; i < numeroPrimerDia; i++) {
      dias.push(
        <div
          key={`empty-${i}`}
          className="calendarDay calendarItem empty"
        ></div>,
      );
    }

    // Crear los días del mes actual
    for (let dia = 1; dia <= totalDiasMes; dia++) {
      const fechaDia = new Date(año, mes, dia);
      fechaDia.setHours(0, 0, 0, 0); // Normalizar hora

      // Verificar si la fecha ya pasó
      const esPasado = fechaDia < hoy;

      // Determinar clases CSS según selección y estado
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

  // Manejo de la selección del rango
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

  // Envío del formulario
  const handleEnviar = (e) => {
    e.preventDefault();

    if (!formulario.nombre || !formulario.consulta || !formulario.tel) {
      alert("Por favor, completa al menos tu nombre y el mensaje.");
      return;
    }

    const ingresoStr = fechaIngreso
      ? fechaIngreso.toLocaleDateString()
      : "No seleccionada";
    const salidaStr = fechaSalida
      ? fechaSalida.toLocaleDateString()
      : "No seleccionada";

    alert(
      `Este mensaje es solo una muestra de que su mensaje se guardo correctamente y esta seria la informacion que veria desde su navegador como administrador\n\n` +
        `¡Se guardó con éxito el mensaje!\n\n` +
        `Detalles guardados:\n` +
        `- Nombre: ${formulario.nombre}\n` +
        `- Email: ${formulario.email || "No provisto"}\n` +
        `- Teléfono: ${formulario.tel}\n` +
        `- Fecha Ingreso: ${ingresoStr}\n` +
        `- Fecha Salida: ${salidaStr}\n` +
        `- Mensaje: "${formulario.consulta}"`,
    );

    // Reset total
    setFormulario({ nombre: "", email: "", tel: "", consulta: "" });
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

        {/* Renderizado dinámico de los días */}
        <div className="calendarDates" id="dates">
          {generarDias()}
        </div>

        {/* Visualizador opcional del rango */}
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
        <input
          id="nombre"
          type="text"
          placeholder="Nombre completo"
          value={formulario.nombre}
          onChange={handleChange}
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
        />
        <textarea
          id="consulta"
          placeholder="dejenos su mensaje"
          value={formulario.consulta}
          onChange={handleChange}
        ></textarea>

        <input id="enviarForm" type="submit" value="Enviar" />
      </form>
    </>
  );
};

export default ContactoHotel;
