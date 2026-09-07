import { useState } from 'react';
import Layout from '../../components/Layout';
import Tabs from '../../components/ui/Tabs';
import AlumnosTab from './AlumnosTab';
import EntrenadoresTab from './EntrenadoresTab';
import CuotasTab from './CuotasTab';

const TABS = [
  { id: 'alumnos', label: 'Alumnos' },
  { id: 'entrenadores', label: 'Entrenadores' },
  { id: 'cuotas', label: 'Cuotas y planes' },
];

export default function DuenoPage() {
  const [active, setActive] = useState('alumnos');
  return (
    <Layout title="Panel del dueño">
      <Tabs tabs={TABS} active={active} onChange={setActive} />
      {active === 'alumnos' && <AlumnosTab />}
      {active === 'entrenadores' && <EntrenadoresTab />}
      {active === 'cuotas' && <CuotasTab />}
    </Layout>
  );
}
