import { useState, useEffect } from 'react';
import { getEntrenadores, addEntrenador, updateEntrenador, removeEntrenador } from '../../data/store';
import Card from '../../components/ui/Card';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import '../../components/ui/forms.css';
import './EntrenadoresTab.css';

const emptyForm = { nombre: '', username: '', password: '1234', especialidad: '' };

export default function EntrenadoresTab() {
  const [entrenadores, setEntrenadores] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [detalle, setDetalle] = useState(null);

  function recargar() {
    setEntrenadores(getEntrenadores());
  }
  useEffect(() => { recargar(); }, []);

  function abrirNuevo() {
    setEditId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }
  function abrirEditar(e) {
    setEditId(e.id);
    setForm({ nombre: e.nombre, username: e.username, password: e.password, especialidad: e.especialidad });
    setModalOpen(true);
  }

  function guardar(e) {
    e.preventDefault();
    if (editId) {
      updateEntrenador(editId, form);
    } else {
      addEntrenador(form);
    }
    setModalOpen(false);
    recargar();
  }

  function eliminar(id) {
    if (!confirm('¿Eliminar este entrenador? Sus alumnos y grupos quedarán sin asignar.')) return;
    removeEntrenador(id);
    recargar();
  }

  return (
    <div className="entrenadores-dueno">
      <Card
        title="Entrenadores"
        subtitle={`${entrenadores.length} entrenadores en el equipo`}
        action={<button className="btn btn-primary btn-sm" onClick={abrirNuevo}>+ Nuevo entrenador</button>}
      >
        <DataTable
          columns={[
            { key: 'nombre', header: 'Nombre' },
            { key: 'especialidad', header: 'Especialidad' },
            { key: 'jornada', header: 'Fichajes registrados', render: (row) => row.jornada.length },
            {
              key: 'acciones',
              header: '',
              render: (row) => (
                <div className="entrenadores-acciones">
                  <button className="btn btn-ghost btn-sm" onClick={() => setDetalle(row)}>Ver horarios</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => abrirEditar(row)}>Editar</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => eliminar(row.id)}>Eliminar</button>
                </div>
              ),
            },
          ]}
          rows={entrenadores}
        />
      </Card>

      <Modal
        open={modalOpen}
        title={editId ? 'Editar entrenador' : 'Nuevo entrenador'}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={guardar}>{editId ? 'Guardar cambios' : 'Crear entrenador'}</button>
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
            <label>Especialidad</label>
            <input value={form.especialidad} onChange={(e) => setForm({ ...form, especialidad: e.target.value })} placeholder="Ej: Fuerza, funcional, rehab..." />
          </div>
        </form>
      </Modal>

      <Modal open={!!detalle} title={detalle ? `Horarios de ${detalle.nombre}` : ''} onClose={() => setDetalle(null)}>
        {detalle && (
          <DataTable
            columns={[
              { key: 'fecha', header: 'Fecha' },
              { key: 'entrada', header: 'Entrada' },
              { key: 'salida', header: 'Salida' },
            ]}
            rows={detalle.jornada}
            emptyMessage="Todavía no registró fichajes."
          />
        )}
      </Modal>
    </div>
  );
}
