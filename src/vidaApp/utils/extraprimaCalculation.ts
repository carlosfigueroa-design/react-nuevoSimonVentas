/**
 * Cálculo de extraprima — Ramo Vida Individual, Simón Ventas.
 * Función pura: recargo del 15% sobre la prima base cuando hay respuestas críticas afirmativas.
 */

/** Porcentaje de recargo por extraprima */
const EXTRAPRIMA_RATE = 0.15;

/**
 * Calcula el monto de extraprima basado en respuestas críticas de salud.
 *
 * @param primaBase - Prima base mensual antes de recargo
 * @param criticalAnswers - Respuestas a preguntas críticas (true = SÍ afirmativo)
 * @returns Monto de extraprima (0 si no hay respuestas críticas afirmativas)
 */
export function calculateExtraprima(
  primaBase: number,
  criticalAnswers: boolean[],
): number {
  const hasCritical = criticalAnswers.some((answer) => answer === true);
  if (!hasCritical) return 0;
  return Math.round(primaBase * EXTRAPRIMA_RATE * 100) / 100;
}
