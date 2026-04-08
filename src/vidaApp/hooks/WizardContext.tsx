/**
 * Contexto y provider del wizard de cotización.
 * Centraliza el estado del wizard usando useReducer + useContext.
 * Ramo Vida Individual — Simón Ventas.
 */

import React, { createContext, useContext, useReducer, useMemo } from 'react';
import type { WizardState, WizardAction } from '../types';
import { wizardReducer, createInitialWizardState } from './useWizardReducer';
import { useSessionPersistence } from './useSessionPersistence';

/** Valor expuesto por el contexto del wizard */
export interface WizardContextValue {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}

const WizardContext = createContext<WizardContextValue | null>(null);

/** Props del WizardProvider */
export interface WizardProviderProps {
  children: React.ReactNode;
}

/** Provider que envuelve el árbol con el estado del wizard */
export function WizardProvider({ children }: WizardProviderProps): React.JSX.Element {
  const [state, dispatch] = useReducer(wizardReducer, undefined, createInitialWizardState);

  useSessionPersistence(state, dispatch);

  const value = useMemo<WizardContextValue>(() => ({ state, dispatch }), [state, dispatch]);

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
}

/** Hook de conveniencia para consumir el contexto del wizard */
export function useWizard(): WizardContextValue {
  const ctx = useContext(WizardContext);
  if (ctx === null) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return ctx;
}
