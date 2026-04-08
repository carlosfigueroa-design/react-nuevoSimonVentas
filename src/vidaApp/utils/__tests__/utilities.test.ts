/**
 * Tests unitarios para utilidades nuevas — Tarea 1.4
 * Ramo Vida Individual — Simón Ventas.
 */
import { describe, it, expect } from 'vitest';
import { generateQuoteNumber } from '../quoteNumberGenerator';
import { generateDeclaracionNumber } from '../declaracionNumberGenerator';
import { generatePolicyNumber } from '../policyNumberGenerator';
import { calculateExtraprima } from '../extraprimaCalculation';
import { parseCurrency, formatCurrencyInput } from '../formatters';
import { calculateAge, validateAge } from '../validation';

describe('generateQuoteNumber', () => {
  it('produce formato COT-XXXXXXXX (8 alfanuméricos)', () => {
    const result = generateQuoteNumber();
    expect(result).toMatch(/^COT-[A-Z0-9]{8}$/);
  });

  it('genera valores distintos en llamadas consecutivas', () => {
    const a = generateQuoteNumber();
    const b = generateQuoteNumber();
    // Probabilidad de colisión es ~1/2.8 trillones, prácticamente imposible
    expect(a).not.toBe(b);
  });
});

describe('generateDeclaracionNumber', () => {
  it('produce formato DEC-XXXXXX (6 alfanuméricos)', () => {
    const result = generateDeclaracionNumber();
    expect(result).toMatch(/^DEC-[A-Z0-9]{6}$/);
  });
});

describe('generatePolicyNumber', () => {
  it('produce exactamente 13 dígitos numéricos', () => {
    const result = generatePolicyNumber();
    expect(result).toMatch(/^\d{13}$/);
  });
});

describe('calculateExtraprima', () => {
  it('retorna 15% de recargo cuando hay respuestas críticas afirmativas', () => {
    const result = calculateExtraprima(100000, [false, true, false]);
    expect(result).toBe(15000);
  });

  it('retorna 0 cuando no hay respuestas críticas afirmativas', () => {
    const result = calculateExtraprima(100000, [false, false, false]);
    expect(result).toBe(0);
  });

  it('retorna 0 cuando el array de respuestas está vacío', () => {
    const result = calculateExtraprima(100000, []);
    expect(result).toBe(0);
  });

  it('retorna 15% cuando todas las respuestas son afirmativas', () => {
    const result = calculateExtraprima(200000, [true, true, true]);
    expect(result).toBe(30000);
  });
});

describe('parseCurrency / formatCurrencyInput (ida y vuelta)', () => {
  it('parseCurrency(formatCurrencyInput(n)) === n para enteros positivos', () => {
    const values = [0, 1, 100, 1234, 1234567, 50000000];
    for (const n of values) {
      if (n > 0) {
        expect(parseCurrency(formatCurrencyInput(n))).toBe(n);
      }
    }
  });

  it('formatCurrencyInput formatea con separadores de punto', () => {
    expect(formatCurrencyInput(1234567)).toBe('1.234.567');
    expect(formatCurrencyInput(100)).toBe('100');
    expect(formatCurrencyInput(1000)).toBe('1.000');
  });

  it('parseCurrency maneja cadenas con símbolo $', () => {
    expect(parseCurrency('$1.234.567')).toBe(1234567);
  });
});

describe('calculateAge', () => {
  it('retorna edad correcta para fecha YYYY-MM-DD', () => {
    const year = new Date().getFullYear() - 30;
    const age = calculateAge(`${year}-01-01`);
    expect(age).toBeGreaterThanOrEqual(29);
    expect(age).toBeLessThanOrEqual(30);
  });

  it('retorna -1 para fecha inválida', () => {
    expect(calculateAge('')).toBe(-1);
    expect(calculateAge('invalid')).toBe(-1);
  });

  it('soporta formato DD/MM/YYYY', () => {
    const year = new Date().getFullYear() - 25;
    const age = calculateAge(`01/06/${year}`);
    expect(age).toBeGreaterThanOrEqual(24);
    expect(age).toBeLessThanOrEqual(25);
  });
});

describe('validateAge', () => {
  it('valida rango 18-70: edad válida', () => {
    const year = new Date().getFullYear() - 30;
    const result = validateAge(`${year}-06-15`);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rechaza menor de 18 años', () => {
    const year = new Date().getFullYear() - 10;
    const result = validateAge(`${year}-06-15`);
    expect(result.isValid).toBe(false);
    expect(result.errors[0].message).toContain('mayor de 18');
  });

  it('rechaza mayor de 70 años', () => {
    const year = new Date().getFullYear() - 80;
    const result = validateAge(`${year}-06-15`);
    expect(result.isValid).toBe(false);
    expect(result.errors[0].message).toContain('mayor de 70');
  });

  it('rechaza fecha inválida', () => {
    const result = validateAge('not-a-date');
    expect(result.isValid).toBe(false);
  });
});
