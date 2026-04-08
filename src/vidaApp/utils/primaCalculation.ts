/**
 * Utilidades puras para cálculo de prima.
 * Ramo Vida Individual — Simón Ventas.
 *
 * Prima = insuredValue × baseRate por cada cobertura seleccionada.
 * Tasa de impuesto: 0 (placeholder — vendrá del motor de suscripción).
 */

import type { CoverageSelection, CoverageConfig, PrimaBreakdown } from '../types';
import { COVERAGE_CONFIGS } from '../constants/coverages';

/** Tasa de impuesto placeholder (0% hasta integración con motor de suscripción) */
const TAX_RATE = 0;

/**
 * Calcula el desglose de prima para una sola cobertura.
 *
 * @param selection - Selección del usuario (coverageId, selected, insuredValue)
 * @param config    - Configuración de la cobertura (baseRate, name, etc.)
 * @returns Desglose con prima base, impuesto y total
 */
export function calculatePrimaForCoverage(
  selection: CoverageSelection,
  config: CoverageConfig,
): PrimaBreakdown {
  const basePremium = selection.selected
    ? selection.insuredValue * config.baseRate
    : 0;

  const tax = basePremium * TAX_RATE;

  return {
    coverageId: config.id,
    coverageName: config.name,
    basePremium,
    tax,
    total: basePremium + tax,
  };
}

/**
 * Calcula la prima total para todas las coberturas seleccionadas.
 *
 * Busca cada configuración en COVERAGE_CONFIGS por coverageId.
 * Si una selección no tiene configuración correspondiente, se omite.
 *
 * @param selections - Lista de selecciones del usuario
 * @param configs    - Lista de configuraciones de coberturas (por defecto COVERAGE_CONFIGS)
 * @returns Desglose por cobertura y total general
 */
export function calculateTotalPrima(
  selections: CoverageSelection[],
  configs: CoverageConfig[] = COVERAGE_CONFIGS,
): { breakdown: PrimaBreakdown[]; total: number } {
  const configMap = new Map(configs.map((c) => [c.id, c]));

  const breakdown: PrimaBreakdown[] = [];

  for (const selection of selections) {
    const config = configMap.get(selection.coverageId);
    if (config) {
      breakdown.push(calculatePrimaForCoverage(selection, config));
    }
  }

  const total = breakdown.reduce((sum, b) => sum + b.total, 0);

  return { breakdown, total };
}
