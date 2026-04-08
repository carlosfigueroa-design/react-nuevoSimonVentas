/**
 * Wizard reducer y factory de estado inicial.
 * Función pura que gestiona todas las transiciones de estado del wizard.
 * Ramo Vida Individual — Simón Ventas.
 */

import type { WizardState, WizardAction, WizardStep } from '../types';
import {
  INITIAL_DATOS_RIESGO,
  INITIAL_COBERTURAS,
  INITIAL_DECLARACION,
  INITIAL_RESUMEN,
} from '../constants/wizard';

/** Primer y último paso del wizard */
const MIN_STEP: WizardStep = 1;
const MAX_STEP: WizardStep = 4;

/** Construye el estado inicial completo del wizard */
export function createInitialWizardState(): WizardState {
  return {
    currentStep: 1,
    stepData: {
      datosRiesgo: { ...INITIAL_DATOS_RIESGO },
      coberturas: { ...INITIAL_COBERTURAS },
      declaracion: { ...INITIAL_DECLARACION },
      resumen: { ...INITIAL_RESUMEN },
    },
    validationErrors: {},
    isCompleted: false,
  };
}

/** Mapea un WizardStep numérico a la clave correspondiente en stepData */
function stepDataKey(step: WizardStep): keyof WizardState['stepData'] {
  const map: Record<WizardStep, keyof WizardState['stepData']> = {
    1: 'datosRiesgo',
    2: 'coberturas',
    3: 'declaracion',
    4: 'resumen',
  };
  return map[step];
}

/**
 * Reducer puro del wizard.
 * Maneja todas las acciones definidas en WizardAction.
 */
export function wizardReducer(
  state: WizardState,
  action: WizardAction,
): WizardState {
  switch (action.type) {
    case 'SET_STEP_DATA': {
      const key = stepDataKey(action.step);
      const currentStepData = state.stepData[key];
      const incomingData = action.data[key] ?? action.data;
      return {
        ...state,
        stepData: {
          ...state.stepData,
          [key]: { ...currentStepData, ...incomingData },
        },
      };
    }

    case 'GO_TO_STEP':
      return {
        ...state,
        currentStep: action.step,
        validationErrors: {},
      };

    case 'NEXT_STEP': {
      if (state.currentStep >= MAX_STEP) return state;
      return {
        ...state,
        currentStep: (state.currentStep + 1) as WizardStep,
        validationErrors: {},
      };
    }

    case 'PREV_STEP': {
      if (state.currentStep <= MIN_STEP) return state;
      return {
        ...state,
        currentStep: (state.currentStep - 1) as WizardStep,
        validationErrors: {},
      };
    }

    case 'RESET_WIZARD':
      return createInitialWizardState();

    case 'SET_VALIDATION_ERRORS':
      return {
        ...state,
        validationErrors: action.errors,
      };

    case 'SKIP_TO_STEP':
      return {
        ...state,
        currentStep: action.step,
        validationErrors: {},
      };

    default:
      return state;
  }
}
