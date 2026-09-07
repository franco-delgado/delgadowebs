import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAlumnoById, getRendimiento } from '../../data/store';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import './RendimientoTab.css';

export default function RendimientoTab() {
  const { currentUser } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    const alumno = getAlumnoById(currentUser.id);
    if (alumno) setData(getRendimiento(alumno));
  }, [currentUser.id]);

  if (!data) return null;

  const nombreMes = new Date().toLocaleDateString('es-AR', { month: 'long' });

  return (
    <div className="rendimiento-layout">
      <div className="rendimiento-stats">
        <StatCard label={`Asistencias en ${nombreMes}`} value={data.asistenciasMes} />
        <StatCard label="Racha actual" value={`${data.racha} ${data.racha === 1 ? 'día' : 'días'}`} tone={data.racha > 0 ? 'positive' : 'neutral'} />
        <StatCard label="Asistencias totales" value={data.totalAsistencias} />
      </div>
      <Card title="Sobre tu rendimiento">
        <p className="rendimiento-nota">
          Este panel se arma en base a tu asistencia registrada. A medida que marques más días,
          tu entrenador va a poder ver tu constancia y ajustar tu rutina.
        </p>
      </Card>
    </div>
  );
}
