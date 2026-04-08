/**
 * Paso 1: Datos del Riesgo — Captura de Tomador, Asegurado, Plan, Tipo Persona y Datos Financieros.
 * Revelación progresiva: cada sección aparece al completar la anterior.
 * Ramo Vida Individual — Simón Ventas.
 */

import React, { useCallback, useMemo, useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ChevronDown, User, Shield, Briefcase, FileText } from 'lucide-react';
import { useWizard, useValidation, useAgeValidation } from '../../hooks';
import { validateEmail } from '../../utils';
import { FormField, BentoCard } from '../ui';
import { PlanSelector } from './PlanSelector';
import { TipoPersonaToggle } from './TipoPersonaToggle';
import { DatosFinancieros } from './DatosFinancieros';
import type { PersonData, PlanVida, TipoPersonaNatJur, RepresentanteLegal } from '../../types';

const DOCUMENT_TYPE_OPTIONS = [
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'CE', label: 'Cédula de Extranjería' },
  { value: 'TI', label: 'Tarjeta de Identidad' },
  { value: 'PA', label: 'Pasaporte' },
  { value: 'NIT', label: 'NIT' },
];

const GENDER_OPTIONS = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Femenino' },
];

const EMPTY_PERSON: PersonData = {
  nombres: '', apellidos: '', documentType: '', documentNumber: '',
  dateOfBirth: '', gender: '', email: '', phone: '', address: '',
};

const MOCK_ADVISORS: Record<string, string> = {
  'AS-998877': 'Carlos Alberto Figueroa Martínez',
  'AS-112233': 'María Fernanda López',
  'AS-445566': 'Juan Pablo Rodríguez',
};

/** Animación de entrada para secciones */
const sectionVariants = {
  hidden: { opacity: 0, y: 20, height: 0 },
  visible: { opacity: 1, y: 0, height: 'auto', transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -10, height: 0, transition: { duration: 0.2 } },
} as const;

/** Header de sección colapsable */
function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  isComplete,
  isOpen,
  onToggle,
  isVisible,
}: {
  icon: React.FC<{ className?: string; size?: number }>;
  title: string;
  subtitle: string;
  isComplete: boolean;
  isOpen: boolean;
  onToggle: () => void;
  isVisible: boolean;
}): React.JSX.Element | null {
  if (!isVisible) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all px-6 py-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
              isComplete ? 'bg-[#005931] text-white' : 'bg-[#005931]/10 text-[#005931]'
            }`}>
              {isComplete ? <CheckCircle size={20} /> : <Icon size={20} />}
            </div>
            <div className="text-left">
              <h3 className="text-sm font-bold text-[#002B49]">{title}</h3>
              <p className="text-xs text-gray-400">{subtitle}</p>
            </div>
          </div>
          <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>
    </motion.div>
  );
}

/** Mock de personas por número de documento */
const MOCK_PERSONS: Record<string, Omit<PersonData, 'tipo'>> = {
  '1129564302': {
    nombres: 'Carlos Alberto',
    apellidos: 'Figueroa Martínez',
    documentType: 'CC',
    documentNumber: '1129564302',
    dateOfBirth: '1990-05-15',
    gender: 'M',
    email: 'carlos.figueroa@segurosbolivar.com',
    phone: '3112234545',
    address: 'Calle 100 #15-20, Bogotá',
  },
};

function PersonFields({
  prefix, data, disabled, errors, onChange, onAutoPopulate,
}: {
  prefix: string; data: PersonData; disabled: boolean;
  errors: Record<string, string>; onChange: (field: string, value: string) => void;
  onAutoPopulate?: (person: Omit<PersonData, 'tipo'>) => void;
}): React.JSX.Element {
  const handle = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    onChange(e.target.name, e.target.value);

  const [docConfirmed, setDocConfirmed] = useState(false);

  const handleDocNumberBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const docNumber = e.target.value.trim();
    if (!docNumber || !data.documentType) return;
    setDocConfirmed(true);
    if (MOCK_PERSONS[docNumber] && onAutoPopulate) {
      onAutoPopulate(MOCK_PERSONS[docNumber]);
    }
  };

  // Reset confirmation if document number changes
  const prevDocRef = React.useRef(data.documentNumber);
  useEffect(() => {
    if (data.documentNumber !== prevDocRef.current) {
      setDocConfirmed(false);
      prevDocRef.current = data.documentNumber;
    }
  }, [data.documentNumber]);

  return (
    <div className="space-y-4">
      {/* Primero: Tipo y Número de documento */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormField label="Tipo de documento" name={`${prefix}_documentType`}
          value={data.documentType} onChange={handle} options={DOCUMENT_TYPE_OPTIONS}
          error={errors[`${prefix}_documentType`]} required disabled={disabled} />
        <div className="flex flex-col gap-1">
          <label htmlFor={`field-${prefix}_documentNumber`} className="text-sm font-medium text-gray-700">
            Número de documento<span className="ml-0.5 text-red-500">*</span>
          </label>
          <input
            id={`field-${prefix}_documentNumber`}
            name={`${prefix}_documentNumber`}
            type="text"
            value={data.documentNumber}
            onChange={handle}
            onBlur={handleDocNumberBlur}
            disabled={disabled}
            placeholder="Ingresa el número y presiona Tab"
            aria-invalid={!!errors[`${prefix}_documentNumber`]}
            className="sb-ui-input w-full"
          />
          {errors[`${prefix}_documentNumber`] && (
            <p className="text-xs text-red-600" role="alert">{errors[`${prefix}_documentNumber`]}</p>
          )}
        </div>
      </div>

      {/* Resto de campos: aparecen solo después de confirmar documento (blur) */}
      <AnimatePresence>
        {docConfirmed && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {data.nombres && (
              <div className="flex items-center gap-2 mb-4 text-xs text-[#005931]">
                <CheckCircle size={14} />
                <span>Datos cargados para: <strong>{data.nombres} {data.apellidos}</strong></span>
              </div>
            )}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField label="Nombres" name={`${prefix}_nombres`} value={data.nombres}
                onChange={handle} error={errors[`${prefix}_nombres`]} required disabled={disabled} />
              <FormField label="Apellidos" name={`${prefix}_apellidos`} value={data.apellidos}
                onChange={handle} error={errors[`${prefix}_apellidos`]} required disabled={disabled} />
              <FormField label="Fecha de nacimiento" name={`${prefix}_dateOfBirth`} type="date"
                value={data.dateOfBirth} onChange={handle}
                error={errors[`${prefix}_dateOfBirth`]} required disabled={disabled} />
              <FormField label="Género" name={`${prefix}_gender`} value={data.gender}
                onChange={handle} options={GENDER_OPTIONS}
                error={errors[`${prefix}_gender`]} required disabled={disabled} />
              <FormField label="Correo electrónico" name={`${prefix}_email`} type="email"
                value={data.email} onChange={handle}
                error={errors[`${prefix}_email`]} required disabled={disabled} />
              <FormField label="Teléfono" name={`${prefix}_phone`} value={data.phone}
                onChange={handle} error={errors[`${prefix}_phone`]} required disabled={disabled} />
              <FormField label="Dirección" name={`${prefix}_address`} value={data.address}
                onChange={handle} error={errors[`${prefix}_address`]} required disabled={disabled}
                placeholder="Dirección de residencia" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


export function DatosRiesgo(): React.JSX.Element {
  const { state, dispatch } = useWizard();
  const { errors, validateField } = useValidation();
  const dr = state.stepData.datosRiesgo;
  const { tomador, asegurado, isSameAsInsured } = dr;

  const aseguradoDob = isSameAsInsured ? tomador.dateOfBirth : asegurado.dateOfBirth;
  const { age, isValid: isAgeValid, errorMessage: ageError } = useAgeValidation(aseguradoDob);

  // Section open/close state — all start open for the first visible one
  const [openSections, setOpenSections] = useState<Set<number>>(() => new Set([1]));

  const toggleSection = useCallback((n: number) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      next.has(n) ? next.delete(n) : next.add(n);
      return next;
    });
  }, []);

  // Completion checks for progressive reveal
  const isSection1Complete = useMemo(() => !!dr.claveIntermediario && !!dr.nombreAsesor, [dr.claveIntermediario, dr.nombreAsesor]);
  const isSection2Complete = useMemo(() => !!dr.plan, [dr.plan]);
  const isSection3Complete = useMemo(() => {
    const t = tomador;
    return !!(t.nombres && t.apellidos && t.documentType && t.documentNumber && t.dateOfBirth && t.gender && t.email && t.phone);
  }, [tomador]);
  const isSection4Complete = useMemo(() => {
    if (isSameAsInsured) return true;
    const a = asegurado;
    return !!(a.nombres && a.apellidos && a.documentType && a.documentNumber && a.dateOfBirth && a.gender && a.email && a.phone);
  }, [asegurado, isSameAsInsured]);

  // Auto-open next section when current completes
  useEffect(() => {
    if (isSection1Complete && !openSections.has(2)) {
      setOpenSections(prev => new Set([...prev, 2]));
    }
  }, [isSection1Complete]);
  useEffect(() => {
    if (isSection2Complete && !openSections.has(3)) {
      setOpenSections(prev => new Set([...prev, 3]));
    }
  }, [isSection2Complete]);
  useEffect(() => {
    if (isSection3Complete && !openSections.has(4)) {
      setOpenSections(prev => new Set([...prev, 4]));
    }
  }, [isSection3Complete]);
  useEffect(() => {
    if (isSection4Complete && !openSections.has(5)) {
      setOpenSections(prev => new Set([...prev, 5]));
    }
  }, [isSection4Complete]);

  const updateDatosRiesgo = useCallback(
    (patch: Partial<typeof dr>) => {
      dispatch({ type: 'SET_STEP_DATA', step: 1, data: { datosRiesgo: { ...dr, ...patch } } });
    },
    [dr, dispatch],
  );

  const updateField = useCallback(
    (role: 'tomador' | 'asegurado', field: string, value: string) => {
      const rawField = field.replace(/^(tomador|asegurado)_/, '');
      const updatedPerson = { ...dr[role], [rawField]: value };
      const patch: Record<string, unknown> = { [role]: updatedPerson };
      if (role === 'tomador' && isSameAsInsured) {
        patch.asegurado = { ...updatedPerson, tipo: 'asegurado' };
      }
      dispatch({ type: 'SET_STEP_DATA', step: 1, data: { datosRiesgo: { ...dr, ...patch } as typeof dr } });
      if (rawField === 'email') {
        validateField(`${role}_email`, value, validateEmail);
      }
    },
    [dr, isSameAsInsured, dispatch, validateField],
  );

  const handleTomadorChange = useCallback(
    (field: string, value: string) => updateField('tomador', field, value), [updateField]);
  const handleAseguradoChange = useCallback(
    (field: string, value: string) => updateField('asegurado', field, value), [updateField]);

  const handleSameToggle = useCallback(() => {
    const next = !isSameAsInsured;
    const newAsegurado = next
      ? { ...tomador, tipo: 'asegurado' as const }
      : { ...EMPTY_PERSON, tipo: 'asegurado' as const } as typeof asegurado;
    updateDatosRiesgo({ isSameAsInsured: next, asegurado: newAsegurado });
  }, [isSameAsInsured, tomador, asegurado, updateDatosRiesgo]);

  const handlePlanChange = useCallback((plan: PlanVida) => updateDatosRiesgo({ plan }), [updateDatosRiesgo]);
  const handleTipoPersonaChange = useCallback((tipo: TipoPersonaNatJur) => updateDatosRiesgo({ tipoPersonaNatJur: tipo }), [updateDatosRiesgo]);
  const handleRepresentanteChange = useCallback(
    (data: Partial<RepresentanteLegal>) => updateDatosRiesgo({ representanteLegal: { ...dr.representanteLegal, ...data } }),
    [dr.representanteLegal, updateDatosRiesgo]);
  const handleClaveIntermediarioChange = useCallback(
    (value: string) => {
      const nombre = MOCK_ADVISORS[value.toUpperCase()] ?? '';
      updateDatosRiesgo({ claveIntermediario: value, nombreAsesor: nombre });
    }, [updateDatosRiesgo]);

  const allErrors = { ...errors };
  if (ageError && aseguradoDob) allErrors['asegurado_dateOfBirth'] = ageError;

  return (
    <div className="space-y-4">
      {/* Section 1: Asesor */}
      <SectionHeader icon={User} title="Información del Asesor" subtitle="Clave del intermediario y validación"
        isComplete={isSection1Complete} isOpen={openSections.has(1)}
        onToggle={() => toggleSection(1)} isVisible />
      <AnimatePresence>
        {openSections.has(1) && (
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" exit="exit" className="overflow-hidden">
            <div className="rounded-2xl bg-white border border-gray-100 shadow-xl p-6 md:p-8">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FormField label="Clave del Intermediario" name="claveIntermediario" value={dr.claveIntermediario}
                  onChange={(e) => handleClaveIntermediarioChange(e.target.value)} required placeholder="Escribe tu clave. Ej: AS-998877" />
                <FormField label="Nombre del Asesor" name="nombreAsesor" value={dr.nombreAsesor}
                  onChange={() => {}} disabled placeholder="Se autocompleta al validar la clave" />
              </div>
              {dr.claveIntermediario.length >= 4 && !dr.nombreAsesor && (
                <p className="mt-3 text-xs text-yellow-600">Clave no encontrada. Verifica e intenta de nuevo.</p>
              )}
              {dr.nombreAsesor && (
                <div className="mt-3 flex items-center gap-2 text-xs text-[#005931]">
                  <CheckCircle size={14} />
                  <span>Asesor validado: <strong>{dr.nombreAsesor}</strong></span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section 2: Plan + Tipo Persona */}
      <SectionHeader icon={Shield} title="Selección de Plan" subtitle="Elige el producto y tipo de persona"
        isComplete={isSection2Complete} isOpen={openSections.has(2)}
        onToggle={() => toggleSection(2)} isVisible={isSection1Complete || openSections.has(2)} />
      <AnimatePresence>
        {openSections.has(2) && (isSection1Complete || isSection2Complete) && (
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" exit="exit" className="overflow-hidden">
            <div className="rounded-2xl bg-white border border-gray-100 shadow-xl p-6 md:p-8 space-y-6">
              <PlanSelector value={dr.plan} onChange={handlePlanChange} />
              <TipoPersonaToggle value={dr.tipoPersonaNatJur} onChange={handleTipoPersonaChange}
                representanteLegal={dr.representanteLegal} onRepresentanteChange={handleRepresentanteChange} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section 3: Tomador */}
      <SectionHeader icon={User} title="Datos del Tomador" subtitle="Información de quien contrata el seguro"
        isComplete={isSection3Complete} isOpen={openSections.has(3)}
        onToggle={() => toggleSection(3)} isVisible={isSection2Complete || openSections.has(3)} />
      <AnimatePresence>
        {openSections.has(3) && (isSection2Complete || isSection3Complete) && (
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" exit="exit" className="overflow-hidden">
            <div className="rounded-2xl bg-white border border-gray-100 shadow-xl p-6 md:p-8">
              <PersonFields prefix="tomador" data={tomador} disabled={false} errors={allErrors} onChange={handleTomadorChange}
                onAutoPopulate={(person) => {
                  updateDatosRiesgo({
                    tomador: { ...person, tipo: 'tomador' } as typeof tomador,
                    ...(isSameAsInsured ? { asegurado: { ...person, tipo: 'asegurado' } as typeof asegurado } : {}),
                  });
                }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section 4: Asegurado */}
      <SectionHeader icon={Shield} title="Datos del Asegurado" subtitle="¿Quién será la persona protegida por esta póliza?"
        isComplete={isSection4Complete} isOpen={openSections.has(4)}
        onToggle={() => toggleSection(4)} isVisible={isSection3Complete || openSections.has(4)} />
      <AnimatePresence>
        {openSections.has(4) && (isSection3Complete || isSection4Complete) && (
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" exit="exit" className="overflow-hidden">
            <div className="rounded-2xl bg-white border border-gray-100 shadow-xl p-6 md:p-8 space-y-5">

              {/* Toggle estilo Autos */}
              <div className="flex items-center justify-between rounded-xl bg-gray-50 border border-gray-200 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#005931]/10">
                    <User size={20} className="text-[#005931]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#002B49]">¿Es el mismo tomador?</p>
                    <p className="text-xs text-gray-400">Marca esta opción si el tomador es el mismo asegurado.</p>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isSameAsInsured}
                  onClick={handleSameToggle}
                  className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                    isSameAsInsured ? 'bg-[#005931]' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    isSameAsInsured ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Si es el mismo: muestra datos del tomador en resumen */}
              {isSameAsInsured && tomador.nombres && (
                <div className="flex items-center gap-2 text-xs text-[#005931]">
                  <CheckCircle size={14} />
                  <span>Asegurado: <strong>{tomador.nombres} {tomador.apellidos}</strong> — {tomador.documentType} {tomador.documentNumber}</span>
                </div>
              )}

              {/* Si NO es el mismo: formulario de asegurado */}
              {!isSameAsInsured && (
                <PersonFields prefix="asegurado" data={asegurado} disabled={false} errors={allErrors} onChange={handleAseguradoChange}
                  onAutoPopulate={(person) => {
                    updateDatosRiesgo({ asegurado: { ...person, tipo: 'asegurado' } as typeof asegurado });
                  }} />
              )}

              {age >= 0 && (
                <p className={`text-xs ${isAgeValid ? 'text-[#005931]' : 'text-red-600'}`}>
                  Edad del asegurado: {age} años {!isAgeValid && ageError ? `— ${ageError}` : ''}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section 5: Datos Financieros + Consentimiento */}
      <SectionHeader icon={Briefcase} title="Datos Financieros" subtitle="Información laboral y económica"
        isComplete={!!dr.ciudad && !!dr.ocupacion} isOpen={openSections.has(5)}
        onToggle={() => toggleSection(5)} isVisible={isSection4Complete || openSections.has(5)} />
      <AnimatePresence>
        {openSections.has(5) && isSection4Complete && (
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" exit="exit" className="overflow-hidden">
            <div className="rounded-2xl bg-white border border-gray-100 shadow-xl p-6 md:p-8 space-y-6">
              <DatosFinancieros
                ingresoMensual={dr.ingresoMensual}
                onIngresoChange={(value) => updateDatosRiesgo({ ingresoMensual: value })}
                ciudad={dr.ciudad} onCiudadChange={(v) => updateDatosRiesgo({ ciudad: v })}
                ocupacion={dr.ocupacion} onOcupacionChange={(v) => updateDatosRiesgo({ ocupacion: v })}
                actividadEconomica={dr.actividadEconomica} onActividadChange={(v) => updateDatosRiesgo({ actividadEconomica: v })}
                relacionLaboral={dr.relacionLaboral} onRelacionLaboralChange={(v) => updateDatosRiesgo({ relacionLaboral: v })}
              />

              {/* Consentimiento */}
              <div className="border-t border-gray-100 pt-4">
                <label className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={dr.aceptaTratamientoDatos}
                    onChange={() => updateDatosRiesgo({ aceptaTratamientoDatos: !dr.aceptaTratamientoDatos })}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-[#005931]" />
                  <span>Autorizo el tratamiento de mis datos personales de acuerdo con la política de privacidad de Seguros Bolívar.</span>
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
