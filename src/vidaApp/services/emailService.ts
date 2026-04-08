/**
 * Servicio stub para envío de cotización por email.
 * Ramo Vida Individual — Simón Ventas.
 */

import type { ServiceResult } from '../types';

/**
 * Envía la cotización por correo electrónico.
 * Stub: retorna éxito simulado, listo para integración SMTP/API.
 */
export async function sendQuoteEmail(
  quoteNumber: string,
  email: string,
): Promise<ServiceResult<void>> {
  await new Promise((r) => setTimeout(r, 500));

  console.info(`[emailService] Email enviado a ${email} para cotización ${quoteNumber}`);

  return {
    success: true,
    data: undefined as unknown as void,
    error: null,
  };
}
