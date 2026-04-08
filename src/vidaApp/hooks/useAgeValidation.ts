/**
 * Hook para validación de edad del asegurado.
 * Calcula edad desde fecha de nacimiento y valida rango 18-70.
 * Ramo Vida Individual — Simón Ventas.
 */

import { useMemo } from 'react';
import { calculateAge } from '../utils';
import { VALIDATION_MESSAGES } from '../constants';

/** Tipo de retorno del hook useAgeValidation */
export interface UseAgeValidationReturn {
  /** Edad calculada en años (-1 si la fecha es inválida) */
  age: number;
  /** Indica si la edad está en el rango válido (18-70) */
  isValid: boolean;
  /** Mensaje de error si la edad es inválida, null si es válida */
  errorMessage: string | null;
}

/**
 * Calcula la edad a partir de la fecha de nacimiento y valida el rango 18-70.
 *
 * @param dateOfBirth - Fecha de nacimiento (YYYY-MM-DD o DD/MM/YYYY)
 */
export function useAgeValidation(dateOfBirth: string): UseAgeValidationReturn {
  return useMemo(() => {
    if (!dateOfBirth.trim()) {
      return { age: -1, isValid: false, errorMessage: null };
    }

    const age = calculateAge(dateOfBirth);

    if (age < 0) {
      return {
        age,
        isValid: false,
        errorMessage: VALIDATION_MESSAGES.dateOfBirth,
      };
    }

    if (age < 18) {
      return {
        age,
        isValid: false,
        errorMessage: VALIDATION_MESSAGES.minAge,
      };
    }

    if (age > 70) {
      return {
        age,
        isValid: false,
        errorMessage: VALIDATION_MESSAGES.maxAge,
      };
    }

    return { age, isValid: true, errorMessage: null };
  }, [dateOfBirth]);
}
