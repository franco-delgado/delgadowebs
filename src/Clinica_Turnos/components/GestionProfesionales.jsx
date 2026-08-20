import { useState } from 'react';
import { useClinica } from '../data/ClinicaContext.jsx';
import './GestionProfesionales.css';

const PROFESIONAL_VACIO = { nombre: '', especialidad: '', cupoPorDia: 10 };

export default function GestionProfesionales() {
  const { profesionales, turnos, agregarProfesional, quitarProfesional, actualizarCupo } =
    useClinica();
  const [nuevo, setNuevo] = useState(PROFESIONAL_VACIO);
  const [error, setError] = useState('');

  function turnosActivos(profesionalId) {
    return turnos.filter((t) => t.profesionalId === profesionalId).length;
  }

  function manejarAlta(evento) {
    evento.preventDefault();
    if (!nuevo.nombre.trim() || !nuevo.especialidad.trim()) {
      setError('Completá el nombre y la especialidad.');
      return;
    }
    if (!nuevo.cupoPorDia || nuevo.cupoPorDia < 1) {
      setError('El cupo diario debe ser al menos 1.');
      return;
    }
    agregarProfesional({
      nombre: nuevo.nombre.trim(),
      especialidad: nuevo.especialidad.trim(),
      cupoPorDia: Number(nuevo.cupoPorDia),
    });
    setNuevo(PROFESIONAL_VACIO);
    setError('');
  }

  function manejarBaja(profesional) {
    const cantidad = turnosActivos(profesional.id);
    const mensaje = cantidad > 0
      ? `${profesional.nombre} tiene ${cantidad} turno(s) reservado(s). Al quitarlo también se eliminan esos turnos. ¿Continuar?`
      : `¿Quitar a ${profesional.nombre} de la clínica?`;
    if (window.confirm(mensaje)) {
      quitarProfesional(profesional.id);
    }
  }

  return (
    <div className="gestion-profesionales">
      <div className="panel-encabezado">
        <div>
          <h1>Profesionales y cupos</h1>
          <p className="panel-subtitulo">
            Agregá, quitá o limitá la cantidad de turnos diarios por profesional.
          </p>
        </div>
      </div>

      <form className="alta-profesional" onSubmit={manejarAlta}>
        <div className="campo">
          <label htmlFor="nombreProf">Nombre y apellido</label>
          <input
            id="nombreProf"
            value={nuevo.nombre}
            onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
            placeholder="Dra. Ana Gómez"
          />
        </div>
        <div className="campo">
          <label htmlFor="especialidad">Especialidad</label>
          <input
            id="especialidad"
            value={nuevo.especialidad}
            onChange={(e) => setNuevo({ ...nuevo, especialidad: e.target.value })}
            placeholder="Cardiología"
          />
        </div>
        <div className="campo campo--corto">
          <label htmlFor="cupoInicial">Cupo diario</label>
          <input
            id="cupoInicial"
            type="number"
            min="1"
            value={nuevo.cupoPorDia}
            onChange={(e) => setNuevo({ ...nuevo, cupoPorDia: e.target.value })}
          />
        </div>
        <button type="submit" className="boton-primario">
          Agregar profesional
        </button>
      </form>
      {error && <p className="campo__error">{error}</p>}

      {profesionales.length === 0 ? (
        <div className="tabla-vacia">
          <p>Todavía no hay profesionales cargados.</p>
        </div>
      ) : (
        <div className="tarjetas-profesionales">
          {profesionales.map((p) => (
            <article key={p.id} className="tarjeta-profesional">
              <div className="tarjeta-profesional__info">
                <h2>{p.nombre}</h2>
                <p className="tarjeta-profesional__especialidad">{p.especialidad}</p>
                <p className="tarjeta-profesional__turnos">
                  {turnosActivos(p.id)} turno(s) reservado(s) en total
                </p>
              </div>
              <div className="tarjeta-profesional__acciones">
                <label htmlFor={`cupo-${p.id}`}>Cupo máximo por día</label>
                <div className="control-cupo">
                  <button
                    type="button"
                    onClick={() => actualizarCupo(p.id, Math.max(1, p.cupoPorDia - 1))}
                    aria-label={`Bajar cupo de ${p.nombre}`}
                  >
                    −
                  </button>
                  <input
                    id={`cupo-${p.id}`}
                    type="number"
                    min="1"
                    value={p.cupoPorDia}
                    onChange={(e) => {
                      const valor = Number(e.target.value);
                      if (valor >= 1) actualizarCupo(p.id, valor);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => actualizarCupo(p.id, p.cupoPorDia + 1)}
                    aria-label={`Subir cupo de ${p.nombre}`}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="boton-peligro"
                  onClick={() => manejarBaja(p)}
                >
                  Quitar profesional
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
