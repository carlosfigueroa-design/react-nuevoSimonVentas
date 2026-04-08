/**
 * Generador de número de cotización — Ramo Vida Individual, Simón Ventas.
 * Formato: COT-XXXXXXXX (8 caracteres alfanuméricos en mayúsculas).
 */

const ALPHANUMERIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/**
 * Genera un número de cotización único con formato COT-XXXXXXXX.
 * @returns Número de cotización (e.g. "COT-A3F7K9B2")
 */
export function generateQuoteNumber(): string {
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += ALPHANUMERIC.charAt(Math.floor(Math.random() * ALPHANUMERIC.length));
  }
  return `COT-${code}`;
}
