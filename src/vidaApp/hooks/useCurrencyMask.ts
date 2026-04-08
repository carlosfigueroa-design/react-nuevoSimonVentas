/**
 * Hook para máscara de moneda colombiana en tiempo real.
 * Aplica separadores de punto al valor ingresado.
 * Ramo Vida Individual — Simón Ventas.
 */

import { useState, useCallback } from 'react';
import { formatCurrencyInput, parseCurrency } from '../utils';

/** Tipo de retorno del hook useCurrencyMask */
export interface UseCurrencyMaskReturn {
  /** Valor formateado con separadores de punto (e.g. "1.234.567") */
  displayValue: string;
  /** Valor numérico sin formato */
  rawValue: number;
  /** Handler para cambios en el input */
  handleChange: (inputValue: string) => void;
}

/**
 * Aplica máscara de moneda colombiana en tiempo real.
 * Usa formatCurrencyInput y parseCurrency de utils/formatters.ts.
 *
 * @param initialValue - Valor numérico inicial (por defecto 0)
 */
export function useCurrencyMask(initialValue: number = 0): UseCurrencyMaskReturn {
  const [rawValue, setRawValue] = useState<number>(initialValue);
  const [displayValue, setDisplayValue] = useState<string>(
    () => (initialValue > 0 ? formatCurrencyInput(initialValue) : '0'),
  );

  const handleChange = useCallback((inputValue: string): void => {
    const numeric = parseCurrency(inputValue);
    setRawValue(numeric);
    setDisplayValue(formatCurrencyInput(numeric));
  }, []);

  return { displayValue, rawValue, handleChange };
}
