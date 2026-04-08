/**
 * Funciones puras de validación para formularios.
 * Ramo Vida Individual — Simón Ventas.
 */

import { VALIDATION_PATTERNS, VALIDATION_MESSAGES } from '../constants/validation';
import type { ValidationResult } from '../types';

/**
 * Valida formato de correo electrónico.
 * Retorna resultado con error si el formato es inválido o el campo está vacío.
 */
export function validateEmail(email: string): ValidationResult {
  if (!email.trim()) {
    return {
      isValid: false,
      errors: [{ field: 'email', message: VALIDATION_MESSAGES.required }],
    };
  }

  if (!VALIDATION_PATTERNS.email.test(email.trim())) {
    return {
      isValid: false,
      errors: [{ field: 'email', message: VALIDATION_MESSAGES.email }],
    };
  }

  return { isValid: true, errors: [] };
}

/**
 * Valida formato de número de teléfono colombiano.
 * Acepta 7-10 dígitos con prefijo +57 opcional.
 */
export function validatePhone(phone: string): ValidationResult {
  if (!phone.trim()) {
    return {
      isValid: false,
      errors: [{ field: 'phone', message: VALIDATION_MESSAGES.required }],
    };
  }

  if (!VALIDATION_PATTERNS.phone.test(phone.trim())) {
    return {
      isValid: false,
      errors: [{ field: 'phone', message: VALIDATION_MESSAGES.phone }],
    };
  }

  return { isValid: true, errors: [] };
}

/**
 * Valida formato de número de documento (cédula, NIT, etc.).
 * Acepta entre 5 y 15 dígitos numéricos.
 */
export function validateDocument(doc: string): ValidationResult {
  if (!doc.trim()) {
    return {
      isValid: false,
      errors: [{ field: 'document', message: VALIDATION_MESSAGES.required }],
    };
  }

  if (!VALIDATION_PATTERNS.documentNumber.test(doc.trim())) {
    return {
      isValid: false,
      errors: [{ field: 'document', message: VALIDATION_MESSAGES.documentNumber }],
    };
  }

  return { isValid: true, errors: [] };
}

/**
 * Valida que todos los campos requeridos tengan valor no vacío.
 * Retorna un error por cada campo vacío encontrado.
 */
export function validateRequiredFields(
  fields: Record<string, string>,
): ValidationResult {
  const errors = Object.entries(fields)
    .filter(([, value]) => !value.trim())
    .map(([field]) => ({ field, message: VALIDATION_MESSAGES.required }));

  return { isValid: errors.length === 0, errors };
}

/**
 * Calcula la edad a partir de una fecha de nacimiento (formato YYYY-MM-DD o DD/MM/YYYY).
 * @param dateOfBirth - Fecha de nacimiento como string
 * @returns Edad en años (entero), o -1 si la fecha es inválida
 */
export function calculateAge(dateOfBirth: string): number {
  if (!dateOfBirth.trim()) return -1;

  let date: Date;
  // Soportar formato DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateOfBirth)) {
    const [day, month, year] = dateOfBirth.split('/').map(Number);
    date = new Date(year, month - 1, day);
  } else {
    date = new Date(dateOfBirth);
  }

  if (isNaN(date.getTime())) return -1;

  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age--;
  }
  return age;
}

/**
 * Valida que la edad del asegurado esté en el rango 18-70 años.
 * @param dateOfBirth - Fecha de nacimiento como string
 * @returns ValidationResult con errores si la edad está fuera de rango
 */
export function validateAge(dateOfBirth: string): ValidationResult {
  const age = calculateAge(dateOfBirth);

  if (age < 0) {
    return {
      isValid: false,
      errors: [{ field: 'dateOfBirth', message: VALIDATION_MESSAGES.dateOfBirth }],
    };
  }

  if (age < 18) {
    return {
      isValid: false,
      errors: [{ field: 'dateOfBirth', message: VALIDATION_MESSAGES.minAge }],
    };
  }

  if (age > 70) {
    return {
      isValid: false,
      errors: [{ field: 'dateOfBirth', message: VALIDATION_MESSAGES.maxAge }],
    };
  }

  return { isValid: true, errors: [] };
}
