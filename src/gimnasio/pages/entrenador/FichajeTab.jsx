import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getEntrenadorById, ficharEntrenador } from '../../data/store';
import Card from '../../components/ui/Card';
import DataTable from '../../components/ui/DataTable';
import './FichajeTab.css';

export default function FichajeTab() {
  const { currentUser } = useAuth();
  const [entrenador, setEntrenador] = useState(null);
  const [fichado, setFichado] = useState(false);
  const [horaEntrada, setHoraEntrada] = useState(null);

  useEffect(() => {
    setEntrenador(getEntrenadorById(currentUser.id));
  }, [currentUser.id]);

  if (!entrenador) return null;

  function fichar() {
    const ahora = new Date();
    const horaStr = ahora.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    if (!fichado) {
      setHoraEntrada(horaStr);
      setFichado(true);
    } else {
      const actualizado = ficharEntrenador(currentUser.id, {
        fecha: ahora.toLocaleDateString('es-AR'),
        entrada: horaEntrada,
        salida: horaStr,
      });
      setEntrenador(actualizado);
      setFichado(false);
      setHoraEntrada(null);
    }
  }

  return (
    <div className="fichaje-layout">
      <Card title="Fichaje de hoy" subtitle={fichado ? `Entrada registrada: ${horaEntrada}` : 'Todavía no fichaste entrada'}>
        <button className={`btn ${fichado ? 'btn-secondary' : 'btn-primary'} fichaje-btn`} onClick={fichar}>
          {fichado ? 'Fichar salida' : 'Fichar entrada'}
        </button>
      </Card>

      <Card title="Mi historial de jornada">
        <DataTable
          columns={[
            { key: 'fecha', header: 'Fecha' },
            { key: 'entrada', header: 'Entrada' },
            { key: 'salida', header: 'Salida' },
          ]}
          rows={entrenador.jornada}
        />
      </Card>
    </div>
  );
}
