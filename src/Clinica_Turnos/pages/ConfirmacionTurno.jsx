import { Link, useParams } from 'react-router-dom';
import { useClinica } from '../data/ClinicaContext.jsx';
import './ConfirmacionTurno.css';

function formatearFecha(fechaISO) {
  const [anio, mes, dia] = fechaISO.split('-');
  const fecha = new Date(Number(anio), Number(mes) - 1, Number(dia));
  return fecha.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function ConfirmacionTurno() {
  const { turnoId } = useParams();
  const { turnos, profesionales } = useClinica();

  const turno = turnos.find((t) => t.id === turnoId);
  const profesional = turno ? profesionales.find((p) => p.id === turno.profesionalId) : null;

  if (!turno) {
    return (
      <div className="confirmacion confirmacion--vacia">
        <h1>No encontramos ese turno</h1>
        <p>Puede que ya haya sido cancelado o el enlace sea incorrecto.</p>
        <Link className="boton-primario" to="/clinica">
          Volver a sacar un turno
        </Link>
      </div>
    );
  }

  return (
    <div className="confirmacion">
      <div className="sello">
        <div className="sello__anillo">
          <span className="sello__check">✓</span>
        </div>
        <p className="sello__etiqueta">Turno confirmado</p>
      </div>

      <div className="ticket">
        <div className="ticket__fila">
          <span className="ticket__clave">Paciente</span>
          <span className="ticket__valor">{turno.nombre} {turno.apellido}</span>
        </div>
        <div className="ticket__fila">
          <span className="ticket__clave">DNI</span>
          <span className="ticket__valor ticket__valor--mono">{turno.dni}</span>
        </div>
        <div className="ticket__fila">
          <span className="ticket__clave">Profesional</span>
          <span className="ticket__valor">
            {profesional ? `${profesional.nombre} — ${profesional.especialidad}` : 'No disponible'}
          </span>
        </div>
        <div className="ticket__fila">
          <span className="ticket__clave">Fecha</span>
          <span className="ticket__valor">{formatearFecha(turno.fecha)}</span>
        </div>
        <div className="ticket__fila">
          <span className="ticket__clave">Horario</span>
          <span className="ticket__valor ticket__valor--mono">{turno.hora} hs</span>
        </div>
        <div className="ticket__separador" aria-hidden="true" />
        <div className="ticket__fila">
          <span className="ticket__clave">Código de turno</span>
          <span className="ticket__valor ticket__valor--mono">{turno.id.slice(-8).toUpperCase()}</span>
        </div>
      </div>

      <p className="confirmacion__ayuda">
        Guardá este código. Te recomendamos llegar 10 minutos antes con tu DNI físico.
      </p>

      <Link className="boton-secundario" to="/clinica">
        Sacar otro turno
      </Link>
    </div>
  );
}
