/**
 * Sub-coberturas dentro de Accidentes Personales.
 * Expandibles dentro de CoverageCard.
 * Ramo Vida Individual — Simón Ventas.
 */

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { SubCoverageConfig } from '../../types';

export interface SubCoberturasProps {
  subCoverages: SubCoverageConfig[];
}

export function SubCoberturas({ subCoverages }: SubCoberturasProps): React.JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);

  if (subCoverages.length === 0) return <></>;

  return (
    <div className="mt-3 border-t border-gray-200 pt-3">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between text-xs font-medium text-[#005931] hover:text-[#005931]/80 transition-colors"
      >
        <span>Sub-coberturas ({subCoverages.length})</span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {isExpanded && (
        <ul className="mt-2 space-y-2">
          {subCoverages.map((sub) => (
            <li
              key={sub.id}
              className="rounded-md bg-gray-50 px-3 py-2"
            >
              <p className="text-xs font-medium text-gray-800">{sub.name}</p>
              <p className="text-[11px] text-gray-500">{sub.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
