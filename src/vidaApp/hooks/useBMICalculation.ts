/**
 * Hook para cálculo reactivo de IMC.
 * Ramo Vida Individual — Simón Ventas.
 */

import { useMemo } from 'react';
import { calculateBMI } from '../utils';
import type { BMIResult } from '../types';

/**
 * Envuelve calculateBMI en un hook memoizado.
 *
 * @param weightKg - Peso en kilogramos
 * @param heightCm - Estatura en centímetros
 * @returns BMIResult con valor y clasificación, o null si los inputs son inválidos
 */
export function useBMICalculation(
  weightKg: number,
  heightCm: number,
): BMIResult | null {
  return useMemo(
    () => calculateBMI(weightKg, heightCm),
    [weightKg, heightCm],
  );
}
