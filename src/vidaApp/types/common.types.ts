/**
 * Tipos utilitarios compartidos entre módulos.
 * Ramo Vida Individual — Simón Ventas.
 */

/** Opción genérica para selects y dropdowns */
export interface Option {
  value: string;
  label: string;
}

/** Resultado genérico de operaciones de servicio */
export interface ServiceResult<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

/** Error de validación individual */
export interface ValidationError {
  field: string;
  message: string;
}

/** Resultado de validación de un formulario o paso */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
