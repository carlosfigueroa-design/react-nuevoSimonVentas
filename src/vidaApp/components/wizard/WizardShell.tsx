/**
 * Shell del wizard: orquesta stepper, pasos, header de sesión y navegación.
 * Ramo Vida Individual — Simón Ventas.
 */

import { useRef, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { WizardProvider, useWizardNavigation, useValidation } from '../../hooks';
import { StepperIndicator } from '../ui';
import { NavigationFooter } from './NavigationFooter';
import type { WizardStep } from '../../types';

const DatosRiesgo = lazy(() => import('./DatosRiesgo').then(m => ({ default: m.DatosRiesgo })));
const Coberturas = lazy(() => import('./Coberturas').then(m => ({ default: m.Coberturas })));
const Declaracion = lazy(() => import('./Declaracion').then(m => ({ default: m.Declaracion })));
const Resumen = lazy(() => import('./Resumen').then(m => ({ default: m.Resumen })));

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 120 : -120,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -120 : 120,
    opacity: 0,
  }),
};

const slideTransition = { duration: 0.25, ease: 'easeInOut' as const };

/** Mapa de paso → componente */
const STEP_COMPONENTS: Record<WizardStep, React.LazyExoticComponent<React.FC>> = {
  1: DatosRiesgo,
  2: Coberturas,
  3: Declaracion,
  4: Resumen,
};

/** Contenido interno del wizard (debe estar dentro de WizardProvider) */
function WizardContent(): React.JSX.Element {
  const {
    currentStep,
    isStepCompleted,
    goToNextStep,
    goToPreviousStep,
    skipToStep,
  } = useWizardNavigation();

  const { isStepValid } = useValidation();

  const prevStepRef = useRef<WizardStep>(currentStep);

  // Calculate animation direction based on step change
  const direction = currentStep >= prevStepRef.current ? 1 : -1;
  prevStepRef.current = currentStep;

  const StepComponent = STEP_COMPONENTS[currentStep];
  const completedSteps = ([1, 2, 3, 4] as WizardStep[]).filter(isStepCompleted);
  const stepValid = isStepValid(currentStep);

  const handleFinalize = () => {
    skipToStep(4);
  };

  const handleSubscribe = () => {
    goToNextStep();
  };

  return (
    <div className="wizard-panel mx-auto">
      {/* Stepper */}
      <StepperIndicator currentStep={currentStep} completedSteps={completedSteps} />

      {/* Step content with animation */}
      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
          >
            <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#005931]" /></div>}>
              <StepComponent />
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <NavigationFooter
        currentStep={currentStep}
        isStepValid={stepValid}
        onBack={goToPreviousStep}
        onNext={goToNextStep}
        onFinalize={currentStep === 2 ? handleFinalize : undefined}
        onSubscribe={currentStep === 2 ? handleSubscribe : undefined}
      />
    </div>
  );
}

/** WizardShell: envuelve todo en WizardProvider */
export function WizardShell(): React.JSX.Element {
  return (
    <WizardProvider>
      <WizardContent />
    </WizardProvider>
  );
}
