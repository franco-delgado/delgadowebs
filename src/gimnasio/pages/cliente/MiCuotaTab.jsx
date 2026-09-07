import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAlumnoById, getEstadoCuota, getPrecioPlan, formatFechaCorta, formatMoneda } from '../../data/store';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import './MiCuotaTab.css';

const ESTADO_INFO = {
  al_dia: { tone: 'success', label: 'Al día' },
  por_vencer: { tone: 'warning', label: 'Por vencer' },
  vencida: { tone: 'danger', label: 'Vencida' },
};

export default function MiCuotaTab() {
  const { currentUser } = useAuth();
  const [alumno, setAlumno] = useState(null);

  useEffect(() => {
    setAlumno(getAlumnoById(currentUser.id));
  }, [currentUser.id]);

  if (!alumno) return null;

  const { estado, diffDias } = getEstadoCuota(alumno);
  const info = ESTADO_INFO[estado];
  const precio = getPrecioPlan(alumno.plan);

  let mensaje = '';
  if (estado === 'al_dia') mensaje = `Tu próximo pago vence en ${diffDias} días.`;
  if (estado === 'por_vencer') mensaje = diffDias === 0 ? 'Tu cuota vence hoy.' : `Tu cuota vence en ${diffDias} día${diffDias === 1 ? '' : 's'}.`;
  if (estado === 'vencida') mensaje = `Tu cuota venció hace ${Math.abs(diffDias)} día${Math.abs(diffDias) === 1 ? '' : 's'}.`;

  return (
    <Card
      title="Estado de mi cuota"
      subtitle={`Plan ${alumno.plan}`}
      action={<Badge tone={info.tone}>{info.label}</Badge>}
    >
      <div className="cuota-grid">
        <div className="cuota-item">
          <p className="cuota-label">Plan actual</p>
          <p className="cuota-valor">{alumno.plan}</p>
        </div>
        <div className="cuota-item">
          <p className="cuota-label">Monto mensual</p>
          <p className="cuota-valor">{formatMoneda(precio)}</p>
        </div>
        <div className="cuota-item">
          <p className="cuota-label">Próximo vencimiento</p>
          <p className="cuota-valor">{formatFechaCorta(alumno.fechaProximoPago)}</p>
        </div>
      </div>
      <p className={`cuota-mensaje cuota-mensaje-${info.tone}`}>{mensaje}</p>
      {estado !== 'al_dia' && (
        <p className="cuota-ayuda">Para regularizar tu cuota, acercate a recepción o hablá con el dueño del gimnasio.</p>
      )}
    </Card>
  );
}
