/**
 * Patrones de validación y mensajes de error en español.
 * Ramo Vida Individual — Simón Ventas.
 */

/** Patrones regex para validación de campos */
export const VALIDATION_PATTERNS = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^(\+57)?[0-9]{7,10}$/,
  documentNumber: /^[0-9]{5,15}$/,
} as const;

/** Mensajes de error de validación en español */
export const VALIDATION_MESSAGES = {
  required: 'Este campo es obligatorio',
  email: 'Ingrese un correo electrónico válido',
  phone: 'Ingrese un número de teléfono válido (7-10 dígitos)',
  documentNumber: 'Ingrese un número de documento válido (5-15 dígitos)',
  dateOfBirth: 'Ingrese una fecha de nacimiento válida',
  minAge: 'El asegurado debe ser mayor de 18 años',
  maxAge: 'El asegurado no puede ser mayor de 70 años',
  insuredValue: 'El valor asegurado debe ser mayor a cero',
  selectionRequired: 'Debe seleccionar al menos una cobertura',
} as const;

/** Tiempo de debounce para validación en tiempo real (ms) */
export const VALIDATION_DEBOUNCE_MS = 300;
