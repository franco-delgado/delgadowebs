import { useState } from 'react';
import Layout from '../../components/Layout';
import Tabs from '../../components/ui/Tabs';
import FichajeTab from './FichajeTab';
import RutinasTab from './RutinasTab';

const TABS = [
  { id: 'fichaje', label: 'Fichaje' },
  { id: 'rutinas', label: 'Rutinas' },
];

export default function EntrenadorPage() {
  const [active, setActive] = useState('fichaje');
  return (
    <Layout title="Panel entrenador">
      <Tabs tabs={TABS} active={active} onChange={setActive} />
      {active === 'fichaje' && <FichajeTab />}
      {active === 'rutinas' && <RutinasTab />}
    </Layout>
  );
}
