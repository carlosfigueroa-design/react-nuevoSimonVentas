/**
 * Página principal del wizard Vida Individual.
 * Presentación alineada al estilo del cotizador de Autos.
 * Ramo Vida Individual — Simón Ventas.
 */

import { Heart } from 'lucide-react';
import { WizardShell } from '../components/wizard';

export interface VidaIndividualPageProps {
  onNavigate?: (route: string) => void;
}

export function VidaIndividualPage({ onNavigate: _onNavigate }: VidaIndividualPageProps): React.JSX.Element {
  return (
    <div className="px-4 py-6">
      <div className="mx-auto max-w-5xl">
        {/* Header — alineado al estilo de Autos */}
        <div className="mb-10">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#005931]/10">
              <Heart className="h-7 w-7 text-[#005931]" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#002B49]">Cotización Vida Individual</h2>
              <p className="text-gray-500 mt-1">Completa los siguientes pasos para generar la cotización.</p>
            </div>
          </div>
        </div>

        {/* Wizard */}
        <WizardShell />
      </div>
    </div>
  );
}
