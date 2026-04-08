/**
 * Utilidad de cálculo de IMC (Índice de Masa Corporal).
 * Ramo Vida Individual — Simón Ventas.
 *
 * Función pura: mismos inputs → mismos outputs.
 */

import type { BMIResult, BMIClassification } from '../types';

/**
 * Clasifica un valor de IMC según los rangos de la OMS.
 *  - < 18.5  → underweight
 *  - 18.5–24.9 → normal
 *  - 25–29.9 → overweight
 *  - ≥ 30    → obese
 */
function classifyBMI(bmi: number): BMIClassification {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
}

/**
 * Calcula el IMC a partir de peso (kg) y estatura (cm).
 *
 * @param weightKg  Peso en kilogramos (debe ser > 0)
 * @param heightCm  Estatura en centímetros (debe ser > 0)
 * @returns BMIResult con valor e clasificación, o null si los inputs son inválidos.
 */
export function calculateBMI(
  weightKg: number,
  heightCm: number,
): BMIResult | null {
  if (weightKg <= 0 || heightCm <= 0) return null;

  const heightM = heightCm / 100;
  const value = weightKg / (heightM * heightM);

  return {
    value: Math.round(value * 100) / 100,
    classification: classifyBMI(value),
  };
}
