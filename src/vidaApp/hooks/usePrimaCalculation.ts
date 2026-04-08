/**
 * Hook para cálculo reactivo de prima.
 * Ramo Vida Individual — Simón Ventas.
 */

import { useMemo } from 'react';
import { calculateTotalPrima } from '../utils';
import { COVERAGE_CONFIGS } from '../constants';
import type { CoverageSelection, CoverageConfig, PrimaBreakdown, Periodicidad } from '../types';

/** Mapa de meses por periodicidad */
const PERIODICIDAD_MESES: Record<Periodicidad, number> = {
  mensual: 1,
  trimestral: 3,
  semestral: 6,
  anual: 12,
};

/** Tipo de retorno del hook usePrimaCalculation */
export interface UsePrimaCalculationReturn {
  breakdown: PrimaBreakdown[];
  total: number;
  isCalculating: boolean;
}

/**
 * Envuelve calculateTotalPrima en un hook memoizado.
 * Integra extraprima (15% recargo) y ajuste por periodicidad.
 *
 * @param selections       - Selecciones de cobertura del usuario
 * @param configs          - Configuraciones de coberturas (por defecto COVERAGE_CONFIGS)
 * @param extraprimaActive - Si la extraprima está activa (15% recargo)
 * @param periodicidad     - Periodicidad de pago (mensual, trimestral, semestral, anual)
 * @returns Desglose de prima, total y estado de cálculo
 */
export function usePrimaCalculation(
  selections: CoverageSelection[],
  configs: CoverageConfig[] = COVERAGE_CONFIGS,
  extraprimaActive: boolean = false,
  periodicidad: Periodicidad = 'mensual',
): UsePrimaCalculationReturn {
  const result = useMemo(() => {
    const base = calculateTotalPrima(selections, configs);

    const extraprimaSurcharge = extraprimaActive
      ? Math.round(base.total * 0.15 * 100) / 100
      : 0;

    const monthlyTotal = base.total + extraprimaSurcharge;

    const meses = PERIODICIDAD_MESES[periodicidad];
    const adjustedTotal = Math.round(monthlyTotal * meses * 100) / 100;

    const adjustedBreakdown = base.breakdown.map((item) => ({
      ...item,
      total: Math.round(item.total * meses * 100) / 100,
      basePremium: Math.round(item.basePremium * meses * 100) / 100,
      tax: Math.round(item.tax * meses * 100) / 100,
    }));

    return {
      breakdown: adjustedBreakdown,
      total: adjustedTotal,
    };
  }, [selections, configs, extraprimaActive, periodicidad]);

  return {
    breakdown: result.breakdown,
    total: result.total,
    isCalculating: false,
  };
}
