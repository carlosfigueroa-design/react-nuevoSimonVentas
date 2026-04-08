/**
 * Generador de número de póliza — Ramo Vida Individual, Simón Ventas.
 * Formato: 13 dígitos numéricos.
 */

/**
 * Genera un número de póliza de 13 dígitos.
 * @returns Número de póliza (e.g. "1234567890123")
 */
export function generatePolicyNumber(): string {
  let number = '';
  for (let i = 0; i < 13; i++) {
    number += Math.floor(Math.random() * 10).toString();
  }
  return number;
}
