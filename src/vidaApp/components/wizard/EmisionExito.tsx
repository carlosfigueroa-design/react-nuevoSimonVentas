/**
 * Pantalla de éxito post-emisión con número de póliza.
 * Variante para cotización provisoria (~20% fuera de política).
 * Ramo Vida Individual — Simón Ventas.
 */

import { CheckCircle, Clock } from 'lucide-react';

export interface EmisionExitoProps {
  policyNumber: string;
  isProvisoria: boolean;
  onDashboard: () => void;
  onNuevaCotizacion: () => void;
}

export function EmisionExito({
  policyNumber,
  isProvisoria,
  onDashboard,
  onNuevaCotizacion,
}: EmisionExitoProps): React.JSX.Element {
  return (
    <div className="flex flex-col items-center gap-6 py-12 text-center">
      {isProvisoria ? (
        <Clock className="h-16 w-16 text-[#FFD100]" />
      ) : (
        <CheckCircle className="h-16 w-16 text-[#00C875]" />
      )}

      <div className="space-y-2">
        <h1 className="text-h3 font-bold text-gray-900">
          {isProvisoria ? 'Cotización Provisoria Generada' : '¡Póliza Emitida Exitosamente!'}
        </h1>
        <p className="text-sm text-gray-600">
          {isProvisoria
            ? 'Su cotización será revisada por el equipo de Operaciones.'
            : 'La póliza ha sido emitida correctamente.'}
        </p>
      </div>

      <div className="rounded-lg bg-gray-50 px-6 py-4">
        <p className="text-xs text-gray-500 uppercase tracking-wider">
          {isProvisoria ? 'Número de Cotización' : 'Número de Póliza'}
        </p>
        <p className="mt-1 text-xl font-bold text-[#005931]">{policyNumber}</p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onDashboard}
          className="rounded-md border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Volver al Dashboard
        </button>
        <button
          type="button"
          onClick={onNuevaCotizacion}
          className="rounded-md bg-[#005931] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#005931]/90 transition-colors"
        >
          Nueva Cotización
        </button>
      </div>
    </div>
  );
}
