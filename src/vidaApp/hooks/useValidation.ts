/**
 * Hook para validación de campos con debounce.
 * Ramo Vida Individual — Simón Ventas.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { VALIDATION_DEBOUNCE_MS } from '../constants';
import type { ValidationResult, WizardStep } from '../types';
import { useWizard } from './WizardContext';

/** Tipo de retorno del hook useValidation */
export interface UseValidationReturn {
  errors: Record<string, string>;
  validateField: (
    fieldName: string,
    value: string,
    validatorFn: (value: string) => ValidationResult,
  ) => void;
  validateStep: (
    stepData: Record<string, string>,
    validators?: Record<string, (value: string) => ValidationResult>,
  ) => ValidationResult;
  clearErrors: () => void;
  /** Verifica si todos los campos obligatorios de un paso están completos */
  isStepValid: (step: WizardStep) => boolean;
}

/**
 * Proporciona validación por campo con feedback debounced (300ms),
 * validación síncrona de paso completo, y validación por paso del wizard.
 */
export function useValidation(): UseValidationReturn {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  let wizardState: ReturnType<typeof useWizard> | null = null;
  try {
    wizardState = useWizard();
  } catch {
    // useValidation puede usarse fuera del WizardProvider; isStepValid retornará true
  }

  // Limpiar timers al desmontar
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      for (const timer of Object.values(timers)) {
        clearTimeout(timer);
      }
    };
  }, []);

  const validateField = useCallback(
    (
      fieldName: string,
      value: string,
      validatorFn: (value: string) => ValidationResult,
    ): void => {
      // Cancelar timer previo para este campo
      if (timersRef.current[fieldName]) {
        clearTimeout(timersRef.current[fieldName]);
      }

      timersRef.current[fieldName] = setTimeout(() => {
        const result = validatorFn(value);
        setErrors((prev) => {
          const next = { ...prev };
          if (result.isValid) {
            delete next[fieldName];
          } else {
            const firstError = result.errors[0];
            next[fieldName] = firstError?.message ?? 'Campo inválido';
          }
          return next;
        });
      }, VALIDATION_DEBOUNCE_MS);
    },
    [],
  );

  const validateStep = useCallback(
    (
      stepData: Record<string, string>,
      validators?: Record<string, (value: string) => ValidationResult>,
    ): ValidationResult => {
      const allErrors: Record<string, string> = {};
      const validationErrors: { field: string; message: string }[] = [];

      for (const [field, value] of Object.entries(stepData)) {
        const validatorFn = validators?.[field];
        if (validatorFn) {
          const result = validatorFn(value);
          if (!result.isValid && result.errors.length > 0) {
            const msg = result.errors[0]?.message ?? 'Campo inválido';
            allErrors[field] = msg;
            validationErrors.push({ field, message: msg });
          }
        }
      }

      setErrors(allErrors);

      return {
        isValid: validationErrors.length === 0,
        errors: validationErrors,
      };
    },
    [],
  );

  const clearErrors = useCallback((): void => {
    setErrors({});
  }, []);

  /**
   * Verifica si todos los campos obligatorios de un paso están completos.
   * Retorna true si no hay WizardProvider (uso fuera del wizard).
   */
  const isStepValid = useCallback(
    (step: WizardStep): boolean => {
      if (!wizardState) return true;

      const { state } = wizardState;
      const { stepData } = state;

      switch (step) {
        case 1: {
          const dr = stepData.datosRiesgo;
          // Validar campos obligatorios del paso 1
          const hasPlan = dr.plan !== '';
          const hasTipoPersona = dr.tipoPersonaNatJur === 'natural' || dr.tipoPersonaNatJur === 'juridica';
          const tomadorValid =
            dr.tomador.nombres.trim() !== '' &&
            dr.tomador.apellidos.trim() !== '' &&
            dr.tomador.documentType !== '' &&
            dr.tomador.documentNumber.trim() !== '' &&
            dr.tomador.dateOfBirth.trim() !== '' &&
            dr.tomador.gender !== '' &&
            dr.tomador.email.trim() !== '' &&
            dr.tomador.phone.trim() !== '' &&
            dr.tomador.address.trim() !== '';
          const aseguradoValid =
            dr.isSameAsInsured ||
            (dr.asegurado.nombres.trim() !== '' &&
              dr.asegurado.apellidos.trim() !== '' &&
              dr.asegurado.documentType !== '' &&
              dr.asegurado.documentNumber.trim() !== '' &&
              dr.asegurado.dateOfBirth.trim() !== '' &&
              dr.asegurado.gender !== '' &&
              dr.asegurado.email.trim() !== '' &&
              dr.asegurado.phone.trim() !== '' &&
              dr.asegurado.address.trim() !== '');
          const hasIngresoMensual = dr.ingresoMensual > 0;

          // Validar representante legal si es persona jurídica
          const repLegalValid =
            dr.tipoPersonaNatJur !== 'juridica' ||
            (dr.representanteLegal.name.trim() !== '' &&
              dr.representanteLegal.documentType !== '' &&
              dr.representanteLegal.documentNumber.trim() !== '' &&
              dr.representanteLegal.cargo.trim() !== '');

          return (
            hasPlan &&
            hasTipoPersona &&
            tomadorValid &&
            aseguradoValid &&
            hasIngresoMensual &&
            repLegalValid &&
            dr.aceptaTratamientoDatos
          );
        }

        case 2: {
          const cob = stepData.coberturas;
          // Al menos una cobertura seleccionada con valor > 0
          const hasSelection = cob.selections.some(
            (s) => s.selected && s.insuredValue > 0,
          );
          return hasSelection;
        }

        case 3: {
          const decl = stepData.declaracion;
          return decl.isConfirmed;
        }

        case 4:
          return true;

        default:
          return true;
      }
    },
    [wizardState],
  );

  return { errors, validateField, validateStep, clearErrors, isStepValid };
}
