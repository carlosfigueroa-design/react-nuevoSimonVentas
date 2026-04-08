/**
 * Tipos de dominio para el wizard de cotización.
 * Discriminated unions para acciones y estado tipado.
 * Ramo Vida Individual — Simón Ventas.
 */

import type { DatosRiesgoState } from './persona.types';
import type { CoberturasState } from './cobertura.types';
import type { DeclaracionState } from './salud.types';
import type { ResumenState } from './cotizacion.types';

/** Pasos del wizard */
export type WizardStep = 1 | 2 | 3 | 4;

/** Constante con los pasos disponibles */
export const WIZARD_STEPS: readonly WizardStep[] = [1, 2, 3, 4] as const;

/** Etiquetas de cada paso del wizard */
export const STEP_LABELS: Record<WizardStep, string> = {
  1: 'Datos del Riesgo',
  2: 'Coberturas',
  3: 'Declaración de Asegurabilidad',
  4: 'Resumen de Cotización',
} as const;

/** Unión discriminada de acciones del wizard */
export type WizardAction =
  | { type: 'SET_STEP_DATA'; step: WizardStep; data: Partial<WizardStepData> }
  | { type: 'GO_TO_STEP'; step: WizardStep }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'RESET_WIZARD' }
  | { type: 'SET_VALIDATION_ERRORS'; errors: Record<string, string> }
  | { type: 'SKIP_TO_STEP'; step: WizardStep };

/** Datos de cada paso del wizard indexados por paso */
export interface WizardStepData {
  datosRiesgo: DatosRiesgoState;
  coberturas: CoberturasState;
  declaracion: DeclaracionState;
  resumen: ResumenState;
}

/** Estado completo del wizard */
export interface WizardState {
  currentStep: WizardStep;
  stepData: WizardStepData;
  validationErrors: Record<string, string>;
  isCompleted: boolean;
}
