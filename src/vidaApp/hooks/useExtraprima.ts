/**
 * Hook para cálculo de extraprima por condiciones de salud.
 * Recargo del 15% sobre la prima base cuando hay respuestas críticas afirmativas.
 * Ramo Vida Individual — Simón Ventas.
 */

import { useMemo, useCallback } from 'react';
import { CRITICAL_HEALTH_QUESTIONS } from '../constants';

/** Porcentaje de recargo por extraprima */
const EXTRAPRIMA_PERCENTAGE = 15;
const EXTRAPRIMA_RATE = EXTRAPRIMA_PERCENTAGE / 100;

/** Tipo de retorno del hook useExtraprima */
export interface UseExtraprimaReturn {
  /** Indica si la extraprima está activa */
  isActive: boolean;
  /** Porcentaje de recargo (15) */
  percentage: number;
  /** Calcula el monto de recargo sobre una prima base */
  calculateSurcharge: (primaBase: number) => number;
}

/**
 * Calcula si aplica extraprima basado en respuestas críticas de salud.
 *
 * @param answers - Respuestas del cuestionario de salud
 * @param criticalQuestions - IDs de preguntas críticas (por defecto CRITICAL_HEALTH_QUESTIONS)
 */
export function useExtraprima(
  answers: Record<string, boolean | string | number>,
  criticalQuestions: string[] = CRITICAL_HEALTH_QUESTIONS,
): UseExtraprimaReturn {
  const isActive = useMemo(() => {
    return criticalQuestions.some((questionId) => answers[questionId] === true);
  }, [answers, criticalQuestions]);

  const calculateSurcharge = useCallback(
    (primaBase: number): number => {
      if (!isActive) return 0;
      return Math.round(primaBase * EXTRAPRIMA_RATE * 100) / 100;
    },
    [isActive],
  );

  return {
    isActive,
    percentage: EXTRAPRIMA_PERCENTAGE,
    calculateSurcharge,
  };
}
