/**
 * Enrutador principal de la aplicación Simón Ventas.
 * Usa un router basado en estado simple (sin react-router).
 */

import { useState, useCallback, lazy, Suspense } from 'react';
import './index.css';
import { AppLayout } from './components/layout/AppLayout';

const Dashboard = lazy(() => import('./components/dashboard/Dashboard').then(m => ({ default: m.Dashboard })));
const VidaIndividualPage = lazy(() => import('./pages/VidaIndividualPage').then(m => ({ default: m.VidaIndividualPage })));

/** Rutas disponibles en la aplicación */
type Route = 'home' | 'vida_individual' | 'consulta_cotizaciones';

/** Pantalla placeholder de consulta de cotizaciones */
function ConsultaCotizaciones(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 pt-32">
      <h1 className="text-xl font-bold text-gray-900">Consulta de Cotizaciones</h1>
      <p className="text-sm text-gray-400">Próximamente</p>
    </div>
  );
}

export default function App({ initialRoute = 'home' }: { initialRoute?: Route }): React.JSX.Element {
  const [route, setRoute] = useState<Route>(initialRoute);

  const navigate = useCallback((r: string) => setRoute(r as Route), []);

  const renderContent = () => {
    switch (route) {
      case 'vida_individual':
        return <VidaIndividualPage onNavigate={navigate} />;
      case 'consulta_cotizaciones':
        return <ConsultaCotizaciones />;
      default:
        return <Dashboard onNavigate={navigate} />;
    }
  };

  return (
    <AppLayout currentRoute={route} onNavigate={navigate}>
      <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#005931]" /></div>}>
        {renderContent()}
      </Suspense>
    </AppLayout>
  );
}
