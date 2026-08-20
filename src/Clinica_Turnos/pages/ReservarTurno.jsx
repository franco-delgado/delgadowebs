import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClinica } from '../data/ClinicaContext.jsx';
import { FRANJAS_HORARIAS } from '../data/seed';
import './ReservarTurno.css';

const HOY = new Date().toISOString().split('T')[0];

const VACIO = {
  dni: '',
  nombre: '',
  apellido: '',
  fechaNacimiento: '',
  celular: '',
  profesionalId: '',
  fecha: '',
  hora: '',
};

function validar(form) {
  const errores = {};
  if (!/^\d{7,8}$/.test(form.dni)) {
    errores.dni = 'Ingresá un DNI válido (7 u 8 números, sin puntos).';
  }
  if (!form.nombre.trim()) errores.nombre = 'Ingresá el nombre.';
  if (!form.apellido.trim()) errores.apellido = 'Ingresá el apellido.';
  if (!form.fechaNacimiento) {
    errores.fechaNacimiento = 'Ingresá la fecha de nacimiento.';
  } else if (form.fechaNacimiento >= HOY) {
    errores.fechaNacimiento = 'La fecha de nacimiento debe ser anterior a hoy.';
  }
  if (!/^\d{8,15}$/.test(form.celular.replace(/[\s-]/g, ''))) {
    errores.celular = 'Ingresá un celular válido, solo números (ej: 3811234567).';
  }
  if (!form.profesionalId) errores.profesionalId = 'Elegí un profesional.';
  if (!form.fecha) {
    errores.fecha = 'Elegí una fecha.';
  } else if (form.fecha < HOY) {
    errores.fecha = 'La fecha no puede ser anterior a hoy.';
  }
  if (!form.hora) errores.hora = 'Elegí un horario.';
  return errores;
}

export default function ReservarTurno() {
  const { profesionales, cupoDisponible, turnosDe, reservarTurno } = useClinica();
  const navigate = useNavigate();

  const [form, setForm] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [enviando, setEnviando] = useState(false);

  const profesionalSeleccionado = profesionales.find((p) => p.id === form.profesionalId);

  const horasOcupadas = useMemo(() => {
    if (!form.profesionalId || !form.fecha) return new Set();
    return new Set(turnosDe(form.profesionalId, form.fecha).map((t) => t.hora));
  }, [form.profesionalId, form.fecha, turnosDe]);

  const cupoRestante = form.profesionalId && form.fecha
    ? cupoDisponible(form.profesionalId, form.fecha)
    : null;

  function actualizarCampo(campo, valor) {
    setForm((prev) => {
      const siguiente = { ...prev, [campo]: valor };
      // Si cambia el profesional o la fecha, la hora elegida puede dejar de ser válida.
      if (campo === 'profesionalId' || campo === 'fecha') {
        siguiente.hora = '';
      }
      return siguiente;
    });
    setErrorGeneral('');
  }

  function manejarEnvio(evento) {
    evento.preventDefault();
    const erroresEncontrados = validar(form);
    setErrores(erroresEncontrados);
    if (Object.keys(erroresEncontrados).length > 0) return;

    setEnviando(true);
    const resultado = reservarTurno(form);
    setEnviando(false);

    if (!resultado.ok) {
      if (resultado.motivo === 'CUPO_LLENO') {
        setErrorGeneral('Ese profesional ya no tiene cupo disponible para la fecha elegida. Probá otra fecha.');
      } else if (resultado.motivo === 'HORA_OCUPADA') {
        setErrorGeneral('Ese horario ya fue tomado por otro paciente. Elegí otro horario.');
      } else {
        setErrorGeneral('No se pudo confirmar el turno. Intentá nuevamente.');
      }
      return;
    }

    navigate(`/clinica/confirmacion/${resultado.turno.id}`);
  }

  return (
    <div className="reservar">
      <section className="reservar__hero">
        <p className="reservar__eyebrow">Turnos online</p>
        <h1 className="reservar__titulo">
          Pedí tu turno <span>sin llamar</span> ni hacer fila.
        </h1>
        <p className="reservar__bajada">
          Completá tus datos, elegí profesional, fecha y horario. Vas a ver el cupo
          disponible en tiempo real antes de confirmar.
        </p>
        <ul className="reservar__pasos">
          <li>
            <span className="reservar__paso-num">1</span>
            Tus datos personales
          </li>
          <li>
            <span className="reservar__paso-num">2</span>
            Profesional y fecha
          </li>
          <li>
            <span className="reservar__paso-num">3</span>
            Confirmás el horario
          </li>
        </ul>
      </section>

      <section className="reservar__panel">
        <form className="formulario" onSubmit={manejarEnvio} noValidate>
          <fieldset className="formulario__grupo">
            <legend>Tus datos</legend>

            <div className="campo">
              <label htmlFor="dni">DNI</label>
              <input
                id="dni"
                inputMode="numeric"
                placeholder="30123456"
                value={form.dni}
                onChange={(e) => actualizarCampo('dni', e.target.value.replace(/\D/g, ''))}
                aria-invalid={Boolean(errores.dni)}
              />
              {errores.dni && <span className="campo__error">{errores.dni}</span>}
            </div>

            <div className="campo-fila">
              <div className="campo">
                <label htmlFor="nombre">Nombre</label>
                <input
                  id="nombre"
                  value={form.nombre}
                  onChange={(e) => actualizarCampo('nombre', e.target.value)}
                  aria-invalid={Boolean(errores.nombre)}
                />
                {errores.nombre && <span className="campo__error">{errores.nombre}</span>}
              </div>
              <div className="campo">
                <label htmlFor="apellido">Apellido</label>
                <input
                  id="apellido"
                  value={form.apellido}
                  onChange={(e) => actualizarCampo('apellido', e.target.value)}
                  aria-invalid={Boolean(errores.apellido)}
                />
                {errores.apellido && <span className="campo__error">{errores.apellido}</span>}
              </div>
            </div>

            <div className="campo-fila">
              <div className="campo">
                <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
                <input
                  id="fechaNacimiento"
                  type="date"
                  max={HOY}
                  value={form.fechaNacimiento}
                  onChange={(e) => actualizarCampo('fechaNacimiento', e.target.value)}
                  aria-invalid={Boolean(errores.fechaNacimiento)}
                />
                {errores.fechaNacimiento && (
                  <span className="campo__error">{errores.fechaNacimiento}</span>
                )}
              </div>
              <div className="campo">
                <label htmlFor="celular">Celular</label>
                <input
                  id="celular"
                  inputMode="tel"
                  placeholder="3811234567"
                  value={form.celular}
                  onChange={(e) => actualizarCampo('celular', e.target.value.replace(/[^\d\s-]/g, ''))}
                  aria-invalid={Boolean(errores.celular)}
                />
                {errores.celular && <span className="campo__error">{errores.celular}</span>}
              </div>
            </div>
          </fieldset>

          <fieldset className="formulario__grupo">
            <legend>Profesional y fecha</legend>

            <div className="campo">
              <label htmlFor="profesionalId">Profesional</label>
              <select
                id="profesionalId"
                value={form.profesionalId}
                onChange={(e) => actualizarCampo('profesionalId', e.target.value)}
                aria-invalid={Boolean(errores.profesionalId)}
              >
                <option value="">Seleccioná un profesional</option>
                {profesionales.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} — {p.especialidad}
                  </option>
                ))}
              </select>
              {errores.profesionalId && (
                <span className="campo__error">{errores.profesionalId}</span>
              )}
              {profesionales.length === 0 && (
                <span className="campo__ayuda">
                  No hay profesionales cargados todavía. Contactá a la clínica.
                </span>
              )}
            </div>

            <div className="campo">
              <label htmlFor="fecha">Fecha del turno</label>
              <input
                id="fecha"
                type="date"
                min={HOY}
                value={form.fecha}
                onChange={(e) => actualizarCampo('fecha', e.target.value)}
                aria-invalid={Boolean(errores.fecha)}
              />
              {errores.fecha && <span className="campo__error">{errores.fecha}</span>}
              {form.profesionalId && form.fecha && (
                <span className={`campo__ayuda ${cupoRestante === 0 ? 'campo__ayuda--alerta' : ''}`}>
                  {cupoRestante > 0
                    ? `Quedan ${cupoRestante} de ${profesionalSeleccionado?.cupoPorDia} lugares para ese día.`
                    : 'No quedan lugares para ese día con este profesional.'}
                </span>
              )}
            </div>
          </fieldset>

          {form.profesionalId && form.fecha && (
            <fieldset className="formulario__grupo">
              <legend>Horario</legend>
              <div className="franjas" role="radiogroup" aria-label="Horarios disponibles">
                {FRANJAS_HORARIAS.map((franja) => {
                  const ocupada = horasOcupadas.has(franja);
                  const seleccionada = form.hora === franja;
                  return (
                    <button
                      type="button"
                      key={franja}
                      disabled={ocupada}
                      className={`franja ${seleccionada ? 'franja--activa' : ''} ${ocupada ? 'franja--ocupada' : ''}`}
                      onClick={() => actualizarCampo('hora', franja)}
                      aria-pressed={seleccionada}
                    >
                      {franja}
                    </button>
                  );
                })}
              </div>
              {errores.hora && <span className="campo__error">{errores.hora}</span>}
            </fieldset>
          )}

          {errorGeneral && <p className="formulario__error-general">{errorGeneral}</p>}

          <button type="submit" className="boton-primario" disabled={enviando}>
            {enviando ? 'Confirmando…' : 'Confirmar turno'}
          </button>
        </form>
      </section>
    </div>
  );
}
