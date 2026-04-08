/**
 * Tipos de dominio para cotización, resumen y servicios de emisión.
 * Ramo Vida Individual — Simón Ventas.
 */

import type { PrimaBreakdown } from './cobertura.types';

/** Datos de sesión de la cotización */
export interface QuoteSessionData {
  quoteNumber: string;
  quoteDate: string;
  advisorKey: string;
  declaracionNumber: string;
}

/** Resumen consolidado de la cotización */
export interface QuoteSummary {
  quoteNumber: string;
  date: string;
  advisorKey: string;
  planName: string;
  insuredValue: number;
  riskDetail: string;
  coverageBreakdown: PrimaBreakdown[];
  totalPrima: number;
}

/** Solicitud de cotización al backend */
export interface QuoteRequest {
  tomadorId: string;
  aseguradoId: string;
  coverageIds: string[];
  insuredValue: number;
  periodicidad: string;
}

/** Respuesta de cotización del backend */
export interface QuoteResponse {
  success: boolean;
  quoteNumber: string;
  message: string;
  summary: QuoteSummary;
}

/** Estado del paso 4: Resumen de Cotización */
export interface ResumenState {
  summary: QuoteSummary | null;
  isSubmitting: boolean;
  isIssued: boolean;
  policyNumber: string;
  isProvisoria: boolean;
}
