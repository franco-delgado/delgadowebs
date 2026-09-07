import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAlumnoById, getRutinaParaAlumno, getGrupoDeAlumno } from '../../data/store';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import './MiRutinaTab.css';

export default function MiRutinaTab() {
  const { currentUser } = useAuth();
  const [rutina, setRutina] = useState(null);
  const [grupo, setGrupo] = useState(null);

  useEffect(() => {
    function cargar() {
      const alumno = getAlumnoById(currentUser.id);
      if (!alumno) return;
      setRutina(getRutinaParaAlumno(alumno));
      setGrupo(getGrupoDeAlumno(alumno.id));
    }
    cargar();
    window.addEventListener('storage', cargar);
    return () => window.removeEventListener('storage', cargar);
  }, [currentUser.id]);

  const tieneDias = rutina && rutina.dias && rutina.dias.length > 0;

  return (
    <Card
      title="Mi rutina de entrenamiento"
      subtitle={
        tieneDias
          ? `${rutina.asignadoA.tipo === 'grupo' ? `Rutina grupal · ${grupo?.nombre}` : 'Rutina individual'} · actualizada el ${rutina.actualizada}`
          : 'Tu entrenador todavía no armó tu rutina'
      }
      action={rutina && <Badge tone={rutina.asignadoA.tipo === 'grupo' ? 'info' : 'primary'}>{rutina.asignadoA.tipo === 'grupo' ? 'Grupal' : 'Individual'}</Badge>}
    >
      {!tieneDias && (
        <p className="mirutina-empty">
          Cuando tu entrenador cargue tu rutina de ejercicios (individual o de tu grupo), la vas a ver acá.
        </p>
      )}

      {tieneDias && (
        <>
          {rutina.notas && (
            <div className="mirutina-nota">
              <p className="mirutina-nota-label">Nota de tu entrenador</p>
              <p>{rutina.notas}</p>
            </div>
          )}
          <div className="mirutina-dias">
            {rutina.dias.map((dia) => (
              <div key={dia.id} className="mirutina-dia">
                <p className="mirutina-dia-titulo">{dia.nombre}</p>
                <div className="mirutina-tabla">
                  <div className="mirutina-fila mirutina-fila-header">
                    <span>Ejercicio</span>
                    <span>Series</span>
                    <span>Reps</span>
                    <span>Carga</span>
                  </div>
                  {dia.ejercicios.map((ej) => (
                    <div key={ej.id} className="mirutina-fila">
                      <span>{ej.nombre}</span>
                      <span>{ej.series}</span>
                      <span>{ej.reps}</span>
                      <span>{ej.carga}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
