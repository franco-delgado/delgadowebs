import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getAlumnos, getGrupos, addGrupo, updateGrupoMiembros,
  getRutinaIndividual, getRutinaGrupo, guardarRutina,
} from '../../data/store';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import '../../components/ui/forms.css';
import './RutinasTab.css';

let uid = 0;
const nextId = () => `x${Date.now()}${uid++}`;

function emptyDia() {
  return { id: nextId(), nombre: 'Nuevo día', ejercicios: [] };
}
function emptyEjercicio() {
  return { id: nextId(), nombre: '', series: 3, reps: '10', carga: '' };
}

export default function RutinasTab() {
  const { currentUser } = useAuth();
  const [modo, setModo] = useState('individual'); // 'individual' | 'grupo'
  const [alumnos, setAlumnos] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [alumnoId, setAlumnoId] = useState(null);
  const [grupoId, setGrupoId] = useState(null);
  const [notas, setNotas] = useState('');
  const [dias, setDias] = useState([]);
  const [guardado, setGuardado] = useState(false);
  const [modalGrupoOpen, setModalGrupoOpen] = useState(false);
  const [nombreNuevoGrupo, setNombreNuevoGrupo] = useState('');

  function recargarListas() {
    const misAlumnos = getAlumnos().filter((a) => a.entrenadorId === currentUser.id);
    const misGrupos = getGrupos().filter((g) => g.entrenadorId === currentUser.id);
    setAlumnos(misAlumnos);
    setGrupos(misGrupos);
    if (!alumnoId && misAlumnos.length > 0) setAlumnoId(misAlumnos[0].id);
    if (!grupoId && misGrupos.length > 0) setGrupoId(misGrupos[0].id);
  }

  useEffect(() => { recargarListas(); }, [currentUser.id]);

  // Cargar la rutina existente cada vez que cambia el objetivo seleccionado.
  useEffect(() => {
    if (modo === 'individual' && alumnoId) {
      const existente = getRutinaIndividual(alumnoId);
      setNotas(existente?.notas || '');
      setDias(existente?.dias || []);
    }
    if (modo === 'grupo' && grupoId) {
      const existente = getRutinaGrupo(grupoId);
      setNotas(existente?.notas || '');
      setDias(existente?.dias || []);
    }
    setGuardado(false);
  }, [modo, alumnoId, grupoId]);

  const grupoActual = useMemo(() => grupos.find((g) => g.id === grupoId), [grupos, grupoId]);

  function actualizarDia(diaId, patch) {
    setDias((prev) => prev.map((d) => (d.id === diaId ? { ...d, ...patch } : d)));
  }
  function actualizarEjercicio(diaId, ejId, patch) {
    setDias((prev) =>
      prev.map((d) =>
        d.id !== diaId ? d : { ...d, ejercicios: d.ejercicios.map((e) => (e.id === ejId ? { ...e, ...patch } : e)) }
      )
    );
  }
  function agregarDia() {
    setDias((prev) => [...prev, emptyDia()]);
  }
  function quitarDia(diaId) {
    setDias((prev) => prev.filter((d) => d.id !== diaId));
  }
  function agregarEjercicio(diaId) {
    setDias((prev) => prev.map((d) => (d.id === diaId ? { ...d, ejercicios: [...d.ejercicios, emptyEjercicio()] } : d)));
  }
  function quitarEjercicio(diaId, ejId) {
    setDias((prev) => prev.map((d) => (d.id === diaId ? { ...d, ejercicios: d.ejercicios.filter((e) => e.id !== ejId) } : d)));
  }

  function guardar() {
    const asignadoA = modo === 'individual' ? { tipo: 'individual', alumnoId } : { tipo: 'grupo', grupoId };
    guardarRutina({ asignadoA, notas, dias });
    setGuardado(true);
    setTimeout(() => setGuardado(false), 1800);
  }

  function crearGrupo(e) {
    e.preventDefault();
    if (!nombreNuevoGrupo.trim()) return;
    addGrupo({ nombre: nombreNuevoGrupo.trim(), entrenadorId: currentUser.id });
    setNombreNuevoGrupo('');
    setModalGrupoOpen(false);
    recargarListas();
  }

  function toggleMiembro(alumnoIdToggle) {
    if (!grupoActual) return;
    const yaEsta = grupoActual.alumnoIds.includes(alumnoIdToggle);
    const nuevos = yaEsta
      ? grupoActual.alumnoIds.filter((id) => id !== alumnoIdToggle)
      : [...grupoActual.alumnoIds, alumnoIdToggle];
    updateGrupoMiembros(grupoActual.id, nuevos);
    recargarListas();
  }

  return (
    <div className="rutinas-layout">
      <Card title="¿Para quién es esta rutina?">
        <div className="rutinas-modo-selector">
          <button className={`rutinas-modo-btn ${modo === 'individual' ? 'rutinas-modo-btn-active' : ''}`} onClick={() => setModo('individual')}>
            Individual
          </button>
          <button className={`rutinas-modo-btn ${modo === 'grupo' ? 'rutinas-modo-btn-active' : ''}`} onClick={() => setModo('grupo')}>
            Por grupo
          </button>
        </div>

        {modo === 'individual' && (
          <div className="field rutinas-select-field">
            <label>Alumno</label>
            <select value={alumnoId || ''} onChange={(e) => setAlumnoId(Number(e.target.value))}>
              {alumnos.map((a) => (
                <option key={a.id} value={a.id}>{a.nombre}</option>
              ))}
            </select>
          </div>
        )}

        {modo === 'grupo' && (
          <div className="rutinas-grupo-picker">
            <div className="field rutinas-select-field">
              <label>Grupo</label>
              <select value={grupoId || ''} onChange={(e) => setGrupoId(Number(e.target.value))}>
                {grupos.map((g) => (
                  <option key={g.id} value={g.id}>{g.nombre} ({g.alumnoIds.length} alumnos)</option>
                ))}
              </select>
            </div>
            <button className="btn btn-secondary btn-sm" type="button" onClick={() => setModalGrupoOpen(true)}>
              + Nuevo grupo
            </button>

            {grupoActual && (
              <div className="rutinas-miembros">
                <p className="rutinas-miembros-label">Miembros del grupo</p>
                <div className="rutinas-miembros-grid">
                  {alumnos.map((a) => (
                    <label key={a.id} className="rutinas-miembro-item">
                      <input
                        type="checkbox"
                        checked={grupoActual.alumnoIds.includes(a.id)}
                        onChange={() => toggleMiembro(a.id)}
                      />
                      {a.nombre}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {((modo === 'individual' && alumnoId) || (modo === 'grupo' && grupoId)) && (
        <Card title="Rutina" subtitle="Armá los días de entrenamiento y sus ejercicios">
          <div className="field">
            <label>Nota general (opcional)</label>
            <textarea value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Ej: progresar carga solo si no hay dolor..." />
          </div>

          <div className="rutinas-dias">
            {dias.map((dia) => (
              <div key={dia.id} className="rutinas-dia-card">
                <div className="rutinas-dia-header">
                  <input
                    className="rutinas-dia-nombre"
                    value={dia.nombre}
                    onChange={(e) => actualizarDia(dia.id, { nombre: e.target.value })}
                  />
                  <button className="btn btn-ghost btn-sm" onClick={() => quitarDia(dia.id)}>Quitar día</button>
                </div>

                {dia.ejercicios.map((ej) => (
                  <div key={ej.id} className="rutinas-ejercicio-row">
                    <input placeholder="Ejercicio" value={ej.nombre} onChange={(e) => actualizarEjercicio(dia.id, ej.id, { nombre: e.target.value })} />
                    <input placeholder="Series" value={ej.series} onChange={(e) => actualizarEjercicio(dia.id, ej.id, { series: e.target.value })} />
                    <input placeholder="Reps" value={ej.reps} onChange={(e) => actualizarEjercicio(dia.id, ej.id, { reps: e.target.value })} />
                    <input placeholder="Carga" value={ej.carga} onChange={(e) => actualizarEjercicio(dia.id, ej.id, { carga: e.target.value })} />
                    <button className="btn btn-ghost btn-sm" onClick={() => quitarEjercicio(dia.id, ej.id)}>✕</button>
                  </div>
                ))}
                <button className="btn btn-secondary btn-sm" onClick={() => agregarEjercicio(dia.id)}>+ Ejercicio</button>
              </div>
            ))}
          </div>

          <div className="rutinas-acciones">
            <button className="btn btn-secondary" onClick={agregarDia}>+ Agregar día</button>
            <button className="btn btn-primary" onClick={guardar}>
              {guardado ? 'Guardado ✓' : 'Guardar rutina'}
            </button>
          </div>
        </Card>
      )}

      <Modal
        open={modalGrupoOpen}
        title="Nuevo grupo"
        onClose={() => setModalGrupoOpen(false)}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalGrupoOpen(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={crearGrupo}>Crear grupo</button>
          </>
        }
      >
        <form onSubmit={crearGrupo}>
          <div className="field">
            <label>Nombre del grupo</label>
            <input value={nombreNuevoGrupo} onChange={(e) => setNombreNuevoGrupo(e.target.value)} placeholder="Ej: Grupo Fuerza AM" required />
          </div>
        </form>
      </Modal>
    </div>
  );
}
