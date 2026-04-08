/**
 * Servicio stub para cotización y emisión de pólizas.
 * Ramo Vida Individual — Simón Ventas.
 */

import type { ServiceResult, QuoteRequest, QuoteResponse } from '../types';

/**
 * Envía una solicitud de cotización al backend.
 * Stub: retorna datos mock listos para integración futura.
 */
export async function submitQuote(
  request: QuoteRequest,
): Promise<ServiceResult<QuoteResponse>> {
  // Simular latencia de red
  await new Promise((r) => setTimeout(r, 800));

  const quoteNumber = `COT-${Date.now().toString(36).toUpperCase()}`;

  return {
    success: true,
    data: {
      success: true,
      quoteNumber,
      message: 'Cotización generada exitosamente',
      summary: {
        quoteNumber,
        date: new Date().toISOString(),
        advisorKey: 'ADV-001',
        planName: 'Vida Individual',
        insuredValue: request.insuredValue,
        riskDetail: `Tomador: ${request.tomadorId} | Asegurado: ${request.aseguradoId}`,
        coverageBreakdown: [],
        totalPrima: 0,
      },
    },
    error: null,
  };
}

/**
 * Inicia el proceso de emisión de póliza.
 * Stub: retorna éxito simulado.
 */
export async function initiateIssuance(
  quoteNumber: string,
): Promise<ServiceResult<void>> {
  await new Promise((r) => setTimeout(r, 1000));

  console.info(`[quoteService] Emisión iniciada para ${quoteNumber}`);

  return {
    success: true,
    data: undefined as unknown as void,
    error: null,
  };
}
