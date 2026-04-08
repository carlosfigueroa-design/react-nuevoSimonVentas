/**
 * Tarjeta interactiva de selección de amparo (cobertura).
 * Soporta sub-coberturas expandibles y mensajes de dependencias.
 * Usa sb-ui-card, sb-ui-toggle, sb-ui-input, sb-ui-badge del DS.
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
    ? 'sb-ui-card sb-ui-card--outlined border-[#005931] bg-[#005931]/5 shadow-md'
    : 'sb-ui-card sb-ui-card--outlined border-gray-200 bg-white hover:border-gray-300';

  return (
    <div
      className={`${cardClasses} p-4 transition-all`}
      role="group"
      aria-label={coverage.name}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="sb-ui-text-label font-semibold text-gray-900">{coverage.name}</h3>
            {isMandatory && (
              <span className="sb-ui-badge sb-ui-badge--success sb-ui-badge--small">
                Obligatorio
              </span>
            )}
          </div>
          <p className="mt-1 sb-ui-text-caption text-gray-500">{coverage.description}</p>
        </div>

        <label className="sb-ui-toggle sb-ui-toggle--compact">
          <input
            type="checkbox"
            className="sb-ui-toggle-input"
            role="switch"
            aria-checked={isSelected}
            aria-label={`${isSelected ? 'Desactivar' : 'Activar'} ${coverage.name}`}
            disabled={isMandatory}
            checked={isSelected}
            onChange={() => onToggle(coverage.id)}
          />
          <span className="sb-ui-toggle-slider" />
        </label>
      </div>

      {isSelected && (
        <div className="mt-3 border-t border-gray-200 pt-3">
          <div className="flex items-center justify-between gap-4">
            <div className="sb-ui-input-container flex-1">
              <label className="sb-ui-input-label sb-ui-text-caption">Valor asegurado</label>
              <input
                type="number"
                min={0}
                onChange={(e) => onAmountChange(coverage.id, Number(e.target.value))}
                className="sb-ui-input sb-ui-input--small"
                placeholder="0"
              />
            </div>
            <div className="text-right">
              <span className="sb-ui-text-caption text-gray-400 uppercase">Prima</span>
              <p className="sb-ui-text-label font-bold text-[#005931]">
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
        <div className="sb-ui-alert sb-ui-alert--warning sb-ui-alert--small mt-2">
          <span className="sb-ui-alert__message">{deselectionError}</span>
        </div>
      )}
    </div>
  );
}
