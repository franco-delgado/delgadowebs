import { useState, useEffect } from 'react';
import { getServicios, updateServicioPrecio, formatMoneda } from '../../data/store';
import Card from '../../components/ui/Card';
import '../../components/ui/forms.css';
import './CuotasTab.css';

export default function CuotasTab() {
  const [servicios, setServicios] = useState([]);
  const [edicion, setEdicion] = useState({});
  const [guardadoId, setGuardadoId] = useState(null);

  useEffect(() => {
    setServicios(getServicios());
  }, []);

  function cambiar(id, valor) {
    setEdicion((prev) => ({ ...prev, [id]: valor }));
  }

  function guardar(id) {
    const valor = edicion[id];
    if (valor === undefined || valor === '') return;
    const actualizados = updateServicioPrecio(id, valor);
    setServicios(actualizados);
    setGuardadoId(id);
    setTimeout(() => setGuardadoId(null), 1500);
  }

  return (
    <Card title="Cuotas y planes" subtitle="Modificá el valor mensual de cada plan">
      <div className="cuotas-list">
        {servicios.map((s) => (
          <div key={s.id} className="cuota-row">
            <div className="cuota-row-info">
              <p className="cuota-row-nombre">{s.nombre}</p>
              <p className="cuota-row-actual">Valor actual: {formatMoneda(s.precio)}</p>
            </div>
            <div className="cuota-row-edit">
              <input
                type="number"
                min="0"
                step="500"
                placeholder={s.precio}
                value={edicion[s.id] ?? ''}
                onChange={(e) => cambiar(s.id, e.target.value)}
              />
              <button className="btn btn-primary btn-sm" onClick={() => guardar(s.id)}>
                {guardadoId === s.id ? 'Guardado ✓' : 'Actualizar'}
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="cuotas-nota">
        Los cambios se aplican a los próximos vencimientos que se calculen para cada plan; no modifica
        pagos ya registrados.
      </p>
    </Card>
  );
}
