/**
 * Paso 2: Coberturas — Valor asegurado, amparo básico, anexos y ahorro/proyección.
 * Diseño tipo lista con acordeones colapsables.
 * Ramo Vida Individual — Simón Ventas.
 */

import { useCallback, useEffect, useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useWizard, useCoverages, usePrimaCalculation, useCurrencyMask } from '../../hooks';
import {
  COVERAGE_CONFIGS,
  PERIODICIDAD_OPTIONS,
  ASISTENCIAS_GRATUITAS,
  SUB_COBERTURAS_ACCIDENTES,
  COVERAGE_IDS,
} from '../../constants';
import { BentoCard, ConfirmModal } from '../ui';
import { AhorroProyeccion } from './AhorroProyeccion';
import { formatCurrency } from '../../utils';
import type { Periodicidad } from '../../types';

/** Coberturas que forman parte del Amparo Básico (obligatorias + asistencias) */
const BASIC_COVERAGE_ID = COVERAGE_IDS.BASICO_VIDA;

/** IDs de anexos opcionales */
const ANNEX_IDS = [
  COVERAGE_IDS.ITP_ENFERMEDAD,
  COVERAGE_IDS.ITP_ACCIDENTE,
  COVERAGE_IDS.ITP_ANTICIPO,
  COVERAGE_IDS.ENFERMEDADES_GRAVES,
  COVERAGE_IDS.ENFERMEDADES_GRAVES_ANTICIPO,
  COVERAGE_IDS.ACCIDENTES_PERSONALES,
  COVERAGE_IDS.RENTA_INCAPACIDAD,
];

export function Coberturas(): React.JSX.Element {
  const { state, dispatch } = useWizard();
  const cob = state.stepData.coberturas;
  const { selections, toggleCoverage, updateCoverageAmount, isMandatory, deselectionError, showConflictPopup, dismissConflictPopup } = useCoverages();
  const { breakdown, total } = usePrimaCalculation(
    selections,
    COVERAGE_CONFIGS,
    state.stepData.declaracion.extraprimaActive,
    cob.periodicidad,
  );

  const [basicOpen, setBasicOpen] = useState(false);
  const [annexOpen, setAnnexOpen] = useState(false);
  const [savingsOpen, setSavingsOpen] = useState(false);

  // Valor asegurado del amparo básico
  const basicSel = selections.find((s) => s.coverageId === BASIC_COVERAGE_ID);
  const { displayValue: basicDisplay, handleChange: handleBasicMask } = useCurrencyMask(basicSel?.insuredValue ?? 0);

  const handleBasicValueChange = useCallback((val: string) => {
    handleBasicMask(val);
    const numeric = Number(val.replace(/\./g, '')) || 0;
    updateCoverageAmount(BASIC_COVERAGE_ID, numeric);
  }, [handleBasicMask, updateCoverageAmount]);

  // Sync to wizard state
  useEffect(() => {
    dispatch({
      type: 'SET_STEP_DATA',
      step: 2,
      data: { coberturas: { ...cob, selections, primaBreakdown: breakdown, totalPrima: total } },
    });
  }, [selections, breakdown, total]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePeriodicidadChange = useCallback((value: string) => {
    dispatch({
      type: 'SET_STEP_DATA',
      step: 2,
      data: { coberturas: { ...cob, periodicidad: value as Periodicidad } },
    });
  }, [cob, dispatch]);

  const hasValidConfig = selections.some((s) => s.selected && s.insuredValue > 0);

  return (
    <div className="space-y-4">

      {/* 1. Valor Asegurado + Periodicidad */}
      <BentoCard>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_200px]">
          <div className="flex flex-col gap-1">
            <label htmlFor="valor-asegurado" className="text-sm font-medium text-gray-700">
              Valor Asegurado (Amparo Básico) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
              <input
                id="valor-asegurado"
                type="text"
                inputMode="numeric"
                value={basicDisplay}
                onChange={(e) => handleBasicValueChange(e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2.5 pl-7 pr-3 text-sm focus:border-[#005931] focus:outline-none focus:ring-2 focus:ring-[#005931]/15"
                placeholder="0"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="periodicidad-prima" className="text-sm font-medium text-gray-700">
              Periodicidad Prima
            </label>
            <select
              id="periodicidad-prima"
              value={cob.periodicidad}
              onChange={(e) => handlePeriodicidadChange(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:border-[#005931] focus:outline-none focus:ring-2 focus:ring-[#005931]/15"
            >
              {PERIODICIDAD_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </BentoCard>

      {/* 2. Amparo Básico (acordeón tipo lista) */}
      <BentoCard className="!p-0 overflow-hidden">
        <button
          type="button"
          onClick={() => setBasicOpen(!basicOpen)}
          className="flex w-full items-center justify-between bg-[#005931]/5 px-6 py-3 text-left"
        >
          <h2 className="text-h6 font-bold text-[#005931]">Amparo Básico</h2>
          {basicOpen ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
        </button>
        {basicOpen && (
          <div className="divide-y divide-gray-100 px-6">
            {/* Fallecimiento por cualquier causa */}
            <CoverageRow
              name="Fallecimiento por cualquier causa"
              checked
              disabled
              prima="SIN COSTO"
            />
            {/* Asistencias gratuitas */}
            {ASISTENCIAS_GRATUITAS.map((a) => (
              <CoverageRow
                key={a.id}
                name={a.name}
                checked
                disabled
                sumaAsegurada={a.id === 'asistencia-funeraria' ? '$ 10.000.000' : a.id === 'asistencia-medicamentos' ? '$ 500.000' : undefined}
                prima="SIN COSTO"
              />
            ))}
          </div>
        )}
      </BentoCard>

      {/* 3. Anexos (acordeón tipo lista) */}
      <BentoCard className="!p-0 overflow-hidden">
        <button
          type="button"
          onClick={() => setAnnexOpen(!annexOpen)}
          className="flex w-full items-center justify-between bg-[#005931]/5 px-6 py-3 text-left"
        >
          <h2 className="text-h6 font-bold text-[#005931]">Anexos</h2>
          {annexOpen ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
        </button>
        {annexOpen && (
          <div className="divide-y divide-gray-100 px-6">
            {deselectionError && (
              <div className="py-2 text-xs text-yellow-800 bg-yellow-50 -mx-6 px-6">{deselectionError}</div>
            )}
            {ANNEX_IDS.map((id) => {
              const config = COVERAGE_CONFIGS.find((c) => c.id === id);
              if (!config) return null;
              const sel = selections.find((s) => s.coverageId === id);
              const primaItem = breakdown.find((b) => b.coverageId === id);
              const isSelected = sel?.selected ?? false;
              const hasSubCoverages = id === COVERAGE_IDS.ACCIDENTES_PERSONALES;
              return (
                <div key={id}>
                  <AnnexRow
                    name={config.name}
                    checked={isSelected}
                    onToggle={() => toggleCoverage(id)}
                    sumaAsegurada={isSelected && sel ? `$ ${formatCurrency(sel.insuredValue)}` : '$ 0'}
                    prima={isSelected ? `$ ${formatCurrency(primaItem?.total ?? 0)}` : '$ 0'}
                    onAmountChange={(val) => updateCoverageAmount(id, val)}
                    isSelected={isSelected}
                  />
                  {isSelected && hasSubCoverages && (
                    <div className="pb-3 pl-10 space-y-1">
                      {SUB_COBERTURAS_ACCIDENTES.map((sub) => (
                        <p key={sub.id} className="text-xs text-gray-500">• {sub.name}</p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </BentoCard>

      {/* Total prima */}
      <div className="flex items-center justify-between rounded-lg bg-[#005931]/5 px-6 py-3">
        <span className="text-sm font-semibold text-gray-700">Prima Total ({cob.periodicidad})</span>
        <span className="text-lg font-bold text-[#005931]">$ {formatCurrency(total)}</span>
      </div>

      {/* 4. Ahorro y Proyección (acordeón) */}
      <BentoCard className="!p-0 overflow-hidden">
        <button
          type="button"
          onClick={() => setSavingsOpen(!savingsOpen)}
          className="flex w-full items-center justify-between bg-[#005931]/5 px-6 py-3 text-left"
        >
          <h2 className="text-h6 font-bold text-[#005931]">Ahorro y Proyección</h2>
          {savingsOpen ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
        </button>
        {savingsOpen && (
          <div className="p-6">
            <AhorroProyeccion />
          </div>
        )}
      </BentoCard>

      {/* Conflict popup ITP */}
      <ConfirmModal
        isOpen={showConflictPopup}
        title="Conflicto de Coberturas"
        message="No es posible seleccionar simultáneamente las coberturas de ITP Suma Adicional y ITP Anticipo. Por favor, elija una modalidad de protección para invalidez."
        confirmLabel="Entendido"
        onConfirm={dismissConflictPopup}
        onCancel={dismissConflictPopup}
        variant="warning"
      />
    </div>
  );
}

/** Fila de cobertura básica (solo lectura) */
function CoverageRow({
  name,
  checked,
  disabled,
  sumaAsegurada,
  prima,
}: {
  name: string;
  checked: boolean;
  disabled: boolean;
  sumaAsegurada?: string;
  prima: string;
}): React.JSX.Element {
  return (
    <div className="flex items-center gap-3 py-3">
      <input type="checkbox" checked={checked} disabled={disabled} readOnly
        className="h-4 w-4 rounded border-gray-300 accent-[#005931]" />
      <span className="flex-1 text-sm text-gray-700">{name}</span>
      {sumaAsegurada && (
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-gray-400">Suma Asegurada</p>
          <p className="text-sm font-medium text-gray-700">{sumaAsegurada}</p>
        </div>
      )}
      <div className="text-right min-w-[80px]">
        <p className="text-[10px] uppercase tracking-wider text-gray-400">Prima</p>
        <p className="text-sm font-bold text-[#00C875]">{prima}</p>
      </div>
    </div>
  );
}

/** Fila de anexo (interactiva) */
function AnnexRow({
  name,
  checked,
  onToggle,
  sumaAsegurada,
  prima,
  onAmountChange,
  isSelected,
}: {
  name: string;
  checked: boolean;
  onToggle: () => void;
  sumaAsegurada: string;
  prima: string;
  onAmountChange: (val: number) => void;
  isSelected: boolean;
}): React.JSX.Element {
  return (
    <div className="flex items-center gap-3 py-3">
      <input type="checkbox" checked={checked} onChange={onToggle}
        className="h-4 w-4 rounded border-gray-300 accent-[#005931] cursor-pointer" />
      <span className="flex-1 text-sm text-gray-700">{name}</span>
      <div className="text-right">
        <p className="text-[10px] uppercase tracking-wider text-gray-400">Suma Asegurada</p>
        {isSelected ? (
          <input
            type="number"
            min={0}
            onChange={(e) => onAmountChange(Number(e.target.value) || 0)}
            className="w-28 rounded border border-gray-300 px-2 py-0.5 text-right text-sm focus:border-[#005931] focus:outline-none"
            placeholder="$ 0"
          />
        ) : (
          <p className="text-sm text-gray-400">{sumaAsegurada}</p>
        )}
      </div>
      <div className="text-right min-w-[80px]">
        <p className="text-[10px] uppercase tracking-wider text-gray-400">Prima</p>
        <p className={`text-sm font-bold ${checked ? 'text-[#005931]' : 'text-[#00C875]'}`}>{prima}</p>
      </div>
    </div>
  );
}
