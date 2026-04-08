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

  // On mount, clear previous session so the wizard always starts fresh
  useEffect(() => {
    try {
      sessionStorage.removeItem(WIZARD_STORAGE_KEY);
    } catch {
      // sessionStorage unavailable — ignore
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
