/**
 * Generador de número de declaración — Ramo Vida Individual, Simón Ventas.
 * Formato: DEC-XXXXXX (6 caracteres alfanuméricos en mayúsculas).
 */

const ALPHANUMERIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/**
 * Genera un número de declaración único con formato DEC-XXXXXX.
 * @returns Número de declaración (e.g. "DEC-K3F7B2")
 */
export function generateDeclaracionNumber(): string {
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += ALPHANUMERIC.charAt(Math.floor(Math.random() * ALPHANUMERIC.length));
  }
  return `DEC-${code}`;
}
