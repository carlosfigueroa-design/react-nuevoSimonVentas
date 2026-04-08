/**
 * Barra de sesión de cotización visible durante todo el wizard.
 * Muestra número de cotización, fecha y clave de asesor.
 * Usa sb-ui-input, sb-ui-badge del Design System Seguros Bolívar.
 * Ramo Vida Individual — Simón Ventas.
 */

import { FileText, Calendar, KeyRound } from 'lucide-react';
import { formatDate } from '../../utils';

export interface QuoteSessionHeaderProps {
  quoteNumber: string;
  quoteDate: string;
  advisorKey: string;
  onAdvisorKeyChange: (key: string) => void;
  isAdvisorValid: boolean;
}

export function QuoteSessionHeader({
  quoteNumber,
  quoteDate,
  advisorKey,
  onAdvisorKeyChange,
  isAdvisorValid,
}: QuoteSessionHeaderProps): React.JSX.Element {
  return (
    <div className="sb-ui-card sb-ui-card--outlined flex flex-wrap items-center gap-4 bg-[#005931]/5 px-4 py-2.5">
      <div className="flex items-center gap-1.5 text-[#005931]">
        <FileText className="h-4 w-4" />
        <span className="sb-ui-text-label font-medium">{quoteNumber}</span>
      </div>
      <div className="flex items-center gap-1.5 text-gray-600">
        <Calendar className="h-4 w-4" />
        <span className="sb-ui-text-body">{formatDate(quoteDate)}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <KeyRound className="h-4 w-4 text-gray-500" />
        <input
          type="text"
          value={advisorKey}
          onChange={(e) => onAdvisorKeyChange(e.target.value)}
          placeholder="Clave Asesor"
          aria-label="Clave de Asesor"
          className={`sb-ui-input sb-ui-input--small w-28 ${
            advisorKey && !isAdvisorValid ? 'sb-ui-input--error' : ''
          }`}
        />
      </div>
    </div>
  );
}
