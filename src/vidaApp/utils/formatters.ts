/**
 * Utilidades de formateo — Ramo Vida Individual, Simón Ventas.
 * Todas las funciones son puras (sin efectos secundarios).
 */

/**
 * Formatea un número como pesos colombianos (COP).
 * Ejemplo: 1234567 → "$1.234.567"
 */
export function formatCurrency(amount: number): string {
  const rounded = Math.round(amount);
  const abs = Math.abs(rounded);
  const formatted = abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const sign = rounded < 0 ? '-' : '';
  return `${sign}$${formatted}`;
}

/**
 * Formatea una fecha como DD/MM/YYYY.
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Formatea un número de documento con separadores de punto.
 * Ejemplo: "1234567890" → "1.234.567.890"
 */
export function formatDocumentNumber(doc: string): string {
  const digits = doc.replace(/\D/g, '');
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Parsea una cadena de moneda formateada y devuelve el número.
 * Ejemplo: "$1.234.567" → 1234567
 */
export function parseCurrency(formatted: string): number {
  const cleaned = formatted.replace(/[$.]/g, '').trim();
  const value = Number(cleaned);
  return isNaN(value) ? 0 : value;
}

/**
 * Formatea un número como entrada de moneda colombiana (sin símbolo $).
 * Ejemplo: 1234567 → "1.234.567"
 *
 * Diseñado para uso en campos de input con máscara de moneda.
 * Propiedad ida y vuelta: parseCurrency(formatCurrencyInput(n)) === n para enteros positivos.
 */
export function formatCurrencyInput(n: number): string {
  if (n <= 0) return '0';
  const rounded = Math.round(n);
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
