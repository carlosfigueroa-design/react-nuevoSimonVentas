/**
 * Tarjeta interactiva de selección de amparo (cobertura).
 * Soporta sub-coberturas expandibles y mensajes de dependencias.
 * Ramo Vida Individual — Simón Ventas.
 */

import type { CoverageConfig, SubCoverageConfig } from '../../types';
import { SubCoberturas } from './SubCoberturas';

export interface CoverageCardProps {
  coverage: CoverageConfig;
  isSelected: boolean;
  isMandatory: boolean;
  onToggle: (coverageId: string) => void;
  onAmountChange: (coverageId: string, value: number) => void;
  prima: number;
  /** Sub-coberturas expandibles dentro de esta cobertura */
  subCoverages?: SubCoverageConfig[];
  /** Mensaje de error de dependencias al intentar deseleccionar */
  deselectionError?: string | null;
}

export function CoverageCard({
  coverage,
  isSelected,
  isMandatory,
  onToggle,
  onAmountChange,
  prima,
  subCoverages,
  deselectionError,
}: CoverageCardProps): React.JSX.Element {
  const cardClasses = isSelected
    ? 'border-[#005931] bg-[#005931]/5 shadow-md'
    : 'border-gray-200 bg-white hover:border-gray-300';

  return (
    <div
      className={`rounded-lg border-2 p-4 transition-all ${cardClasses}`}
      role="group"
      aria-label={coverage.name}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-900">{coverage.name}</h3>
            {isMandatory && (
              <span className="rounded-full bg-[#005931] px-2 py-0.5 text-[10px] font-medium text-white">
                Obligatorio
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">{coverage.description}</p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={isSelected}
          aria-label={`${isSelected ? 'Desactivar' : 'Activar'} ${coverage.name}`}
          disabled={isMandatory}
          onClick={() => onToggle(coverage.id)}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
            isMandatory ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
          } ${isSelected ? 'bg-[#005931]' : 'bg-gray-300'}`}
        >
          <span
            className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
              isSelected ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {isSelected && (
        <div className="mt-3 border-t border-gray-200 pt-3">
          <div className="flex items-center justify-between gap-4">
            <label className="text-xs text-gray-600">
              Valor asegurado
              <input
                type="number"
                min={0}
                onChange={(e) => onAmountChange(coverage.id, Number(e.target.value))}
                className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-[#005931] focus:outline-none focus:ring-1 focus:ring-[#005931]/15"
                placeholder="0"
              />
            </label>
            <div className="text-right">
              <span className="text-[10px] uppercase text-gray-400">Prima</span>
              <p className="text-sm font-bold text-[#005931]">
                ${prima.toLocaleString('es-CO', { minimumFractionDigits: 0 })}
              </p>
            </div>
          </div>

          {/* Sub-coberturas expandibles */}
          {subCoverages && subCoverages.length > 0 && (
            <SubCoberturas subCoverages={subCoverages} />
          )}
        </div>
      )}

      {/* Dependency error message */}
      {deselectionError && !isSelected && (
        <div className="mt-2 rounded-md bg-yellow-50 border border-yellow-200 px-2 py-1.5 text-[11px] text-yellow-800">
          {deselectionError}
        </div>
      )}
    </div>
  );
}
