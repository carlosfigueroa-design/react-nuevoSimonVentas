/**
 * Tarjetas de asistencias gratuitas con badge "SIN COSTO".
 * No suman a la prima total.
 * Usa sb-ui-card, sb-ui-badge del Design System Seguros Bolívar.
 * Ramo Vida Individual — Simón Ventas.
 */

import { Gift } from 'lucide-react';
import { ASISTENCIAS_GRATUITAS } from '../../constants';

export function AsistenciasGratuitas(): React.JSX.Element {
  return (
    <div className="space-y-3">
      <h2 className="sb-ui-heading-h5 font-semibold text-gray-900">Asistencias Incluidas</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {ASISTENCIAS_GRATUITAS.map((asistencia) => (
          <div
            key={asistencia.id}
            className="sb-ui-card sb-ui-card--outlined flex flex-col gap-2 p-4 border-[#005931]/20 bg-[#005931]/5"
          >
            <div className="flex items-center justify-between">
              <Gift className="h-4 w-4 text-[#005931]" />
              <span className="sb-ui-badge sb-ui-badge--success sb-ui-badge--small">
                SIN COSTO
              </span>
            </div>
            <h4 className="sb-ui-text-label font-medium text-gray-900">{asistencia.name}</h4>
            <p className="sb-ui-text-caption text-gray-500">{asistencia.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
