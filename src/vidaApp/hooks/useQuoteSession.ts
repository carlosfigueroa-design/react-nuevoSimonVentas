/**
 * Hook para gestión de sesión de cotización.
 * Genera número de cotización, registra fecha y gestiona clave de asesor.
 * Ramo Vida Individual — Simón Ventas.
 */

import { useState, useMemo } from 'react';
import { generateQuoteNumber } from '../utils';

/** Tipo de retorno del hook useQuoteSession */
export interface UseQuoteSessionReturn {
  /** Número de cotización generado (COT-XXXXXXXX) */
  quoteNumber: string;
  /** Fecha de la cotización (ISO string) */
  quoteDate: string;
  /** Clave de asesor ingresada */
  advisorKey: string;
  /** Setter para la clave de asesor */
  setAdvisorKey: (key: string) => void;
  /** Indica si la clave de asesor es válida (no vacía) */
  isAdvisorValid: boolean;
}

/**
 * Gestiona la sesión de cotización: número único, fecha y clave de asesor.
 * El número de cotización se genera una sola vez al montar el hook.
 */
export function useQuoteSession(): UseQuoteSessionReturn {
  const [quoteNumber] = useState<string>(() => generateQuoteNumber());
  const [quoteDate] = useState<string>(() => new Date().toISOString());
  const [advisorKey, setAdvisorKey] = useState<string>('');

  const isAdvisorValid = useMemo(
    () => advisorKey.trim().length > 0,
    [advisorKey],
  );

  return {
    quoteNumber,
    quoteDate,
    advisorKey,
    setAdvisorKey,
    isAdvisorValid,
  };
}
