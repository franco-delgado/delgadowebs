import { useState, useEffect } from 'react';
import {
  getAlumnos, addAlumno, updateAlumno, removeAlumno, registrarPago,
  getEntrenadores, getEstadoCuota, getRendimiento, getServicios,
  formatFechaCorta,
} from '../../data/store';
import Card from '../../components/ui/Card';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import '../../components/ui/forms.css';
import './AlumnosTab.css';

const ESTADO_INFO = {
  al_dia: { tone: 'success', label: 'Al día' },
  por_vencer: { tone: 'warning', label: 'Por vencer' },
  vencida: { tone: 'danger', label: 'Adeuda' },
};

const emptyForm = { nombre: '', username: '', password: '1234', plan: 'Básico', entrenadorId: '' };

export default function AlumnosTab() {
  const [alumnos, setAlumnos] = useState([]);
  const [entrenadores, setEntrenadores] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [detalle, setDetalle] = useState(null);

  function recargar() {
    setAlumnos(getAlumnos());
    setEntrenadores(getEntrenadores());
    setServicios(getServicios());
  }

  useEffect(() => { recargar(); }, []);

  function nombreEntrenador(id) {
    const e = entrenadores.find((x) => x.id === id);
    return e ? e.nombre : 'Sin asignar';
  }

  function abrirNuevo() {
    setEditId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function abrirEditar(alumno) {
    setEditId(alumno.id);
    setForm({ nombre: alumno.nombre, username: alumno.username, password: alumno.password, plan: alumno.plan, entrenadorId: alumno.entrenadorId || '' });
    setModalOpen(true);
  }

  function guardar(e) {
    e.preventDefault();
    if (editId) {
      updateAlumno(editId, { ...form, entrenadorId: form.entrenadorId ? Number(form.entrenadorId) : null });
    } else {
      addAlumno({ ...form, entrenadorId: form.entrenadorId ? Number(form.entrenadorId) : null });
    }
    setModalOpen(false);
    recargar();
  }

  function eliminar(id) {
    if (!confirm('¿Eliminar este alumno? Esta acción no se puede deshacer.')) return;
    removeAlumno(id);
    recargar();
  }

  function pagar(id) {
    registrarPago(id);
    recargar();
  }

  return (
    <div className="alumnos-dueno">
      <Card
        title="Alumnos"
        subtitle={`${alumnos.length} alumnos registrados`}
        action={<button className="btn btn-primary btn-sm" onClick={abrirNuevo}>+ Nuevo alumno</button>}
      >
        <DataTable
          columns={[
            { key: 'nombre', header: 'Nombre' },
            { key: 'plan', header: 'Plan' },
            { key: 'entrenadorId', header: 'Entrenador', render: (row) => nombreEntrenador(row.entrenadorId) },
            {
              key: 'estado',
              header: 'Cuota',
              render: (row) => {
                const { estado } = getEstadoCuota(row);
                const info = ESTADO_INFO[estado];
                return <Badge tone={info.tone}>{info.label}</Badge>;
              },
            },
            { key: 'fechaProximoPago', header: 'Próximo pago', render: (row) => formatFechaCorta(row.fechaProximoPago) },
            {
              key: 'rendimiento',
              header: 'Asist. este mes',
              render: (row) => getRendimiento(row).asistenciasMes,
            },
            {
              key: 'acciones',
              header: '',
              render: (row) => (
                <div className="alumnos-acciones">
                  <button className="btn btn-secondary btn-sm" onClick={() => pagar(row.id)}>Registrar pago</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setDetalle(row)}>Ver</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => abrirEditar(row)}>Editar</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => eliminar(row.id)}>Eliminar</button>
                </div>
              ),
            },
          ]}
          rows={alumnos}
        />
      </Card>

      <Modal
        open={modalOpen}
        title={editId ? 'Editar alumno' : 'Nuevo alumno'}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={guardar}>{editId ? 'Guardar cambios' : 'Crear alumno'}</button>
          </>
        }
      >
        <form onSubmit={guardar}>
          <div className="field">
            <label>Nombre completo</label>
            <input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          </div>
          <div className="field">
            <label>Usuario (para que inicie sesión)</label>
            <input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase() })} />
          </div>
          <div className="field">
            <label>Contraseña</label>
            <input required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div className="field">
            <label>Plan</label>
            <select value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}>
              {servicios.map((s) => <option key={s.id} value={s.nombre}>{s.nombre}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Entrenador asignado</label>
            <select value={form.entrenadorId} onChange={(e) => setForm({ ...form, entrenadorId: e.target.value })}>
              <option value="">Sin asignar</option>
              {entrenadores.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
            </select>
          </div>
        </form>
      </Modal>

      <Modal open={!!detalle} title="Detalle del alumno" onClose={() => setDetalle(null)}>
        {detalle && (
          <div className="alumno-detalle">
            <p><span>Nombre:</span> {detalle.nombre}</p>
            <p><span>Usuario de acceso:</span> {detalle.username}</p>
            <p><span>Plan:</span> {detalle.plan}</p>
            <p><span>Entrenador:</span> {nombreEntrenador(detalle.entrenadorId)}</p>
            <p><span>Próximo pago:</span> {formatFechaCorta(detalle.fechaProximoPago)}</p>
            <p><span>Asistencias totales:</span> {getRendimiento(detalle).totalAsistencias}</p>
            <p><span>Racha actual:</span> {getRendimiento(detalle).racha} días</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
