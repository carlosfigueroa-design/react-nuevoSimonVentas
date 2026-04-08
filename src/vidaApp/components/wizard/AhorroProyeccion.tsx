/**
 * Módulo de ahorro con pestañas RENTAS/NECESIDADES y ProjectionChart.
 * Ramo Vida Individual — Simón Ventas.
 */

import { useState, useMemo } from 'react';
import type { RentasConfig, NecesidadesConfig, ProjectionDataPoint } from '../../types';
import { ProjectionChart } from '../ui/ProjectionChart';
import { formatCurrency } from '../../utils';

type Tab = 'rentas' | 'necesidades';

export function AhorroProyeccion(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<Tab>('rentas');

  const [rentas, setRentas] = useState<RentasConfig>({
    monthlyIncome: 3000000,
    projectionYears: 20,
    interestRate: 6,
  });

  const [necesidades, setNecesidades] = useState<NecesidadesConfig>({
    educationCost: 50000000,
    debtBalance: 20000000,
    monthlyExpenses: 3000000,
    dependents: 2,
  });

  const rentasData = useMemo((): ProjectionDataPoint[] => {
    const rate = rentas.interestRate / 100;
    return Array.from({ length: rentas.projectionYears }, (_, i) => {
      const year = i + 1;
      const accumulated = rentas.monthlyIncome * 12 * ((Math.pow(1 + rate, year) - 1) / rate);
      return { year, value: Math.round(accumulated), label: `Año ${year}` };
    });
  }, [rentas]);

  const necesidadesData = useMemo((): ProjectionDataPoint[] => {
    const totalNeed =
      necesidades.educationCost +
      necesidades.debtBalance +
      necesidades.monthlyExpenses * 12 * necesidades.dependents;
    return Array.from({ length: 20 }, (_, i) => {
      const year = i + 1;
      const value = Math.round(totalNeed / (20 - i + 1));
      return { year, value, label: `Año ${year}` };
    });
  }, [necesidades]);

  const rentaMonthly = useMemo(() => {
    const last = rentasData[rentasData.length - 1];
    return last ? Math.round(last.value / (rentas.projectionYears * 12)) : 0;
  }, [rentasData, rentas.projectionYears]);

  const cuotaMensual = useMemo(() => {
    const totalNeed =
      necesidades.educationCost +
      necesidades.debtBalance +
      necesidades.monthlyExpenses * 12 * necesidades.dependents;
    return Math.round(totalNeed / (20 * 12));
  }, [necesidades]);

  return (
    <div className="space-y-4">
      <h2 className="text-h5 font-semibold text-gray-900">Ahorro y Proyección</h2>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
        {(['rentas', 'necesidades'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === tab
                ? 'bg-white text-[#005931] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'rentas' ? 'RENTAS' : 'NECESIDADES'}
          </button>
        ))}
      </div>

      {activeTab === 'rentas' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <NumberInput
              label="Ingreso mensual"
              value={rentas.monthlyIncome}
              onChange={(v) => setRentas((p) => ({ ...p, monthlyIncome: v }))}
            />
            <NumberInput
              label="Años de proyección"
              value={rentas.projectionYears}
              onChange={(v) => setRentas((p) => ({ ...p, projectionYears: v }))}
            />
            <NumberInput
              label="Tasa de interés (%)"
              value={rentas.interestRate}
              onChange={(v) => setRentas((p) => ({ ...p, interestRate: v }))}
            />
          </div>
          <div className="flex gap-4 text-sm">
            <div>
              <span className="text-gray-500">Acumulación futura: </span>
              <span className="font-semibold text-[#005931]">
                ${formatCurrency(rentasData[rentasData.length - 1]?.value ?? 0)}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Renta mensual: </span>
              <span className="font-semibold text-[#005931]">${formatCurrency(rentaMonthly)}</span>
            </div>
          </div>
          <ProjectionChart data={rentasData} type="rentas" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <NumberInput
              label="Costo educación"
              value={necesidades.educationCost}
              onChange={(v) => setNecesidades((p) => ({ ...p, educationCost: v }))}
            />
            <NumberInput
              label="Saldo deudas"
              value={necesidades.debtBalance}
              onChange={(v) => setNecesidades((p) => ({ ...p, debtBalance: v }))}
            />
            <NumberInput
              label="Gastos mensuales"
              value={necesidades.monthlyExpenses}
              onChange={(v) => setNecesidades((p) => ({ ...p, monthlyExpenses: v }))}
            />
            <NumberInput
              label="Dependientes"
              value={necesidades.dependents}
              onChange={(v) => setNecesidades((p) => ({ ...p, dependents: v }))}
            />
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Cuota mensual necesaria: </span>
            <span className="font-semibold text-[#005931]">${formatCurrency(cuotaMensual)}</span>
          </div>
          <ProjectionChart data={necesidadesData} type="necesidades" />
        </div>
      )}
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}): React.JSX.Element {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-[#005931] focus:outline-none focus:ring-1 focus:ring-[#005931]/15"
      />
    </div>
  );
}
