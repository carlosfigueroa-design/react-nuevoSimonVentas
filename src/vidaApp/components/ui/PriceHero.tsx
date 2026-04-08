/**
 * Tarjeta destacada en Verde Bolívar con prima mensual total.
 * Desglose: cobertura básica + anexos + recargo salud + ahorro.
 * Usa sb-ui-card del Design System Seguros Bolívar.
 * Ramo Vida Individual — Simón Ventas.
 */

import { formatCurrency } from '../../utils';

export interface PriceHeroProps {
  totalPrima: number;
  basicCoverage: number;
  annexes: number;
  healthSurcharge: number;
  savings: number;
}

export function PriceHero({
  totalPrima,
  basicCoverage,
  annexes,
  healthSurcharge,
  savings,
}: PriceHeroProps): React.JSX.Element {
  return (
    <div className="sb-ui-card sb-ui-card--elevated rounded-xl bg-[#005931] p-6 text-white">
      <p className="sb-ui-text-caption font-medium uppercase tracking-wider text-white/70">
        Prima Mensual Total
      </p>
      <p className="mt-2 sb-ui-heading-h2 font-bold">${formatCurrency(totalPrima)}</p>

      <div className="mt-4 space-y-1.5 border-t border-white/20 pt-4">
        <BreakdownRow label="Cobertura básica" value={basicCoverage} />
        <BreakdownRow label="Anexos opcionales" value={annexes} />
        {healthSurcharge > 0 && (
          <BreakdownRow label="Recargo salud" value={healthSurcharge} />
        )}
        {savings > 0 && <BreakdownRow label="Ahorro mensual" value={savings} />}
      </div>
    </div>
  );
}

function BreakdownRow({ label, value }: { label: string; value: number }): React.JSX.Element {
  return (
    <div className="flex items-center justify-between sb-ui-text-body">
      <span className="text-white/80">{label}</span>
      <span className="font-medium">${formatCurrency(value)}</span>
    </div>
  );
}
