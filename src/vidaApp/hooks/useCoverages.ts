/**
 * Hook para gestión de selección de coberturas con dependencias.
 * Ramo Vida Individual — Simón Ventas.
 */

import { useState, useCallback } from 'react';
import {
  COVERAGE_CONFIGS,
  DEFAULT_COVERAGE_SELECTIONS,
  COVERAGE_DEPENDENCY_MAP,
  COVERAGE_IDS,
} from '../constants';
import type { CoverageSelection } from '../types';

/** Tipo de retorno del hook useCoverages */
export interface UseCoveragesReturn {
  selections: CoverageSelection[];
  toggleCoverage: (id: string) => void;
  updateCoverageAmount: (id: string, amount: number) => void;
  isMandatory: (id: string) => boolean;
  /** Mensaje de error cuando se intenta deseleccionar una cobertura con dependientes activos */
  deselectionError: string | null;
  /** Indica si se debe mostrar el popup de conflicto ITP */
  showConflictPopup: boolean;
  /** Cierra el popup de conflicto */
  dismissConflictPopup: () => void;
}

/**
 * Obtiene los IDs de coberturas seleccionadas que dependen de la cobertura dada.
 */
function getActiveDependents(
  coverageId: string,
  selections: CoverageSelection[],
): string[] {
  const selectedIds = new Set(
    selections.filter((s) => s.selected).map((s) => s.coverageId),
  );

  const dependents: string[] = [];
  for (const [depId, deps] of Object.entries(COVERAGE_DEPENDENCY_MAP)) {
    if (deps.includes(coverageId) && selectedIds.has(depId)) {
      const config = COVERAGE_CONFIGS.find((c) => c.id === depId);
      dependents.push(config?.name ?? depId);
    }
  }
  return dependents;
}

/**
 * Gestiona el estado de selección de coberturas.
 *
 * - Inicializa desde DEFAULT_COVERAGE_SELECTIONS
 * - toggleCoverage: alterna selección, auto-selecciona dependencias, impide deselección de obligatorias
 * - Previene deselección cuando hay dependientes activos
 * - updateCoverageAmount: actualiza el valor asegurado de una cobertura
 * - isMandatory: indica si una cobertura es obligatoria
 */
export function useCoverages(): UseCoveragesReturn {
  const [selections, setSelections] = useState<CoverageSelection[]>(
    () => DEFAULT_COVERAGE_SELECTIONS.map((s) => ({ ...s })),
  );
  const [deselectionError, setDeselectionError] = useState<string | null>(null);
  const [showConflictPopup, setShowConflictPopup] = useState(false);

  const dismissConflictPopup = useCallback(() => setShowConflictPopup(false), []);

  const isMandatory = useCallback((id: string): boolean => {
    const config = COVERAGE_CONFIGS.find((c) => c.id === id);
    return config?.mandatory ?? false;
  }, []);

  const toggleCoverage = useCallback((id: string): void => {
    if (isMandatory(id)) return;

    setSelections((prev) => {
      const target = prev.find((s) => s.coverageId === id);
      if (!target) return prev;

      const newSelected = !target.selected;

      // Prevenir deselección si hay dependientes activos
      if (!newSelected) {
        const dependents = getActiveDependents(id, prev);
        if (dependents.length > 0) {
          setDeselectionError(
            `No se puede deseleccionar: las siguientes coberturas dependen de esta: ${dependents.join(', ')}`,
          );
          return prev;
        }
      }

      // Limpiar error previo
      setDeselectionError(null);

      const updated = prev.map((s) => ({ ...s }));
      const updatedTarget = updated.find((s) => s.coverageId === id);
      if (!updatedTarget) return prev;

      updatedTarget.selected = newSelected;

      // Limpieza de datos al desmarcar: borrar valor asegurado
      if (!newSelected) {
        updatedTarget.insuredValue = 0;
      }

      // Auto-seleccionar dependencias al activar
      if (newSelected) {
        const deps = COVERAGE_DEPENDENCY_MAP[id] ?? [];
        for (const depId of deps) {
          const dep = updated.find((s) => s.coverageId === depId);
          if (dep && !dep.selected) {
            dep.selected = true;
          }
        }
      }

      // Regla de exclusión mutua ITP: no se pueden tener las 3 modalidades activas
      const itpEnf = updated.find((s) => s.coverageId === COVERAGE_IDS.ITP_ENFERMEDAD);
      const itpAcc = updated.find((s) => s.coverageId === COVERAGE_IDS.ITP_ACCIDENTE);
      const itpAnt = updated.find((s) => s.coverageId === COVERAGE_IDS.ITP_ANTICIPO);

      if (itpEnf?.selected && itpAcc?.selected && itpAnt?.selected) {
        // Bloquear: desmarcar el Anticipo y mostrar popup
        if (itpAnt) {
          itpAnt.selected = false;
          itpAnt.insuredValue = 0;
        }
        setShowConflictPopup(true);
      }

      return updated;
    });
  }, [isMandatory]);

  const updateCoverageAmount = useCallback(
    (id: string, amount: number): void => {
      setSelections((prev) =>
        prev.map((s) =>
          s.coverageId === id ? { ...s, insuredValue: amount } : s,
        ),
      );
    },
    [],
  );

  return { selections, toggleCoverage, updateCoverageAmount, isMandatory, deselectionError, showConflictPopup, dismissConflictPopup };
}
