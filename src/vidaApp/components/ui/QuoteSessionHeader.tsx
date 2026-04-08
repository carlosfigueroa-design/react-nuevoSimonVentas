/**
 * Barra de sesión de cotización visible durante todo el wizard.
 * Muestra número de cotización, fecha y clave de asesor.
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
    <div className="flex flex-wrap items-center gap-4 rounded-lg bg-[#005931]/5 px-4 py-2.5 text-sm">
      <div className="flex items-center gap-1.5 text-[#005931]">
        <FileText className="h-4 w-4" />
        <span className="font-medium">{quoteNumber}</span>
      </div>
      <div className="flex items-center gap-1.5 text-gray-600">
        <Calendar className="h-4 w-4" />
        <span>{formatDate(quoteDate)}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <KeyRound className="h-4 w-4 text-gray-500" />
        <input
          type="text"
          value={advisorKey}
          onChange={(e) => onAdvisorKeyChange(e.target.value)}
          placeholder="Clave Asesor"
          aria-label="Clave de Asesor"
          className={`w-28 rounded border px-2 py-1 text-xs transition-colors focus:outline-none focus:ring-1 ${
            advisorKey && !isAdvisorValid
              ? 'border-red-400 focus:ring-red-300'
              : 'border-gray-300 focus:ring-[#005931]/30 focus:border-[#005931]'
          }`}
        />
      </div>
    </div>
  );
}
