/**
 * Página principal del wizard Vida Individual.
 * Ramo Vida Individual — Simón Ventas.
 */

import { useCallback } from 'react';
import { WizardShell } from '../components/wizard';

export interface VidaIndividualPageProps {
  onNavigate?: (route: string) => void;
}

export function VidaIndividualPage({ onNavigate: _onNavigate }: VidaIndividualPageProps): React.JSX.Element {
  const handleNuevaCotizacion = useCallback(() => {
    // Clear session and reload wizard from scratch
    sessionStorage.removeItem('vida-individual-wizard-state');
    window.location.reload();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-h4 font-bold text-gray-900">Cotización Vida Individual</h1>
          <button
            type="button"
            onClick={handleNuevaCotizacion}
            className="rounded-md border border-[#005931] px-4 py-2 text-sm font-medium text-[#005931] transition-colors hover:bg-[#005931]/5"
          >
            Nueva Cotización
          </button>
        </div>

        {/* Wizard */}
        <WizardShell />
      </div>
    </div>
  );
}
