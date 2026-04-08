/**
 * Tipos de dominio para declaración de asegurabilidad y salud.
 * Ramo Vida Individual — Simón Ventas.
 */

/** Categoría de preguntas de salud (secciones del acordeón) */
export interface HealthCategory {
  id: string;
  name: string;
  questions: HealthQuestion[];
}

/** Pregunta individual del cuestionario de salud */
export interface HealthQuestion {
  id: string;
  categoryId: string;
  text: string;
  type: 'boolean' | 'text' | 'number';
  required: boolean;
}

/** Clasificación del IMC */
export type BMIClassification = 'underweight' | 'normal' | 'overweight' | 'obese';

/** Resultado del cálculo de IMC */
export interface BMIResult {
  value: number;
  classification: BMIClassification;
}

/** Estado del paso 3: Declaración de Asegurabilidad */
export interface DeclaracionState {
  answers: Record<string, string | boolean | number>;
  weight: number;
  height: number;
  bmiResult: BMIResult | null;
  isConfirmed: boolean;
  extraprima: number;
  extraprimaActive: boolean;
}
