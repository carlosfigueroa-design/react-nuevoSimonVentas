/**
 * Dropdown de selección de plan de vida (5 productos).
 * Usa sb-ui-select del Design System Seguros Bolívar.
 * Ramo Vida Individual — Simón Ventas.
 */

import type { PlanVida } from '../../types';
import { PLAN_OPTIONS } from '../../constants';

export interface PlanSelectorProps {
  value: PlanVida | '';
  onChange: (plan: PlanVida) => void;
  error?: string;
}

export function PlanSelector({ value, onChange, error }: PlanSelectorProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="plan-selector" className="text-sm font-medium text-gray-700">
        Plan de Vida <span className="text-red-500">*</span>
      </label>
      <select
        id="plan-selector"
        value={value}
        onChange={(e) => onChange(e.target.value as PlanVida)}
        aria-invalid={!!error}
        aria-describedby={error ? 'plan-selector-error' : undefined}
        className={`sb-ui-select w-full ${error ? 'sb-ui-select--error' : ''}`}
      >
        <option value="">Seleccione un plan...</option>
        {PLAN_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p id="plan-selector-error" className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
