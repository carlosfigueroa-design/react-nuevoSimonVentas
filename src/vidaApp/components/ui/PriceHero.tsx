/**
 * Tarjeta destacada en Verde Bolívar con prima mensual total.
 * Desglose: cobertura básica + anexos + recargo salud + ahorro.
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
    <div className="rounded-xl bg-[#005931] p-6 text-white">
      <p className="text-xs font-medium uppercase tracking-wider text-white/70">
        Prima Mensual Total
      </p>
      <p className="mt-2 text-4xl font-bold">${formatCurrency(totalPrima)}</p>

      <div className="mt-4 space-y-1.5 border-t border-white/20 pt-4 text-sm">
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
    <div className="flex items-center justify-between">
      <span className="text-white/80">{label}</span>
      <span className="font-medium">${formatCurrency(value)}</span>
    </div>
  );
}
