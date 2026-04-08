/**
 * Barra de acción fija (footer) con navegación del wizard.
 * Ramo Vida Individual — Simón Ventas.
 */

import { ArrowLeft, ArrowRight, FileCheck, ClipboardCheck } from 'lucide-react';
import type { WizardStep } from '../../types';

export interface NavigationFooterProps {
  currentStep: WizardStep;
  isStepValid: boolean;
  onBack: () => void;
  onNext: () => void;
  onFinalize?: () => void;
  onSubscribe?: () => void;
}

export function NavigationFooter({
  currentStep,
  isStepValid,
  onBack,
  onNext,
  onFinalize,
  onSubscribe,
}: NavigationFooterProps): React.JSX.Element {
  const isFirstStep = currentStep === 1;
  const isStep2 = currentStep === 2;

  return (
    <div className="sticky bottom-0 z-20 border-t border-gray-200 bg-white px-6 py-3">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        {/* Back button */}
        <button
          type="button"
          onClick={onBack}
          disabled={isFirstStep}
          aria-disabled={isFirstStep}
          className={`flex items-center gap-1.5 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
            isFirstStep
              ? 'border-gray-200 text-gray-300 cursor-not-allowed opacity-50'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <ArrowLeft className="h-4 w-4" />
          Atrás
        </button>

        {/* Forward buttons */}
        <div className="flex gap-2">
          {isStep2 && onFinalize && (
            <button
              type="button"
              onClick={onFinalize}
              disabled={!isStepValid}
              aria-disabled={!isStepValid}
              className={`flex items-center gap-1.5 rounded-md border border-[#005931] px-4 py-2 text-sm font-medium transition-colors ${
                isStepValid
                  ? 'text-[#005931] hover:bg-[#005931]/5'
                  : 'opacity-50 cursor-not-allowed text-[#005931]/50'
              }`}
            >
              <FileCheck className="h-4 w-4" />
              Finalizar Cotización
            </button>
          )}

          {isStep2 && onSubscribe ? (
            <button
              type="button"
              onClick={onSubscribe}
              disabled={!isStepValid}
              aria-disabled={!isStepValid}
              className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                isStepValid
                  ? 'bg-[#FFD100] text-gray-900 hover:bg-[#FFD100]/90'
                  : 'bg-[#FFD100]/50 text-gray-900/50 opacity-50 cursor-not-allowed'
              }`}
            >
              <ClipboardCheck className="h-4 w-4" />
              Suscribir
            </button>
          ) : (
            <button
              type="button"
              onClick={onNext}
              disabled={!isStepValid}
              aria-disabled={!isStepValid}
              className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                isStepValid
                  ? 'bg-[#FFD100] text-gray-900 hover:bg-[#FFD100]/90'
                  : 'bg-[#FFD100]/50 text-gray-900/50 opacity-50 cursor-not-allowed'
              }`}
            >
              Continuar
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
