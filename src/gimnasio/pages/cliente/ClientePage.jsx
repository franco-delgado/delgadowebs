import { useState } from 'react';
import Layout from '../../components/Layout';
import Tabs from '../../components/ui/Tabs';
import MiRutinaTab from './MiRutinaTab';
import AsistenciaTab from './AsistenciaTab';
import RendimientoTab from './RendimientoTab';
import MiCuotaTab from './MiCuotaTab';

const TABS = [
  { id: 'rutina', label: 'Mi rutina' },
  { id: 'asistencia', label: 'Asistencia' },
  { id: 'rendimiento', label: 'Rendimiento' },
  { id: 'cuota', label: 'Mi cuota' },
];

export default function ClientePage() {
  const [active, setActive] = useState('rutina');
  return (
    <Layout title="Mi espacio">
      <Tabs tabs={TABS} active={active} onChange={setActive} />
      {active === 'rutina' && <MiRutinaTab />}
      {active === 'asistencia' && <AsistenciaTab />}
      {active === 'rendimiento' && <RendimientoTab />}
      {active === 'cuota' && <MiCuotaTab />}
    </Layout>
  );
}
