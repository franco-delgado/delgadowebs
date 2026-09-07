import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAlumnoById, marcarAsistenciaHoy } from '../../data/store';
import Card from '../../components/ui/Card';
import './AsistenciaTab.css';

function hoyISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function AsistenciaTab() {
  const { currentUser } = useAuth();
  const [alumno, setAlumno] = useState(null);

  useEffect(() => {
    setAlumno(getAlumnoById(currentUser.id));
  }, [currentUser.id]);

  if (!alumno) return null;

  const yaMarco = alumno.asistencias.includes(hoyISO());

  function marcar() {
    const actualizado = marcarAsistenciaHoy(currentUser.id);
    setAlumno(actualizado);
  }

  const ultimas = [...alumno.asistencias].sort().reverse().slice(0, 10);

  return (
    <div className="asistencia-cliente">
      <Card title="Asistencia de hoy" subtitle={yaMarco ? 'Ya marcaste tu asistencia de hoy ✓' : 'Todavía no marcaste tu asistencia de hoy'}>
        <button className={`btn ${yaMarco ? 'btn-secondary' : 'btn-primary'} asistencia-btn`} onClick={marcar} disabled={yaMarco}>
          {yaMarco ? 'Asistencia registrada' : 'Marcar mi asistencia'}
        </button>
      </Card>

      <Card title="Historial reciente" subtitle={`${alumno.asistencias.length} asistencias en total`}>
        {ultimas.length === 0 && <p className="asistencia-empty">Todavía no registraste ninguna asistencia.</p>}
        {ultimas.length > 0 && (
          <ul className="asistencia-list">
            {ultimas.map((iso) => (
              <li key={iso}>{new Date(iso + 'T00:00:00').toLocaleDateString('es-AR', { weekday: 'long', day: '2-digit', month: 'long' })}</li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
