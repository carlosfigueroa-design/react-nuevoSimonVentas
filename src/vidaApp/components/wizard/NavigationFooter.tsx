/**
 * Barra de acción fija (footer) con navegación del wizard.
 * Botones usan sb-ui-button del Design System Seguros Bolívar.
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
          className={`sb-ui-button sb-ui-button--secondary ${
            isFirstStep ? 'sb-ui-button--disabled' : ''
          }`}
        >
          <ArrowLeft className="h-4 w-4 mr-1.5 inline" />
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
              className={`sb-ui-button sb-ui-button--primary ${
                !isStepValid ? 'sb-ui-button--disabled' : ''
              }`}
            >
              <FileCheck className="h-4 w-4 mr-1.5 inline" />
              Finalizar Cotización
            </button>
          )}

          {isStep2 && onSubscribe ? (
            <button
              type="button"
              onClick={onSubscribe}
              disabled={!isStepValid}
              aria-disabled={!isStepValid}
              className={`sb-ui-button sb-ui-button--secondary sb-ui-button--fill ${
                !isStepValid ? 'sb-ui-button--disabled' : ''
              }`}
            >
              <ClipboardCheck className="h-4 w-4 mr-1.5 inline" />
              Suscribir
            </button>
          ) : (
            <button
              type="button"
              onClick={onNext}
              disabled={!isStepValid}
              aria-disabled={!isStepValid}
              className={`sb-ui-button sb-ui-button--primary sb-ui-button--fill ${
                !isStepValid ? 'sb-ui-button--disabled' : ''
              }`}
            >
              Continuar
              <ArrowRight className="h-4 w-4 ml-1.5 inline" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
