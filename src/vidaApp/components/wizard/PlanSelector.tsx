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
    <div className="sb-ui-select-container">
      <label htmlFor="plan-selector" className="sb-ui-select-label sb-ui-select-label--required">
        Plan de Vida
      </label>
      <select
        id="plan-selector"
        value={value}
        onChange={(e) => onChange(e.target.value as PlanVida)}
        aria-invalid={!!error}
        aria-describedby={error ? 'plan-selector-error' : undefined}
        className={`sb-ui-select ${error ? 'sb-ui-select--error' : ''}`}
      >
        <option value="">Seleccione un plan...</option>
        {PLAN_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p id="plan-selector-error" className="sb-ui-select-helper sb-ui-select-helper--error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
