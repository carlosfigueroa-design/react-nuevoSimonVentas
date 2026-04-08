/**
 * Servicio stub para generación de PDF de cotización.
 * Ramo Vida Individual — Simón Ventas.
 */

import type { ServiceResult } from '../types';

/**
 * Genera un PDF de la cotización.
 * Stub: retorna un Blob mock con contenido placeholder.
 */
export async function generateQuotePDF(
  quoteNumber: string,
): Promise<ServiceResult<Blob>> {
  await new Promise((r) => setTimeout(r, 600));

  const content = `Cotización ${quoteNumber} — Vida Individual — Simón Ventas\nDocumento generado como placeholder.`;
  const blob = new Blob([content], { type: 'application/pdf' });

  console.info(`[pdfService] PDF generado para ${quoteNumber}`);

  return {
    success: true,
    data: blob,
    error: null,
  };
}
