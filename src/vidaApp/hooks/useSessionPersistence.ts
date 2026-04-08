/**
 * Hook de persistencia en sessionStorage para el wizard.
 * Sincroniza el estado del wizard en cada cambio y lo restaura al montar.
 * Ramo Vida Individual — Simón Ventas.
 */

import { useEffect, useRef } from 'react';
import type { WizardState, WizardAction } from '../types';
import { WIZARD_STORAGE_KEY } from '../constants/wizard';

/**
 * Persiste el estado del wizard en sessionStorage y lo restaura al montar.
 *
 * @param state - Estado actual del wizard
 * @param dispatch - Dispatch del reducer del wizard
 */
export function useSessionPersistence(
  state: WizardState,
  dispatch: React.Dispatch<WizardAction>,
): void {
  const isInitialMount = useRef(true);

  // On mount, restore state from sessionStorage if available
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(WIZARD_STORAGE_KEY);
      if (stored) {
        const parsed: WizardState = JSON.parse(stored);

        // Restore step data for each step
        if (parsed.stepData) {
          dispatch({
            type: 'SET_STEP_DATA',
            step: 1,
            data: { datosRiesgo: parsed.stepData.datosRiesgo },
          });
          dispatch({
            type: 'SET_STEP_DATA',
            step: 2,
            data: { coberturas: parsed.stepData.coberturas },
          });
          dispatch({
            type: 'SET_STEP_DATA',
            step: 3,
            data: { declaracion: parsed.stepData.declaracion },
          });
          dispatch({
            type: 'SET_STEP_DATA',
            step: 4,
            data: { resumen: parsed.stepData.resumen },
          });
        }

        // Restore current step
        if (parsed.currentStep) {
          dispatch({ type: 'GO_TO_STEP', step: parsed.currentStep });
        }
      }
    } catch {
      // sessionStorage unavailable or corrupted — app works without persistence
    }
  }, [dispatch]);

  // Sync state to sessionStorage on every change (skip initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    try {
      sessionStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // sessionStorage full or unavailable — silently ignore
    }
  }, [state]);
}
