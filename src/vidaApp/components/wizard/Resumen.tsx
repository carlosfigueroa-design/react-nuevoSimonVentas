/**
 * Paso 4: Resumen de Cotización — Vista consolidada, PDF, email y emisión.
 * Ramo Vida Individual — Simón Ventas.
 */

import { useState, useCallback } from 'react';
import { useWizard, useQuoteSession } from '../../hooks';
import { formatCurrency, formatDate, generatePolicyNumber } from '../../utils';
import { generateQuotePDF } from '../../services/pdfService';
import { initiateIssuance } from '../../services/quoteService';
import { saveRadicado } from '../../../services/radicadoStore';
import { PriceHero, PDFPreviewModal, EmailModal, BentoCard } from '../ui';
import { EmisionExito } from './EmisionExito';
import { PLAN_OPTIONS } from '../../constants';

type ActionStatus = 'idle' | 'loading' | 'success' | 'error';

export function Resumen(): React.JSX.Element {
  const { state, dispatch } = useWizard();
  const { datosRiesgo, coberturas, declaracion } = state.stepData;
  const { quoteNumber, quoteDate, advisorKey } = useQuoteSession();

  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [pdfDone, setPdfDone] = useState(false);
  const [emailDone, setEmailDone] = useState(false);
  const [issueStatus, setIssueStatus] = useState<ActionStatus>('idle');
  const [isIssued, setIsIssued] = useState(false);
  const [policyNumber, setPolicyNumber] = useState('');
  const [isProvisoria, setIsProvisoria] = useState(false);

  const selectedCoverages = coberturas.selections.filter((s) => s.selected);
  const planLabel = PLAN_OPTIONS.find((p) => p.value === datosRiesgo.plan)?.label ?? 'Vida Individual';

  // Calculate breakdown for PriceHero
  const basicPrima = coberturas.primaBreakdown.find((b) => b.coverageId === 'basico-vida')?.total ?? 0;
  const annexesPrima = coberturas.primaBreakdown
    .filter((b) => b.coverageId !== 'basico-vida')
    .reduce((sum, b) => sum + b.total, 0);
  const healthSurcharge = declaracion.extraprimaActive
    ? Math.round(coberturas.totalPrima * 0.15 * 100) / 100
    : 0;

  const canIssue = pdfDone || emailDone;

  const handleGeneratePDF = useCallback(async (): Promise<Blob | null> => {
    const result = await generateQuotePDF(quoteNumber);
    if (result.success && result.data) {
      setPdfDone(true);
      return result.data;
    }
    return null;
  }, [quoteNumber]);

  const handleEmailClose = useCallback(() => {
    setEmailModalOpen(false);
    setEmailDone(true);
  }, []);

  const handleIssue = useCallback(async () => {
    setIssueStatus('loading');
    try {
      const result = await initiateIssuance(quoteNumber);
      if (result.success) {
        const newPolicyNumber = generatePolicyNumber();
        // ~20% chance of provisoria
        const provisoria = Math.random() < 0.2;
        setPolicyNumber(newPolicyNumber);
        setIsProvisoria(provisoria);
        setIsIssued(true);
        dispatch({
          type: 'SET_STEP_DATA',
          step: 4,
          data: {
            resumen: {
              ...state.stepData.resumen,
              isIssued: true,
              policyNumber: newPolicyNumber,
              isProvisoria: provisoria,
            },
          },
        });
        setIssueStatus('success');

        // Guardar radicado con todos los datos del formulario de Vida
        saveRadicado({
          radicado: newPolicyNumber,
          ramo: 'Vida',
          fecha: new Date().toISOString(),
          identificacion: {
            tipo: datosRiesgo.tomador.documentType,
            numero: datosRiesgo.tomador.documentNumber,
          },
          nombre: `${datosRiesgo.tomador.nombres} ${datosRiesgo.tomador.apellidos}`,
          cotizacion: quoteNumber,
          poliza: newPolicyNumber,
          formData: JSON.parse(JSON.stringify(state.stepData)),
        });
      } else {
        setIssueStatus('error');
      }
    } catch {
      setIssueStatus('error');
    }
  }, [quoteNumber, state.stepData.resumen, dispatch]);

  const handleDashboard = useCallback(() => {
    dispatch({ type: 'RESET_WIZARD' });
  }, [dispatch]);

  const handleNuevaCotizacion = useCallback(() => {
    dispatch({ type: 'RESET_WIZARD' });
  }, [dispatch]);

  // Show success screen if issued
  if (isIssued) {
    return (
      <EmisionExito
        policyNumber={policyNumber}
        isProvisoria={isProvisoria}
        onDashboard={handleDashboard}
        onNuevaCotizacion={handleNuevaCotizacion}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* PriceHero */}
      <PriceHero
        totalPrima={coberturas.totalPrima}
        basicCoverage={basicPrima}
        annexes={annexesPrima}
        healthSurcharge={healthSurcharge}
        savings={0}
      />

      {/* Quote info */}
      <BentoCard>
        <h2 className="mb-3 text-h5 font-semibold text-gray-800">Información de Cotización</h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <dt className="text-gray-500">Número de cotización</dt>
          <dd className="font-medium text-gray-900">{quoteNumber}</dd>
          <dt className="text-gray-500">Fecha</dt>
          <dd className="font-medium text-gray-900">{formatDate(quoteDate)}</dd>
          <dt className="text-gray-500">Clave Asesor</dt>
          <dd className="font-medium text-gray-900">{advisorKey || '—'}</dd>
          <dt className="text-gray-500">Plan</dt>
          <dd className="font-medium text-gray-900">{planLabel}</dd>
          <dt className="text-gray-500">Valor Asegurado</dt>
          <dd className="font-medium text-gray-900">
            ${formatCurrency(selectedCoverages.reduce((s, c) => s + c.insuredValue, 0))}
          </dd>
        </dl>
      </BentoCard>

      {/* Tomador vs Asegurado comparison */}
      <BentoCard>
        <h2 className="mb-3 text-h5 font-semibold text-gray-800">Datos del Riesgo</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 text-h6 font-semibold text-[#005931]">Tomador</h3>
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">Nombre</dt><dd className="text-gray-900">{`${datosRiesgo.tomador.nombres} ${datosRiesgo.tomador.apellidos}`.trim() || '—'}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Documento</dt><dd className="text-gray-900">{datosRiesgo.tomador.documentType} {datosRiesgo.tomador.documentNumber}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Email</dt><dd className="text-gray-900">{datosRiesgo.tomador.email || '—'}</dd></div>
            </dl>
          </div>
          <div>
            <h3 className="mb-2 text-h6 font-semibold text-[#005931]">Asegurado</h3>
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">Nombre</dt><dd className="text-gray-900">{`${datosRiesgo.asegurado.nombres} ${datosRiesgo.asegurado.apellidos}`.trim() || '—'}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Documento</dt><dd className="text-gray-900">{datosRiesgo.asegurado.documentType} {datosRiesgo.asegurado.documentNumber}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">IMC</dt><dd className="text-gray-900">{declaracion.bmiResult ? declaracion.bmiResult.value.toFixed(1) : '—'}</dd></div>
            </dl>
          </div>
        </div>
      </BentoCard>

      {/* Coverage breakdown */}
      <BentoCard>
        <h2 className="mb-3 text-h5 font-semibold text-gray-800">Coberturas Seleccionadas</h2>
        {selectedCoverages.length === 0 ? (
          <p className="text-sm text-gray-400">Sin coberturas seleccionadas</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {coberturas.primaBreakdown
              .filter((b) => selectedCoverages.some((s) => s.coverageId === b.coverageId))
              .map((b) => (
                <li key={b.coverageId} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-gray-700">{b.coverageName}</span>
                  <span className="font-medium text-gray-900">${formatCurrency(b.total)}</span>
                </li>
              ))}
          </ul>
        )}
      </BentoCard>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setPdfModalOpen(true)}
          className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {pdfDone ? '✓ Descargar PDF' : 'Descargar PDF'}
        </button>
        <button
          type="button"
          onClick={() => setEmailModalOpen(true)}
          className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {emailDone ? '✓ Guardar y Enviar' : 'Guardar y Enviar'}
        </button>
        <button
          type="button"
          onClick={handleIssue}
          disabled={!canIssue || issueStatus === 'loading'}
          className={`rounded-md px-5 py-2 text-sm font-medium transition-colors ${
            canIssue && issueStatus !== 'loading'
              ? 'bg-[#005931] text-white hover:bg-[#005931]/90'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
          }`}
        >
          {issueStatus === 'loading' ? 'Procesando...' : 'Finalizar y Emitir'}
        </button>
      </div>

      {issueStatus === 'error' && (
        <p className="text-sm text-red-600">Error al emitir la póliza. Intente nuevamente.</p>
      )}

      {/* Modals */}
      <PDFPreviewModal
        isOpen={pdfModalOpen}
        onClose={() => { setPdfModalOpen(false); setPdfDone(true); }}
        quoteNumber={quoteNumber}
        onGeneratePDF={handleGeneratePDF}
      />

      <EmailModal
        isOpen={emailModalOpen}
        onClose={handleEmailClose}
        quoteNumber={quoteNumber}
        defaultEmail={datosRiesgo.tomador.email}
      />
    </div>
  );
}
