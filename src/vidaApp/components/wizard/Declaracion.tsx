/**
 * Paso 3: Declaración de Asegurabilidad — Cuestionario de salud, IMC, extraprima y firma digital.
 * Botones segmentados SÍ/NO, regla de obesidad IMC>30, banner de éxito, bloqueo post-firma.
 * Ramo Vida Individual — Simón Ventas.
 */

import { useState, useCallback, useMemo } from 'react';
import { useWizard, useBMICalculation, useExtraprima } from '../../hooks';
import { HEALTH_CATEGORIES, ALL_HEALTH_QUESTIONS } from '../../constants';
import { HealthAccordion, ConfirmModal, BentoCard } from '../ui';
import { generateDeclaracionNumber, formatCurrency } from '../../utils';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const BMI_LABELS: Record<string, string> = {
  underweight: 'Bajo peso',
  normal: 'Normal',
  overweight: 'Sobrepeso',
  obese: 'Obesidad',
};

const BMI_COLORS: Record<string, string> = {
  underweight: 'text-blue-600',
  normal: 'text-[#005931]',
  overweight: 'text-yellow-600',
  obese: 'text-red-600',
};

export function Declaracion(): React.JSX.Element {
  const { state, dispatch } = useWizard();
  const decl = state.stepData.declaracion;
  const { answers, weight, height } = decl;
  const bmiResult = useBMICalculation(weight, height);
  const { isActive: extraprimaActive, percentage, calculateSurcharge } = useExtraprima(answers);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showExtraprimaWarning, setShowExtraprimaWarning] = useState(false);
  const [declaracionNumber] = useState(() => generateDeclaracionNumber());

  // Calcular recargo total: extraprima por salud + obesidad (IMC > 30)
  const obesityExtraprima = bmiResult && bmiResult.value > 30 ? 25 : 0;
  const totalExtraprima = Math.max(extraprimaActive ? percentage : 0, obesityExtraprima);
  const hasExtraprima = totalExtraprima > 0;

  const updateDeclaracion = useCallback(
    (patch: Partial<typeof decl>) => {
      dispatch({
        type: 'SET_STEP_DATA',
        step: 3,
        data: { declaracion: { ...decl, ...patch } },
      });
    },
    [decl, dispatch],
  );

  // Sync extraprima state (incluye obesidad)
  useMemo(() => {
    const shouldBeActive = extraprimaActive || obesityExtraprima > 0;
    if (decl.extraprimaActive !== shouldBeActive || decl.extraprima !== totalExtraprima) {
      dispatch({
        type: 'SET_STEP_DATA',
        step: 3,
        data: { declaracion: { ...decl, extraprimaActive: shouldBeActive, extraprima: totalExtraprima } },
      });
    }
  }, [extraprimaActive, obesityExtraprima, totalExtraprima]); // eslint-disable-line react-hooks/exhaustive-deps

  // Validar formulario completo: todas las preguntas boolean respondidas + peso + estatura
  const isFormComplete = useMemo(() => {
    const booleanQuestions = ALL_HEALTH_QUESTIONS.filter((q) => q.type === 'boolean' && q.required);
    const allAnswered = booleanQuestions.every((q) => answers[q.id] !== undefined);
    const hasWeight = weight > 0;
    const hasHeight = height > 0;
    return allAnswered && hasWeight && hasHeight;
  }, [answers, weight, height]);

  const handleAnswerChange = useCallback(
    (questionId: string, value: string | boolean | number) => {
      if (decl.isConfirmed) return; // Bloqueo post-firma
      updateDeclaracion({ answers: { ...answers, [questionId]: value } });
    },
    [answers, updateDeclaracion, decl.isConfirmed],
  );

  const handleWeightChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (decl.isConfirmed) return;
      updateDeclaracion({ weight: Number(e.target.value) || 0 });
    },
    [updateDeclaracion, decl.isConfirmed],
  );

  const handleHeightChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (decl.isConfirmed) return;
      updateDeclaracion({ height: Number(e.target.value) || 0 });
    },
    [updateDeclaracion, decl.isConfirmed],
  );

  const handleSignClick = useCallback(() => {
    setShowConfirmModal(true);
  }, []);

  const handleConfirm = useCallback(() => {
    setShowConfirmModal(false);
    if (hasExtraprima) {
      setShowExtraprimaWarning(true);
    } else {
      updateDeclaracion({ isConfirmed: true, bmiResult });
    }
  }, [updateDeclaracion, bmiResult, hasExtraprima]);

  const handleExtraprimaConfirm = useCallback(() => {
    setShowExtraprimaWarning(false);
    updateDeclaracion({ isConfirmed: true, bmiResult, extraprimaActive: true, extraprima: totalExtraprima });
  }, [updateDeclaracion, bmiResult, totalExtraprima]);

  return (
    <div className="space-y-6">
      {/* Dynamic header */}
      <div className="flex items-center justify-between">
        <h1 className="text-h5 font-bold text-[#005931]">Declaración Salud</h1>
        <span className="rounded-md bg-[#005931]/10 px-3 py-1 text-xs font-medium text-[#005931]">
          {declaracionNumber}
        </span>
      </div>

      {/* Banner de éxito post-firma */}
      {decl.isConfirmed && (
        <div className="flex items-center gap-3 rounded-lg bg-[#005931]/10 px-4 py-3">
          <CheckCircle className="h-5 w-5 text-[#005931]" />
          <div>
            <p className="text-sm font-semibold text-[#005931]">Declaración Presentada Exitosamente</p>
            <p className="text-xs text-[#005931]/70">Radicado: {declaracionNumber}</p>
          </div>
        </div>
      )}

      {/* Tarjeta de recargo si aplica extraprima */}
      {hasExtraprima && (
        <div className="flex items-center gap-3 rounded-lg border-2 border-[#FFD100] bg-[#FFD100]/10 px-4 py-3">
          <AlertTriangle className="h-5 w-5 text-[#FFD100]" />
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Recargo aplicado: {totalExtraprima}%
            </p>
            <p className="text-xs text-gray-600">
              {obesityExtraprima > 0 && 'IMC superior a 30 (obesidad). '}
              {extraprimaActive && 'Condiciones de salud declaradas. '}
              Nueva prima ajustada con recargo sobre la prima base.
            </p>
          </div>
        </div>
      )}

      {/* IMC + Cuestionario en layout compacto */}
      <BentoCard>
        <h2 className="mb-3 text-h5 font-semibold text-gray-800">Índice de Masa Corporal</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="weight" className="text-sm font-medium text-gray-700">
              Peso (kg) <span className="text-red-500">*</span>
            </label>
            <input
              id="weight"
              type="number"
              min={0}
              step={0.1}
              value={weight || ''}
              onChange={handleWeightChange}
              disabled={decl.isConfirmed}
              className="sb-ui-input w-full"
              placeholder="Ej: 70"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="height" className="text-sm font-medium text-gray-700">
              Estatura (cm) <span className="text-red-500">*</span>
            </label>
            <input
              id="height"
              type="number"
              min={0}
              step={1}
              value={height || ''}
              onChange={handleHeightChange}
              disabled={decl.isConfirmed}
              className="sb-ui-input w-full"
              placeholder="Ej: 170"
            />
          </div>
          {bmiResult && (
            <div className="flex flex-col justify-center rounded-lg bg-gray-50 px-4 py-2">
              <span className="text-xs text-gray-500">IMC</span>
              <span className="text-lg font-bold text-gray-900">{bmiResult.value.toFixed(1)}</span>
              <span className={`text-xs font-medium ${BMI_COLORS[bmiResult.classification] ?? ''}`}>
                {BMI_LABELS[bmiResult.classification] ?? bmiResult.classification}
              </span>
            </div>
          )}
        </div>
      </BentoCard>

      {/* Health questionnaire */}
      <BentoCard>
        <h2 className="mb-3 text-h5 font-semibold text-gray-800">Cuestionario de Salud</h2>
        <HealthAccordion
          categories={HEALTH_CATEGORIES}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          disabled={decl.isConfirmed}
        />
      </BentoCard>

      {/* Presentar Declaración — solo visible cuando formulario completo y no confirmado */}
      {!decl.isConfirmed && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSignClick}
            disabled={!isFormComplete}
            className={`rounded-md px-6 py-2.5 text-sm font-medium transition-colors ${
              isFormComplete
                ? 'bg-[#005931] text-white hover:bg-[#005931]/90'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
            }`}
          >
            Presentar Declaración
          </button>
        </div>
      )}

      {/* Confirm modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        title="Confirmar Declaración de Asegurabilidad"
        message="Al confirmar, declaro que la información proporcionada es veraz y completa. Entiendo que cualquier omisión o inexactitud puede afectar la validez de la póliza."
        confirmLabel="Acepto y Firmo"
        cancelLabel="Cancelar"
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirmModal(false)}
      />

      {/* Extraprima warning modal */}
      <ConfirmModal
        isOpen={showExtraprimaWarning}
        title="Advertencia de Recargo"
        message={`Se aplicará un recargo del ${totalExtraprima}% sobre la prima base debido a las condiciones de salud declaradas. ¿Desea continuar?`}
        confirmLabel="Aceptar y Continuar"
        cancelLabel="Revisar Declaración"
        onConfirm={handleExtraprimaConfirm}
        onCancel={() => setShowExtraprimaWarning(false)}
        variant="warning"
      />
    </div>
  );
}
