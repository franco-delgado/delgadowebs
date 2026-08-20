import { useMemo, useState } from 'react';
import { useClinica } from '../data/ClinicaContext.jsx';
import './ListaTurnos.css';

export default function ListaTurnos() {
  const { turnos, profesionales, cancelarTurno } = useClinica();
  const [filtroProfesional, setFiltroProfesional] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [busqueda, setBusqueda] = useState('');

  const turnosFiltrados = useMemo(() => {
    return turnos
      .filter((t) => !filtroProfesional || t.profesionalId === filtroProfesional)
      .filter((t) => !filtroFecha || t.fecha === filtroFecha)
      .filter((t) => {
        if (!busqueda.trim()) return true;
        const texto = busqueda.trim().toLowerCase();
        return (
          t.dni.includes(texto) ||
          `${t.nombre} ${t.apellido}`.toLowerCase().includes(texto)
        );
      })
      .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));
  }, [turnos, filtroProfesional, filtroFecha, busqueda]);

  function nombreProfesional(id) {
    const profesional = profesionales.find((p) => p.id === id);
    return profesional ? profesional.nombre : 'Profesional eliminado';
  }

  return (
    <div className="lista-turnos">
      <div className="panel-encabezado">
        <div>
          <h1>Turnos reservados</h1>
          <p className="panel-subtitulo">
            {turnos.length} turno{turnos.length === 1 ? '' : 's'} en total
          </p>
        </div>
      </div>

      <div className="filtros">
        <div className="campo">
          <label htmlFor="busqueda">Buscar por DNI o nombre</label>
          <input
            id="busqueda"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Ej: 30123456 o Fernández"
          />
        </div>
        <div className="campo">
          <label htmlFor="filtroProfesional">Profesional</label>
          <select
            id="filtroProfesional"
            value={filtroProfesional}
            onChange={(e) => setFiltroProfesional(e.target.value)}
          >
            <option value="">Todos</option>
            {profesionales.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="campo">
          <label htmlFor="filtroFecha">Fecha</label>
          <input
            id="filtroFecha"
            type="date"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
          />
        </div>
        {(filtroProfesional || filtroFecha || busqueda) && (
          <button
            type="button"
            className="boton-texto"
            onClick={() => {
              setFiltroProfesional('');
              setFiltroFecha('');
              setBusqueda('');
            }}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {turnosFiltrados.length === 0 ? (
        <div className="tabla-vacia">
          <p>No hay turnos que coincidan con estos filtros.</p>
        </div>
      ) : (
        <div className="tabla-envoltorio">
          <table className="tabla">
            <thead>
              <tr>
                <th>Paciente</th>
                <th>DNI</th>
                <th>Celular</th>
                <th>Profesional</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th aria-label="Acciones" />
              </tr>
            </thead>
            <tbody>
              {turnosFiltrados.map((t) => (
                <tr key={t.id}>
                  <td>{t.nombre} {t.apellido}</td>
                  <td className="celda-mono">{t.dni}</td>
                  <td className="celda-mono">{t.celular}</td>
                  <td>{nombreProfesional(t.profesionalId)}</td>
                  <td>{t.fecha}</td>
                  <td className="celda-mono">{t.hora}</td>
                  <td>
                    <button
                      type="button"
                      className="boton-peligro"
                      onClick={() => {
                        if (window.confirm(`¿Cancelar el turno de ${t.nombre} ${t.apellido}?`)) {
                          cancelarTurno(t.id);
                        }
                      }}
                    >
                      Cancelar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
