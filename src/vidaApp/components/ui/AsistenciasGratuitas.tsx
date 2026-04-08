/**
 * Tarjetas de asistencias gratuitas con badge "SIN COSTO".
 * No suman a la prima total.
 * Ramo Vida Individual — Simón Ventas.
 */

import { Gift } from 'lucide-react';
import { ASISTENCIAS_GRATUITAS } from '../../constants';

export function AsistenciasGratuitas(): React.JSX.Element {
  return (
    <div className="space-y-3">
      <h2 className="text-h5 font-semibold text-gray-900">Asistencias Incluidas</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {ASISTENCIAS_GRATUITAS.map((asistencia) => (
          <div
            key={asistencia.id}
            className="flex flex-col gap-2 rounded-lg border border-[#005931]/20 bg-[#005931]/5 p-4"
          >
            <div className="flex items-center justify-between">
              <Gift className="h-4 w-4 text-[#005931]" />
              <span className="sb-ui-badge sb-ui-badge--success sb-ui-badge--small">
                SIN COSTO
              </span>
            </div>
            <h4 className="text-sm font-medium text-gray-900">{asistencia.name}</h4>
            <p className="text-xs text-gray-500">{asistencia.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
