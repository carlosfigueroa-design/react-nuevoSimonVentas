/**
 * Indicador visual de pasos del wizard.
 * Usa sb-ui-stepper del Design System Seguros Bolívar.
 * Ramo Vida Individual — Simón Ventas.
 */

import { Check, User, Shield, FileText, ClipboardList } from 'lucide-react';
import type { WizardStep } from '../../types';
import { WIZARD_STEPS } from '../../types';

/** Iconos por paso */
const STEP_ICONS: Record<WizardStep, React.FC<{ className?: string }>> = {
  1: User,
  2: Shield,
  3: FileText,
  4: ClipboardList,
};

/** Labels cortos por paso */
const STEP_NAMES: Record<WizardStep, string> = {
  1: 'DATOS DEL TOMADOR',
  2: 'COBERTURAS',
  3: 'DECLARACIÓN',
  4: 'RESUMEN',
};

export interface StepperIndicatorProps {
  currentStep: WizardStep;
  completedSteps: Set<WizardStep> | WizardStep[];
}

export function StepperIndicator({
  currentStep,
  completedSteps,
}: StepperIndicatorProps): React.JSX.Element {
  const completed = completedSteps instanceof Set ? completedSteps : new Set(completedSteps);

  return (
    <nav aria-label="Progreso del wizard" className="sb-ui-stepper sb-ui-stepper--horizontal w-full py-4">
      <ol className="flex items-start justify-between">
        {WIZARD_STEPS.map((step, idx) => {
          const isCompleted = completed.has(step);
          const isCurrent = step === currentStep;
          const isLast = idx === WIZARD_STEPS.length - 1;
          const Icon = STEP_ICONS[step];

          const stepClass = isCompleted
            ? 'sb-ui-stepper__step sb-ui-stepper__step--filled-default'
            : isCurrent
              ? 'sb-ui-stepper__step sb-ui-stepper__step--filled-active'
              : 'sb-ui-stepper__step sb-ui-stepper__step--empty-active';

          return (
            <li key={step} className="flex flex-1 items-start">
              {/* Step circle + labels */}
              <div className={`${stepClass} flex flex-col items-center gap-1.5 min-w-[80px]`}>
                {/* Circle icon */}
                <div
                  className={`sb-ui-stepper__step-circle flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                    isCompleted
                      ? 'bg-[#005931] text-white shadow-md'
                      : isCurrent
                        ? 'bg-[#005931] text-white shadow-lg ring-4 ring-[#005931]/20'
                        : 'border-2 border-gray-300 bg-white text-gray-400'
                  }`}
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-label={`Paso ${step}: ${STEP_NAMES[step]}${isCompleted ? ' (completado)' : isCurrent ? ' (actual)' : ''}`}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" aria-hidden />
                  ) : (
                    <Icon className="h-5 w-5" aria-hidden />
                  )}
                </div>

                {/* "Paso N" label */}
                <span
                  className={`sb-ui-text-caption font-medium tracking-wide ${
                    isCurrent || isCompleted ? 'text-[#005931]' : 'text-gray-400'
                  }`}
                >
                  Paso {step}
                </span>

                {/* Step name */}
                <span className="sb-ui-stepper__step-label text-center">
                  {STEP_NAMES[step]}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="sb-ui-stepper__step-track relative mt-6 flex-1 mx-2">
                  <div className="h-0.5 w-full bg-gray-200" aria-hidden />
                  {isCompleted && (
                    <div className="absolute inset-0 h-0.5 bg-[#005931]" aria-hidden />
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
