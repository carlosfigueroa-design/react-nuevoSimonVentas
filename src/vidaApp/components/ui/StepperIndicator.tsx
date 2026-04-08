/**
 * Indicador visual de pasos del wizard — Alineado al estilo de Autos.
 * Línea de progreso animada, iconos circulares, "Paso N" y nombre debajo.
 * Ramo Vida Individual — Simón Ventas.
 */

import { motion } from 'framer-motion';
import { Check, User, Shield, FileText, ClipboardList } from 'lucide-react';
import type { WizardStep } from '../../types';
import { WIZARD_STEPS } from '../../types';

/** Iconos por paso */
const STEP_ICONS: Record<WizardStep, React.FC<{ className?: string; size?: number }>> = {
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
  const totalSteps = WIZARD_STEPS.length;
  const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <nav aria-label="Progreso del wizard" className="w-full">
      <div className="flex justify-between items-start min-w-[600px] relative">
        {/* Background line */}
        <div className="absolute top-6 left-0 w-full h-[2px] bg-gray-100 z-0" aria-hidden />

        {/* Animated progress line */}
        <motion.div
          className="absolute top-6 left-0 h-[2px] bg-[#005931] z-0"
          initial={{ width: '0%' }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5 }}
          aria-hidden
        />

        {WIZARD_STEPS.map((step) => {
          const isCompleted = completed.has(step);
          const isCurrent = step === currentStep;
          const Icon = STEP_ICONS[step];

          return (
            <div key={step} className="flex flex-col items-center relative z-10 flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                  isCurrent
                    ? 'bg-[#005931] border-[#005931] text-white shadow-lg shadow-[#005931]/20 scale-110'
                    : isCompleted
                      ? 'bg-[#005931] border-[#005931] text-white'
                      : 'bg-white border-gray-200 text-gray-400'
                }`}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`Paso ${step}: ${STEP_NAMES[step]}${isCompleted ? ' (completado)' : isCurrent ? ' (actual)' : ''}`}
              >
                {isCompleted ? <Check size={20} /> : <Icon size={20} />}
              </div>
              <div className="mt-4 text-center">
                <p className={`text-[10px] font-bold mb-1 ${
                  isCurrent || isCompleted ? 'text-[#005931]' : 'text-gray-400'
                }`}>
                  Paso {step}
                </p>
                <p className={`text-[11px] font-bold uppercase tracking-wider max-w-[100px] leading-tight ${
                  isCurrent ? 'text-[#002B49]' : isCompleted ? 'text-[#005931]/70' : 'text-gray-400'
                }`}>
                  {STEP_NAMES[step]}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
