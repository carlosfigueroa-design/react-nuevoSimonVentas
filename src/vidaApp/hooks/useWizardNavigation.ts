/**
 * Hook de navegación del wizard.
 * Expone funciones de navegación y estado derivado del paso actual.
 * Ramo Vida Individual — Simón Ventas.
 */

import { useCallback } from 'react';
import type { WizardStep } from '../types';
import { WIZARD_STEPS } from '../types/wizard.types';
import { useWizard } from './WizardContext';
import { useValidation } from './useValidation';

/** Tipo de retorno del hook useWizardNavigation */
export interface UseWizardNavigationReturn {
  /** Paso actual del wizard */
  currentStep: WizardStep;
  /** Índice base-0 del paso actual */
  currentStepIndex: number;
  /** Número total de pasos */
  totalSteps: number;
  /** Indica si se puede retroceder (false en Step 1) */
  canGoBack: boolean;
  /** Indica si se puede avanzar (false en el último paso) */
  canGoForward: boolean;
  /** Verifica si un paso específico ha sido completado */
  isStepCompleted: (step: WizardStep) => boolean;
  /** Avanza al siguiente paso tras validar el paso actual. Retorna true si avanzó. */
  goToNextStep: () => boolean;
  /** Retrocede al paso anterior. No-op en Step 1. */
  goToPreviousStep: () => void;
  /** Navega a un paso específico. */
  goToStep: (step: WizardStep) => void;
  /** Salta directamente a un paso (navegación dual, e.g. Paso 2 → Paso 4). */
  skipToStep: (step: WizardStep) => void;
}

/**
 * Hook que encapsula la lógica de navegación del wizard.
 * Debe usarse dentro de un WizardProvider.
 */
export function useWizardNavigation(): UseWizardNavigationReturn {
  const { state, dispatch } = useWizard();
  const { isStepValid } = useValidation();

  const { currentStep } = state;
  const currentStepIndex = WIZARD_STEPS.indexOf(currentStep);
  const totalSteps = WIZARD_STEPS.length;
  const firstStep = WIZARD_STEPS[0] ?? currentStep;
  const lastStep = WIZARD_STEPS[WIZARD_STEPS.length - 1] ?? currentStep;
  const canGoBack = currentStep > firstStep;
  const canGoForward = currentStep < lastStep;

  const goToNextStep = useCallback((): boolean => {
    if (!canGoForward) return false;
    if (!isStepValid(currentStep)) return false;
    dispatch({ type: 'NEXT_STEP' });
    return true;
  }, [canGoForward, currentStep, isStepValid, dispatch]);

  const goToPreviousStep = useCallback((): void => {
    if (!canGoBack) return;
    dispatch({ type: 'PREV_STEP' });
  }, [canGoBack, dispatch]);

  const goToStep = useCallback(
    (step: WizardStep): void => {
      dispatch({ type: 'GO_TO_STEP', step });
    },
    [dispatch],
  );

  const skipToStep = useCallback(
    (step: WizardStep): void => {
      dispatch({ type: 'SKIP_TO_STEP', step });
    },
    [dispatch],
  );

  /**
   * Verifica si un paso específico ha sido completado.
   * Los pasos anteriores al actual se consideran completados.
   */
  const isStepCompleted = useCallback(
    (step: WizardStep): boolean => {
      return step < currentStep;
    },
    [currentStep],
  );

  return {
    currentStep,
    currentStepIndex,
    totalSteps,
    canGoBack,
    canGoForward,
    isStepCompleted,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    skipToStep,
  };
}
